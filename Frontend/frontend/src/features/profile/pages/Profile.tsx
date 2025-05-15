import { useEffect, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useParams, Link } from "react-router-dom";
import classes from "./Profile.module.scss";
import { Box } from "../../authentication/components/box/Box";
import { Layout } from "../../authentication/components/layout/Layout";
import { Loader } from "../../../component/loader/Loader";
import { Button } from "../../authentication/components/button/Button";
import { Input } from "../../authentication/components/input/Input";
import { useAuthentication } from "../../authentication/contexts/AuthenticationContextProvider";
import { Navbar } from '../../../component/Navbar';

interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
    role: string;
    name: string | null;
    surname: string | null;
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    credentialsNonExpired: boolean;
    enabled: boolean;
    authorities: Array<{ authority: string }>;
}

interface Profile {
    profileId: number;
    user: User;
    location: string | null;
    summary: string | null;
}

interface Skill {
    id: number;
    skillName: string;
    profile: Profile;
}

interface Education {
    educationId: number;
    profile: Profile;
    institutionName: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
}

interface Experience {
    experienceId: number;
    profile: Profile;
    companyName: string;
    jobTitle: string | null;
    startDate: string;
    endDate: string;
    description: string | null;
}

interface Connection {
    connectionId: number;
    sender: User;
    receiver: User;
    status: 'ACCEPTED';
    createdAt: string;
}

interface ProfileData {
    profile: Profile;
    skills: Skill[];
    education: Education[];
    experience: Experience[];
}

interface EducationFormData {
    institutionName: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
}

interface ExperienceFormData {
    companyName: string;
    description: string;
    startDate: string;
    endDate: string;
}

export function Profile() {
    const { username } = useParams();
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showSkillForm, setShowSkillForm] = useState(false);
    const [isSubmittingSkill, setIsSubmittingSkill] = useState(false);
    const [newSkill, setNewSkill] = useState("");
    const [skillError, setSkillError] = useState<string | null>(null);
    const [showEducationForm, setShowEducationForm] = useState(false);
    const [isSubmittingEducation, setIsSubmittingEducation] = useState(false);
    const [educationError, setEducationError] = useState<string | null>(null);
    const [educationForm, setEducationForm] = useState<EducationFormData>({
        institutionName: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: ""
    });
    const [showExperienceForm, setShowExperienceForm] = useState(false);
    const [isSubmittingExperience, setIsSubmittingExperience] = useState(false);
    const [experienceError, setExperienceError] = useState<string | null>(null);
    const [experienceForm, setExperienceForm] = useState<ExperienceFormData>({
        companyName: "",
        description: "",
        startDate: "",
        endDate: ""
    });
    const auth = useAuthentication();
    const isOwnProfile = auth?.user?.username === username;
    const [editingLocation, setEditingLocation] = useState(false);
    const [editingSummary, setEditingSummary] = useState(false);
    const [locationInput, setLocationInput] = useState("");
    const [summaryInput, setSummaryInput] = useState("");
    const [locationError, setLocationError] = useState<string | null>(null);
    const [summaryError, setSummaryError] = useState<string | null>(null);
    const [isSavingLocation, setIsSavingLocation] = useState(false);
    const [isSavingSummary, setIsSavingSummary] = useState(false);
    const [posts, setPosts] = useState<any[]>([]);
    const [showAllPosts, setShowAllPosts] = useState(false);
    const [postsLoading, setPostsLoading] = useState(false);
    const [postsError, setPostsError] = useState<string | null>(null);
    const [likeLoading, setLikeLoading] = useState<{[postId: number]: boolean}>({});
    const [likeCounts, setLikeCounts] = useState<{[postId: number]: number}>({});
    const [commentInputs, setCommentInputs] = useState<{[postId: number]: string}>({});
    const [comments, setComments] = useState<{[postId: number]: any[]}>({});
    const [deleteLoading, setDeleteLoading] = useState<{[postId: number]: boolean}>({});
    const [removingConnections, setRemovingConnections] = useState<Set<number>>(new Set());
    const [isSendingRequest, setIsSendingRequest] = useState(false);
    const [pendingConnections, setPendingConnections] = useState<Connection[]>([]);

    const fetchProfileData = async () => {
        if (!username) return;
        
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/profile/get-profile/${username}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Accept": "application/json"
                },
                credentials: "include"
            });

            if (!response.ok) {
                if (response.status === 404) {
                    setProfileData(null);
                    setError("Profile not found");
                    return;
                }
                throw new Error("Failed to fetch profile");
            }

            const profileData = await response.json();
            console.log("Profile data received:", profileData);

            // Ensure the data structure matches our interface
            if (!profileData || !profileData.user || typeof profileData.profileId !== 'number') {
                throw new Error("Invalid profile data received from server");
            }

            // Fetch additional data in parallel
            const [skillsResponse, educationResponse, experienceResponse] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_URL}/skills/profile/${profileData.profileId}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Accept": "application/json"
                    },
                    credentials: "include"
                }),
                fetch(`${import.meta.env.VITE_API_URL}/education/profile/${profileData.profileId}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Accept": "application/json"
                    },
                    credentials: "include"
                }),
                fetch(`${import.meta.env.VITE_API_URL}/experiences/profile/${profileData.profileId}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Accept": "application/json"
                    },
                    credentials: "include"
                })
            ]);

            const [skills, education, experience] = await Promise.all([
                skillsResponse.ok ? skillsResponse.json() : [],
                educationResponse.ok ? educationResponse.json() : [],
                experienceResponse.ok ? experienceResponse.json() : []
            ]);

            setProfileData({
                profile: profileData,
                skills,
                education,
                experience
            });

        } catch (error) {
            console.error("Error fetching profile:", error);
            setError(error instanceof Error ? error.message : "Failed to fetch profile");
            setProfileData(null);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchConnections = async () => {
        if (!username) return;
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/connections/get-connections-of-user/${username}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Accept": "application/json"
                },
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error("Failed to fetch connections");
            }

            const data = await response.json();
            setConnections(data);
        } catch (err) {
            console.error("Error fetching connections:", err);
            // Don't set error state as this is not critical
        }
    };

    const fetchPendingConnections = async () => {
        if (!username || !auth?.user?.username) return;
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/connections/pending-connections-sender`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Accept": "application/json"
                },
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error("Failed to fetch pending connections");
            }

            const data = await response.json();
            setPendingConnections(data);
        } catch (err) {
            console.error("Error fetching pending connections:", err);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                await fetchProfileData();
                await fetchConnections();
                await fetchPendingConnections();
            } catch (err) {
                console.error("Error loading data:", err);
                setError(err instanceof Error ? err.message : "Failed to load data");
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [username]);

    useEffect(() => {
        const fetchPosts = async () => {
            if (!profileData?.profile.profileId) return;
            setPostsLoading(true);
            setPostsError(null);
            try {
                const response = await fetch(`http://localhost:8080/post/get-profile-posts/${profileData.profile.profileId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Accept': 'application/json',
                    },
                    credentials: 'include',
                });
                if (!response.ok) throw new Error('Failed to fetch posts');
                const data = await response.json();
                // Sort by createdAt descending
                data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setPosts(data);
                // Fetch like counts and comments for each post
                for (const post of data) {
                    fetchLikeCount(post.postId);
                    fetchComments(post.postId);
                }
            } catch (err) {
                setPostsError('Failed to load posts');
            } finally {
                setPostsLoading(false);
            }
        };
        fetchPosts();
        // eslint-disable-next-line
    }, [profileData?.profile.profileId]);

    const fetchLikeCount = async (postId: number) => {
        try {
            const response = await fetch(`http://localhost:8080/like/post/${postId}/like-count`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': 'application/json',
                },
                credentials: 'include',
            });
            if (!response.ok) return;
            const count = await response.json();
            setLikeCounts(prev => ({ ...prev, [postId]: count }));
        } catch {}
    };

    const fetchComments = async (postId: number) => {
        try {
            const response = await fetch(`http://localhost:8080/comment/post/${postId}/comments`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': 'application/json',
                },
                credentials: 'include',
            });
            if (!response.ok) return;
            const data = await response.json();
            setComments(prev => ({ ...prev, [postId]: data }));
        } catch {}
    };

    const handleAddSkill = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSkillError(null);

        if (!profileData?.profile.profileId) {
            setSkillError("Profile ID not found");
            return;
        }

        if (!newSkill.trim()) {
            setSkillError("Skill name cannot be empty");
            return;
        }

        if (!localStorage.getItem("token")) {
            setSkillError("You must be logged in to add skills");
            return;
        }

        setIsSubmittingSkill(true);

        try {
            console.log("Adding skill:", {
                skillName: newSkill.trim(),
                profileId: profileData.profile.profileId
            });

            const response = await fetch(`${import.meta.env.VITE_API_URL}/skills/create-skill`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    skillName: newSkill.trim(),
                    profileId: profileData.profile.profileId
                }),
                mode: "cors",
                credentials: "include"
            });

            console.log("Skill creation response status:", response.status);

            if (!response.ok) {
                const text = await response.text();
                console.error("Skill creation error:", text);
                throw new Error(text || `Failed to add skill: ${response.status}`);
            }

            const addedSkill = await response.json();
            console.log("Added skill:", addedSkill);

            // Update the profile data with the new skill
            setProfileData(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    skills: [...prev.skills, addedSkill]
                };
            });

            // Clear the form and hide it
            setNewSkill("");
            setShowSkillForm(false);
        } catch (err) {
            console.error("Error adding skill:", err);
            setSkillError(err instanceof Error ? err.message : "Failed to add skill. Please try again.");
        } finally {
            setIsSubmittingSkill(false);
        }
    };

    const handleEducationChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEducationForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddEducation = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setEducationError(null);

        if (!profileData?.profile.profileId) {
            setEducationError("Profile ID not found");
            return;
        }

        if (!localStorage.getItem("token")) {
            setEducationError("You must be logged in to add education");
            return;
        }

        // Validate required fields
        const requiredFields = ["institutionName", "degree", "fieldOfStudy", "startDate"];
        const missingFields = requiredFields.filter(field => !educationForm[field as keyof EducationFormData]);
        
        if (missingFields.length > 0) {
            setEducationError(`Please fill in all required fields: ${missingFields.join(", ")}`);
            return;
        }

        // Validate dates
        if (educationForm.endDate && new Date(educationForm.startDate) > new Date(educationForm.endDate)) {
            setEducationError("End date cannot be before start date");
            return;
        }

        setIsSubmittingEducation(true);

        try {
            console.log("Adding education:", {
                ...educationForm,
                profileId: profileData.profile.profileId
            });

            const response = await fetch(`${import.meta.env.VITE_API_URL}/education/create-education`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    ...educationForm,
                    profileId: profileData.profile.profileId
                }),
                mode: "cors",
                credentials: "include"
            });

            console.log("Education creation response status:", response.status);

            if (!response.ok) {
                const text = await response.text();
                console.error("Education creation error:", text);
                throw new Error(text || `Failed to add education: ${response.status}`);
            }

            const addedEducation = await response.json();
            console.log("Added education:", addedEducation);

            // Update the profile data with the new education
            setProfileData(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    education: [...prev.education, addedEducation]
                };
            });

            // Clear the form and hide it
            setEducationForm({
                institutionName: "",
                degree: "",
                fieldOfStudy: "",
                startDate: "",
                endDate: ""
            });
            setShowEducationForm(false);
        } catch (err) {
            console.error("Error adding education:", err);
            setEducationError(err instanceof Error ? err.message : "Failed to add education. Please try again.");
        } finally {
            setIsSubmittingEducation(false);
        }
    };

    const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setExperienceForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddExperience = async (e: React.FormEvent) => {
        e.preventDefault();
        setExperienceError(null);

        if (!profileData?.profile.profileId) {
            setExperienceError("Profile ID not found");
            return;
        }

        if (!experienceForm.companyName || !experienceForm.description || !experienceForm.startDate) {
            setExperienceError("Please fill in all required fields");
            return;
        }

        if (experienceForm.endDate && new Date(experienceForm.endDate) < new Date(experienceForm.startDate)) {
            setExperienceError("End date must be after start date");
            return;
        }

        setIsSubmittingExperience(true);

        try {
            console.log("Adding experience:", {
                ...experienceForm,
                profileId: profileData.profile.profileId
            });

            const response = await fetch(`${import.meta.env.VITE_API_URL}/experiences/create-experience`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    ...experienceForm,
                    profileId: profileData.profile.profileId
                }),
                mode: "cors",
                credentials: "include"
            });

            console.log("Experience creation response status:", response.status);

            if (!response.ok) {
                const text = await response.text();
                console.error("Experience creation error:", text);
                throw new Error(text || `Failed to add experience: ${response.status}`);
            }

            const addedExperience = await response.json();
            console.log("Added experience:", addedExperience);

            // Update the profile data with the new experience
            setProfileData(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    experience: [...prev.experience, addedExperience]
                };
            });

            // Clear the form and hide it
            setExperienceForm({
                companyName: "",
                description: "",
                startDate: "",
                endDate: ""
            });
            setShowExperienceForm(false);
        } catch (err) {
            console.error("Error adding experience:", err);
            setExperienceError(err instanceof Error ? err.message : "Failed to add experience. Please try again.");
        } finally {
            setIsSubmittingExperience(false);
        }
    };

    const handleDeleteSkill = async (skillId: number) => {
        if (!isOwnProfile) return;
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/skills/delete-skill/${skillId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Accept": "application/json"
                },
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error("Failed to delete skill");
            }

            // Update the profile data by removing the deleted skill
            setProfileData(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    skills: prev.skills.filter(skill => skill.id !== skillId)
                };
            });
        } catch (err) {
            console.error("Error deleting skill:", err);
            setSkillError(err instanceof Error ? err.message : "Failed to delete skill");
        }
    };

    const handleDeleteEducation = async (educationId: number) => {
        if (!isOwnProfile) return;
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/education/delete-education/${educationId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Accept": "application/json"
                },
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error("Failed to delete education");
            }

            // Update the profile data by removing the deleted education
            setProfileData(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    education: prev.education.filter(edu => edu.educationId !== educationId)
                };
            });
        } catch (err) {
            console.error("Error deleting education:", err);
            setEducationError(err instanceof Error ? err.message : "Failed to delete education");
        }
    };

    const handleDeleteExperience = async (experienceId: number) => {
        if (!isOwnProfile) return;
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/experiences/delete-experience/${experienceId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Accept": "application/json"
                },
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error("Failed to delete experience");
            }

            // Update the profile data by removing the deleted experience
            setProfileData(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    experience: prev.experience.filter(exp => exp.experienceId !== experienceId)
                };
            });
        } catch (err) {
            console.error("Error deleting experience:", err);
            setExperienceError(err instanceof Error ? err.message : "Failed to delete experience");
        }
    };

    const handleLike = async (postId: number) => {
        setLikeLoading(prev => ({ ...prev, [postId]: true }));
        try {
            const response = await fetch('http://localhost:8080/like/like-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ postId }),
                credentials: 'include',
            });
            if (response.ok) {
                fetchLikeCount(postId);
            }
        } catch {}
        setLikeLoading(prev => ({ ...prev, [postId]: false }));
    };

    const handleAddComment = async (postId: number) => {
        const comment = commentInputs[postId]?.trim();
        if (!comment) return;
        try {
            const response = await fetch('http://localhost:8080/comment/create-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ content: comment, postId }),
                credentials: 'include',
            });
            if (response.ok) {
                setCommentInputs(prev => ({ ...prev, [postId]: '' }));
                fetchComments(postId);
            }
        } catch {}
    };

    const handleDeletePost = async (postId: number) => {
        if (!isOwnProfile) return;
        
        setDeleteLoading(prev => ({ ...prev, [postId]: true }));
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/post/delete-post/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to delete post');
            }

            // Remove the post from state
            setPosts(prev => prev.filter(post => post.postId !== postId));
        } catch (err) {
            console.error('Error deleting post:', err);
            alert('Failed to delete post. Please try again.');
        } finally {
            setDeleteLoading(prev => ({ ...prev, [postId]: false }));
        }
    };

    const handleDeleteComment = async (commentId: number, postId: number) => {
        setDeleteLoading(prev => ({ ...prev, [commentId]: true }));
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/comment/delete-comment/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': 'application/json',
                },
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to delete comment');
            setComments(prev => ({
                ...prev,
                [postId]: prev[postId].filter(c => c.commentId !== commentId)
            }));
        } catch (err) {
            alert('Failed to delete comment. Please try again.');
        } finally {
            setDeleteLoading(prev => ({ ...prev, [commentId]: false }));
        }
    };

    const handleRemoveConnection = async (connectionId: number) => {
        if (!isOwnProfile) return;
        
        setRemovingConnections(prev => new Set(prev).add(connectionId));
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/connections/remove-connection/${connectionId}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Accept": "application/json"
                },
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error("Failed to remove connection");
            }

            // Remove the connection from state
            setConnections(prev => prev.filter(conn => conn.connectionId !== connectionId));
        } catch (err) {
            console.error("Error removing connection:", err);
            alert("Failed to remove connection. Please try again.");
        } finally {
            setRemovingConnections(prev => {
                const next = new Set(prev);
                next.delete(connectionId);
                return next;
            });
        }
    };

    const isConnected = connections.some(conn => 
        conn.sender.username === auth?.user?.username || 
        conn.receiver.username === auth?.user?.username
    );

    const isPending = pendingConnections.some(conn => 
        (conn.sender.username === auth?.user?.username && conn.receiver.username === username) ||
        (conn.sender.username === username && conn.receiver.username === auth?.user?.username)
    );

    const handleConnect = async () => {
        if (!auth?.user?.username || isOwnProfile || isConnected) return;
        
        setIsSendingRequest(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/connections/send-connection`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Accept": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ username })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to send connection request");
            }

            // Refresh connections after sending request
            await fetchConnections();
        } catch (err) {
            console.error("Error sending connection request:", err);
            alert(err instanceof Error ? err.message : "Failed to send connection request");
        } finally {
            setIsSendingRequest(false);
        }
    };

    if (isLoading) {
        return (
            <>
                <Navbar />
                <Layout className={classes.root}>
                    <div className={classes.container}>
                        <Loader />
                    </div>
                </Layout>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <Layout className={classes.root}>
                    <div className={classes.container}>
                        <Box className={classes.errorBox}>
                            <h2>Error</h2>
                            <p>{error}</p>
                        </Box>
                    </div>
                </Layout>
            </>
        );
    }

    if (!profileData || !profileData.profile) {
        return (
            <>
                <Navbar />
                <Layout className={classes.root}>
                    <div className={classes.container}>
                        <Box className={classes.errorBox}>
                            <h2>Profile Not Found</h2>
                            <p>The profile you're looking for doesn't exist or is not accessible.</p>
                        </Box>
                    </div>
                </Layout>
            </>
        );
    }

    const fullName = [profileData.profile.user.name, profileData.profile.user.surname]
        .filter(Boolean)
        .join(' ') || profileData.profile.user.username;

    return (
        <>
            <Navbar />
            <Layout className={classes.root} hideHeader={true}>
                <div className={classes.container}>
                    {/* Profile Header */}
                    <Box className={classes.header}>
                        <div className={classes.coverPhoto}></div>
                        <div className={classes.profileInfo}>
                            <div className={classes.profilePhoto}></div>
                            <h1>{fullName}</h1>
                            {!isOwnProfile && (
                                <>
                                    {isPending ? (
                                        <button
                                            className={`${classes.connectButton} ${classes.pending}`}
                                            disabled
                                        >
                                            Pending
                                        </button>
                                    ) : !isConnected && (
                                        <button
                                            className={classes.connectButton}
                                            onClick={handleConnect}
                                            disabled={isSendingRequest}
                                        >
                                            {isSendingRequest ? "Sending..." : "Connect"}
                                        </button>
                                    )}
                                </>
                            )}
                            {isOwnProfile ? (
                                editingLocation ? (
                                    <form
                                        onSubmit={async (e) => {
                                            e.preventDefault();
                                            setIsSavingLocation(true);
                                            setLocationError(null);
                                            try {
                                                const token = localStorage.getItem("token");
                                                const response = await fetch("http://localhost:8080/profile/edit-location", {
                                                    method: "PUT",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                        "Authorization": `Bearer ${token}`,
                                                    },
                                                    body: JSON.stringify({ location: locationInput }),
                                                });
                                                if (!response.ok) throw new Error(await response.text());
                                                setProfileData(prev => prev && ({
                                                    ...prev,
                                                    profile: { ...prev.profile, location: locationInput }
                                                }));
                                                setEditingLocation(false);
                                            } catch (err) {
                                                setLocationError("Failed to update location.");
                                            } finally {
                                                setIsSavingLocation(false);
                                            }
                                        }}
                                        style={{ display: "flex", alignItems: "center", gap: 8 }}
                                    >
                                        <input
                                            value={locationInput}
                                            onChange={e => setLocationInput(e.target.value)}
                                            disabled={isSavingLocation}
                                            className={classes.input}
                                            style={{ minWidth: 120 }}
                                        />
                                        <button type="submit" disabled={isSavingLocation} className={classes.miniButton}>Save</button>
                                        <button type="button" onClick={() => setEditingLocation(false)} className={classes.miniButton}>Cancel</button>
                                        {locationError && <span className={classes.error}>{locationError}</span>}
                                    </form>
                                ) : (
                                    <p className={classes.location}>
                                        {profileData.profile.location}
                                        <button
                                            className={classes.miniButton}
                                            style={{ marginLeft: 8 }}
                                            onClick={() => {
                                                setLocationInput(profileData.profile.location || "");
                                                setEditingLocation(true);
                                            }}
                                            title="Edit location"
                                        >✎</button>
                                    </p>
                                )
                            ) : (
                                profileData.profile.location && <p className={classes.location}>{profileData.profile.location}</p>
                            )}
                        </div>
                    </Box>

                    {/* Main Content */}
                    <div className={classes.content}>
                        {/* Left Column */}
                        <div className={classes.leftColumn}>
                            {/* About Section */}
                            <Box className={classes.section}>
                                <h2>About</h2>
                                {isOwnProfile ? (
                                    editingSummary ? (
                                        <form
                                            onSubmit={async (e) => {
                                                e.preventDefault();
                                                setIsSavingSummary(true);
                                                setSummaryError(null);
                                                try {
                                                    const token = localStorage.getItem("token");
                                                    const response = await fetch(`${import.meta.env.VITE_API_URL}/profile/edit-about`, {
                                                        method: "PUT",
                                                        headers: {
                                                            "Content-Type": "application/json",
                                                            "Authorization": `Bearer ${token}`,
                                                        },
                                                        body: JSON.stringify({ summary: summaryInput }),
                                                    });
                                                    if (!response.ok) throw new Error(await response.text());
                                                    setProfileData(prev => prev && ({
                                                        ...prev,
                                                        profile: { ...prev.profile, summary: summaryInput }
                                                    }));
                                                    setEditingSummary(false);
                                                } catch (error) {
                                                    setSummaryError(error instanceof Error ? error.message : "Failed to update summary");
                                                } finally {
                                                    setIsSavingSummary(false);
                                                }
                                            }}
                                        >
                                            <textarea
                                                value={summaryInput}
                                                onChange={(e) => setSummaryInput(e.target.value)}
                                                placeholder="Write a summary about yourself..."
                                                rows={4}
                                                className={classes.textarea}
                                            />
                                            <div>
                                                <button type="submit" disabled={isSavingSummary} className={classes.miniButton}>Save</button>
                                                <button type="button" onClick={() => setEditingSummary(false)} className={classes.miniButton}>Cancel</button>
                                            </div>
                                            {summaryError && <span className={classes.error}>{summaryError}</span>}
                                        </form>
                                    ) : (
                                        <>
                                            <p>{profileData.profile.summary}</p>
                                            <button
                                                className={classes.miniButton}
                                                style={{ marginLeft: 8 }}
                                                onClick={() => {
                                                    setSummaryInput(profileData.profile.summary || "");
                                                    setEditingSummary(true);
                                                }}
                                                title="Edit summary"
                                            >✎</button>
                                        </>
                                    )
                                ) : (
                                    profileData.profile.summary && <p>{profileData.profile.summary}</p>
                                )}
                            </Box>

                            {/* Connections Section */}
                            <Box className={classes.section}>
                                <h2>Connections</h2>
                                {connections.length === 0 ? (
                                    <p className={classes.noConnections}>No connections yet.</p>
                                ) : (
                                    <div className={classes.connectionsList}>
                                        {connections.map((connection) => {
                                            const connectedUser = connection.sender.username === username 
                                                ? connection.receiver 
                                                : connection.sender;
                                            
                                            return (
                                                <div key={connection.connectionId} className={classes.connectionCard}>
                                                    <div className={classes.connectionInfo}>
                                                        <div className={classes.avatar}>
                                                            {connectedUser.name?.[0] || connectedUser.username[0]}
                                                        </div>
                                                        <div className={classes.details}>
                                                            <h3>
                                                                <Link to={`/profile/${connectedUser.username}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                                                    {connectedUser.name || connectedUser.username}
                                                                </Link>
                                                            </h3>
                                                            <p className={classes.email}>{connectedUser.email}</p>
                                                        </div>
                                                    </div>
                                                    {isOwnProfile && (
                                                        <button
                                                            className={`${classes.removeButton} ${removingConnections.has(connection.connectionId) ? classes.removing : ''}`}
                                                            onClick={() => handleRemoveConnection(connection.connectionId)}
                                                            disabled={removingConnections.has(connection.connectionId)}
                                                            title="Remove connection"
                                                        >
                                                            {removingConnections.has(connection.connectionId) ? '...' : '×'}
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </Box>

                            {/* Experience Section */}
                            <Box className={classes.section}>
                                <div className={classes.sectionHeader}>
                                    <h2>Experience</h2>
                                    {isOwnProfile && (
                                        <button
                                            className={classes.miniButton}
                                            onClick={() => setShowExperienceForm(!showExperienceForm)}
                                            disabled={isSubmittingExperience}
                                            title={showExperienceForm ? "Cancel" : "Add Experience"}
                                        >
                                            {showExperienceForm ? "✕" : "+"}
                                        </button>
                                    )}
                                </div>
                                {showExperienceForm && isOwnProfile && (
                                    <form onSubmit={handleAddExperience} className={classes.addExperienceForm}>
                                        <div>
                                            <label htmlFor="companyName" className={classes.formLabel}>
                                                Company Name
                                            </label>
                                            <input
                                                type="text"
                                                id="companyName"
                                                name="companyName"
                                                value={experienceForm.companyName}
                                                onChange={handleExperienceChange}
                                                disabled={isSubmittingExperience}
                                                placeholder="Enter company name"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="description" className={classes.formLabel}>
                                                Description
                                            </label>
                                            <textarea
                                                id="description"
                                                name="description"
                                                value={experienceForm.description}
                                                onChange={handleExperienceChange}
                                                disabled={isSubmittingExperience}
                                                placeholder="Describe your role and responsibilities"
                                                required
                                            />
                                        </div>

                                        <div className={classes.dateInputs}>
                                            <div>
                                                <label htmlFor="startDate" className={classes.formLabel}>
                                                    Start Date
                                                </label>
                                                <input
                                                    type="date"
                                                    id="startDate"
                                                    name="startDate"
                                                    value={experienceForm.startDate}
                                                    onChange={handleExperienceChange}
                                                    disabled={isSubmittingExperience}
                                                    required
                                                    max={new Date().toISOString().split('T')[0]}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="endDate" className={classes.formLabel + " " + classes.optional}>
                                                    End Date
                                                </label>
                                                <input
                                                    type="date"
                                                    id="endDate"
                                                    name="endDate"
                                                    value={experienceForm.endDate}
                                                    onChange={handleExperienceChange}
                                                    disabled={isSubmittingExperience}
                                                    min={experienceForm.startDate || undefined}
                                                    max={new Date().toISOString().split('T')[0]}
                                                />
                                            </div>
                                        </div>

                                        {experienceError && (
                                            <div className={classes.error}>
                                                {experienceError}
                                            </div>
                                        )}

                                        <div className={classes.formActions}>
                                            <button
                                                type="submit"
                                                disabled={isSubmittingExperience}
                                                className={classes.primaryButton}
                                            >
                                                {isSubmittingExperience ? (
                                                    <>
                                                        <span className={classes.spinner}></span>
                                                        Adding Experience...
                                                    </>
                                                ) : (
                                                    "Add Experience"
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowExperienceForm(false);
                                                    setExperienceError(null);
                                                    setExperienceForm({
                                                        companyName: "",
                                                        description: "",
                                                        startDate: "",
                                                        endDate: ""
                                                    });
                                                }}
                                                disabled={isSubmittingExperience}
                                                className={classes.secondaryButton}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {profileData.experience.length > 0 ? (
                                    <div className={classes.experienceList}>
                                        {profileData.experience.map((exp) => (
                                            <div key={exp.experienceId} className={classes.experienceItem}>
                                                <div className={classes.experienceHeader}>
                                                    <h3>{exp.companyName}</h3>
                                                    {isOwnProfile && (
                                                        <button
                                                            className={classes.deleteButton}
                                                            onClick={() => handleDeleteExperience(exp.experienceId)}
                                                            title="Delete experience"
                                                        >
                                                            ×
                                                        </button>
                                                    )}
                                                </div>
                                                <p className={classes.description}>{exp.description}</p>
                                                <p className={classes.date}>
                                                    {new Date(exp.startDate).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long'
                                                    })} - {exp.endDate 
                                                        ? new Date(exp.endDate).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long'
                                                        })
                                                        : "Present"
                                                    }
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={classes.noExperience}>
                                        {isOwnProfile 
                                            ? "No experience added yet. Click the + button to add your work experience."
                                            : "No experience added yet."
                                        }
                                    </div>
                                )}
                            </Box>

                            {/* Education Section */}
                            <Box className={classes.section}>
                                <div className={classes.sectionHeader}>
                                    <h2>Education</h2>
                                    {isOwnProfile && (
                                        <button
                                            className={classes.miniButton}
                                            onClick={() => setShowEducationForm(!showEducationForm)}
                                            disabled={isSubmittingEducation}
                                            title={showEducationForm ? "Cancel" : "Add Education"}
                                        >
                                            {showEducationForm ? "✕" : "+"}
                                        </button>
                                    )}
                                </div>
                                {showEducationForm && isOwnProfile && (
                                    <form onSubmit={handleAddEducation} className={classes.addEducationForm}>
                                        <Input
                                            type="text"
                                            id="institutionName"
                                            name="institutionName"
                                            label="Institution Name"
                                            value={educationForm.institutionName}
                                            onChange={handleEducationChange}
                                            disabled={isSubmittingEducation}
                                            placeholder="Enter institution name"
                                            required
                                        />
                                        <select
                                            name="degree"
                                            value={educationForm.degree}
                                            onChange={handleEducationChange}
                                            disabled={isSubmittingEducation}
                                            className={classes.select}
                                            required
                                        >
                                            <option value="">Select Degree</option>
                                            <option value="bachelor">Bachelor's</option>
                                            <option value="master">Master's</option>
                                            <option value="phd">PhD</option>
                                            <option value="associate">Associate's</option>
                                            <option value="high-school">High School</option>
                                        </select>
                                        <Input
                                            type="text"
                                            id="fieldOfStudy"
                                            name="fieldOfStudy"
                                            label="Field of Study"
                                            value={educationForm.fieldOfStudy}
                                            onChange={handleEducationChange}
                                            disabled={isSubmittingEducation}
                                            placeholder="Enter field of study"
                                            required
                                        />
                                        <div className={classes.dateInputs}>
                                            <Input
                                                type="date"
                                                id="startDate"
                                                name="startDate"
                                                label="Start Date"
                                                value={educationForm.startDate}
                                                onChange={handleEducationChange}
                                                disabled={isSubmittingEducation}
                                                required
                                            />
                                            <Input
                                                type="date"
                                                id="endDate"
                                                name="endDate"
                                                label="End Date"
                                                value={educationForm.endDate}
                                                onChange={handleEducationChange}
                                                disabled={isSubmittingEducation}
                                            />
                                        </div>
                                        {educationError && (
                                            <div className={classes.error}>
                                                <p>{educationError}</p>
                                            </div>
                                        )}
                                        <Button 
                                            type="submit" 
                                            disabled={isSubmittingEducation}
                                            className={classes.submitButton}
                                        >
                                            {isSubmittingEducation ? "Adding..." : "Add Education"}
                                        </Button>
                                    </form>
                                )}

                                {profileData.education.length > 0 ? (
                                    <div className={classes.educationList}>
                                        {profileData.education.map((edu) => (
                                            <div key={edu.educationId} className={classes.education}>
                                                <div className={classes.educationHeader}>
                                                    <h3>{edu.institutionName}</h3>
                                                    {isOwnProfile && (
                                                        <button
                                                            className={classes.deleteButton}
                                                            onClick={() => handleDeleteEducation(edu.educationId)}
                                                            title="Delete education"
                                                        >
                                                            ×
                                                        </button>
                                                    )}
                                                </div>
                                                <p className={classes.degree}>{edu.degree} in {edu.fieldOfStudy}</p>
                                                <p className={classes.duration}>
                                                    {new Date(edu.startDate).toLocaleDateString()} - {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : "Present"}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={classes.noEducation}>
                                        {isOwnProfile 
                                            ? "No education added yet. Click the + button to add your education."
                                            : "No education added yet."
                                        }
                                    </div>
                                )}
                            </Box>
                        </div>

                        {/* Right Column */}
                        <div className={classes.rightColumn}>
                            {/* Posts Section */}
                            <Box className={classes.section}>
                                <h2>Posts</h2>
                                {postsLoading ? (
                                    <Loader />
                                ) : postsError ? (
                                    <div className={classes.error}>{postsError}</div>
                                ) : posts.length === 0 ? (
                                    <div className={classes.noExperience}>No posts yet.</div>
                                ) : (
                                    <>
                                        {(showAllPosts ? posts : [posts[0]]).map(post => {
                                            return (
                                                <div key={post.postId} className={classes.postItem}>
                                                    {auth?.user?.username && post.user.username === auth.user.username && (
                                                        <button
                                                            className={classes.postDeleteButton}
                                                            onClick={() => handleDeletePost(post.postId)}
                                                            disabled={deleteLoading[post.postId]}
                                                            title="Delete post"
                                                        >
                                                            {deleteLoading[post.postId] ? '...' : '×'}
                                                        </button>
                                                    )}
                                                    <div className={classes.postHeader}>
                                                        <Link
                                                            to={`/profile/${post.user.username}`}
                                                            style={{ color: '#0a66c2', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}
                                                            title="View profile"
                                                        >
                                                            {post.user.name || post.user.username}
                                                        </Link>
                                                        <span className={classes.postDate}>{new Date(post.createdAt).toLocaleString()}</span>
                                                    </div>
                                                    <div className={classes.postContent}>{post.content}</div>
                                                    <div className={classes.postActions}>
                                                        <button
                                                            className={classes.miniButton}
                                                            style={{ width: 36, height: 36, fontSize: 18 }}
                                                            onClick={() => handleLike(post.postId)}
                                                            disabled={likeLoading[post.postId]}
                                                        >
                                                            👍
                                                        </button>
                                                        <span className={classes.postLikeCount}>{likeCounts[post.postId] ?? 0} Likes</span>
                                                    </div>
                                                    <div className={classes.postCommentInput}>
                                                        <input
                                                            type="text"
                                                            placeholder="Add a comment..."
                                                            value={commentInputs[post.postId] || ''}
                                                            onChange={e => setCommentInputs(prev => ({ ...prev, [post.postId]: e.target.value }))}
                                                        />
                                                        <button
                                                            className={classes.miniButton}
                                                            onClick={() => handleAddComment(post.postId)}
                                                        >
                                                            Add
                                                        </button>
                                                    </div>
                                                    {comments[post.postId]?.length > 0 && (
                                                        <div className={classes.postComments}>
                                                            {comments[post.postId].map((c, idx) => {
                                                                console.log('Comment:', {
                                                                    commentUser: c.user?.username,
                                                                    authUser: auth?.user?.username,
                                                                    isMatch: c.user?.username === auth?.user?.username
                                                                });
                                                                return (
                                                                    <div key={c.commentId || idx} className={classes.postComment}>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                                            <Link
                                                                                to={c.user?.username ? `/profile/${c.user.username}` : '#'}
                                                                                style={{ color: '#0a66c2', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}
                                                                                title="View profile"
                                                                            >
                                                                                {c.user?.name || c.user?.username || 'User'}
                                                                            </Link>:
                                                                            <span>{c.content}</span>
                                                                            <span className={classes.postCommentDate}>{new Date(c.createdAt).toLocaleString()}</span>
                                                                        </div>
                                                                        <button
                                                                            className={classes.commentDeleteButton}
                                                                            style={{ width: 24, height: 24, fontSize: 16, marginLeft: 8 }}
                                                                            onClick={() => handleDeleteComment(c.commentId, post.postId)}
                                                                            disabled={deleteLoading[c.commentId]}
                                                                            title="Delete comment"
                                                                        >
                                                                            {deleteLoading[c.commentId] ? '...' : '×'}
                                                                        </button>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        {!showAllPosts && posts.length > 1 && (
                                            <button
                                                className={classes.addButton}
                                                style={{ marginTop: 12 }}
                                                onClick={() => setShowAllPosts(true)}
                                            >
                                                All Posts
                                            </button>
                                        )}
                                    </>
                                )}
                            </Box>

                            {/* Skills Section */}
                            <Box className={classes.section}>
                                <div className={classes.sectionHeader}>
                                    <h2>Skills</h2>
                                    {isOwnProfile && (
                                        <button
                                            className={classes.miniButton}
                                            onClick={() => setShowSkillForm(!showSkillForm)}
                                            disabled={isSubmittingSkill}
                                            title={showSkillForm ? "Cancel" : "Add Skill"}
                                        >
                                            {showSkillForm ? "✕" : "+"}
                                        </button>
                                    )}
                                </div>
                                {showSkillForm && isOwnProfile && (
                                    <form onSubmit={handleAddSkill} className={classes.addSkillForm}>
                                        <Input
                                            type="text"
                                            id="newSkill"
                                            label="Skill Name"
                                            value={newSkill}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewSkill(e.target.value)}
                                            disabled={isSubmittingSkill}
                                            placeholder="Enter a skill (e.g., JavaScript, React, etc.)"
                                        />
                                        {skillError && (
                                            <div className={classes.error}>
                                                <p>{skillError}</p>
                                            </div>
                                        )}
                                        <Button 
                                            type="submit" 
                                            disabled={isSubmittingSkill || !newSkill.trim()}
                                            className={classes.submitButton}
                                        >
                                            {isSubmittingSkill ? "Adding..." : "Add Skill"}
                                        </Button>
                                    </form>
                                )}

                                {profileData.skills.length > 0 ? (
                                    <div className={classes.skills}>
                                        {profileData.skills.map((skill) => (
                                            <div key={skill.id} className={classes.skillItem}>
                                                <span className={classes.skill}>{skill.skillName}</span>
                                                {isOwnProfile && (
                                                    <button
                                                        className={classes.deleteButton}
                                                        onClick={() => handleDeleteSkill(skill.id)}
                                                        title="Delete skill"
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={classes.noSkills}>
                                        {isOwnProfile 
                                            ? "No skills added yet. Click the + button to add your skills."
                                            : "No skills added yet."
                                        }
                                    </div>
                                )}
                            </Box>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
} 