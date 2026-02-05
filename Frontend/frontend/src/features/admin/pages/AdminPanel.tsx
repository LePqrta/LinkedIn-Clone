import { useState, useEffect } from 'react';
import { Layout } from '../../authentication/components/layout/Layout';
import { Box } from '../../authentication/components/box/Box';
import { Button } from '../../authentication/components/button/Button';
import { Input } from '../../authentication/components/input/Input';
import classes from './AdminPanel.module.scss';
import { useAuthentication } from '../../authentication/contexts/AuthenticationContextProvider';
import { Navigate, useNavigate } from 'react-router-dom';
import { Navbar } from '../../../component/Navbar';

type TabType = 'users' | 'posts' | 'jobs' | 'new-admin';

// UserResponse DTO (matching backend response)
interface UserResponse {
    id: string;
    username: string;
    email: string;
    name: string | null;
    surname: string | null;
    role: string;
}

interface PostResponse {
    postId: number;
    user: UserResponse;
    content: string;
    createdAt: string;
}

interface JobResponse {
    jobId: number;
    title: string;
    description: string;
    companyName: string;
    location: string;
    user: UserResponse;
    postedAt: string;
}

interface NewAdminData {
    username: string;
    password: string;
    email: string;
}

export function AdminPanel() {
    const [activeTab, setActiveTab] = useState<TabType>('users');
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [posts, setPosts] = useState<PostResponse[]>([]);
    const [jobs, setJobs] = useState<JobResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [newAdminData, setNewAdminData] = useState<NewAdminData>({
        username: '',
        password: '',
        email: ''
    });
    
    const auth = useAuthentication();
    const navigate = useNavigate();

    // Check if user is admin
    if (!auth?.user || auth.user.role !== 'ADMIN') {
        return <Navigate to="/" />;
    }

    // Filter functions for each data type
    const filteredUsers = users.filter(user => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            (user.username?.toLowerCase() || '').includes(searchLower) ||
            (user.email?.toLowerCase() || '').includes(searchLower) ||
            (user.name?.toLowerCase() || '').includes(searchLower) ||
            (user.surname?.toLowerCase() || '').includes(searchLower)
        );
    });

    const filteredPosts = posts.filter(post => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            (post.content?.toLowerCase() || '').includes(searchLower) ||
            (post.user.username?.toLowerCase() || '').includes(searchLower)
        );
    });

    const filteredJobs = jobs.filter(job => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            (job.title?.toLowerCase() || '').includes(searchLower) ||
            (job.companyName?.toLowerCase() || '').includes(searchLower) ||
            (job.location?.toLowerCase() || '').includes(searchLower) ||
            (job.description?.toLowerCase() || '').includes(searchLower)
        );
    });

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/all-users`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch users');
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/all-posts`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch posts');
            const data = await response.json();
            setPosts(data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch posts');
            setPosts([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/all-jobs`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch jobs');
            const data = await response.json();
            setJobs(data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
            setJobs([]);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteUser = async (username: string) => {
        if (!window.confirm(`Are you sure you want to delete user "${username}"?`)) return;
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/delete-user/${username}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) throw new Error('Failed to delete user');
            setUsers(users.filter(user => user.username !== username));
            setSuccessMessage(`User "${username}" deleted successfully`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete user');
        }
    };

    const deletePost = async (postId: number) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/delete-post/${postId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) throw new Error('Failed to delete post');
            setPosts(posts.filter(post => post.postId !== postId));
            setSuccessMessage('Post deleted successfully');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete post');
        }
    };

    const deleteJob = async (jobId: number) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/delete-job/${jobId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) throw new Error('Failed to delete job');
            setJobs(jobs.filter(job => job.jobId !== jobId));
            setSuccessMessage('Job deleted successfully');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete job');
        }
    };

    const handleNewAdminSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/add-new-admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(newAdminData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create admin user');
            }

            setSuccessMessage('Admin user created successfully!');
            setNewAdminData({ username: '', password: '', email: '' });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create admin user');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setError(null);
        setSuccessMessage(null);
        setSearchTerm('');
        switch (activeTab) {
            case 'users':
                fetchUsers();
                break;
            case 'posts':
                fetchPosts();
                break;
            case 'jobs':
                fetchJobs();
                break;
        }
    }, [activeTab]);

    return (
        <>
            <Navbar />
            <Layout className={classes.root} hideHeader={true}>
                <Box>
                    <div className={classes.header}>
                        <h1>Admin Panel</h1>
                    </div>
                    <div className={classes.tabs}>
                        <Button 
                            onClick={() => setActiveTab('users')}
                            className={activeTab === 'users' ? classes.active : ''}
                        >
                            Users
                        </Button>
                        <Button 
                            onClick={() => setActiveTab('posts')}
                            className={activeTab === 'posts' ? classes.active : ''}
                        >
                            Posts
                        </Button>
                        <Button 
                            onClick={() => setActiveTab('jobs')}
                            className={activeTab === 'jobs' ? classes.active : ''}
                        >
                            Jobs
                        </Button>
                        <Button 
                            onClick={() => setActiveTab('new-admin')}
                            className={activeTab === 'new-admin' ? classes.active : ''}
                        >
                            Create Admin
                        </Button>
                    </div>

                    {error && <p className={classes.error}>{error}</p>}
                    {successMessage && <p className={classes.success}>{successMessage}</p>}

                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className={classes.content}>
                            {(activeTab === 'users' || activeTab === 'posts' || activeTab === 'jobs') && (
                                <div className={classes.searchContainer}>
                                    <Input
                                        type="text"
                                        label="Search"
                                        placeholder={`Search ${activeTab}...`}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className={classes.searchInput}
                                    />
                                </div>
                            )}

                            {activeTab === 'users' && (
                                <div className={classes.table}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Username</th>
                                                <th>Email</th>
                                                <th>Name</th>
                                                <th>Surname</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredUsers.map(user => (
                                                <tr key={user.id}>
                                                    <td>{user.id}</td>
                                                    <td>{user.username}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.name}</td>
                                                    <td>{user.surname}</td>
                                                    <td>
                                                        <Button onClick={() => deleteUser(user.username)}>Delete</Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {activeTab === 'posts' && (
                                <div className={classes.table}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Content</th>
                                                <th>Author</th>
                                                <th>Author Email</th>
                                                <th>Created At</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredPosts.map(post => (
                                                <tr key={post.postId}>
                                                    <td>{post.postId}</td>
                                                    <td>{post.content}</td>
                                                    <td>{post.user.name ? `${post.user.name} ${post.user.surname || ''}` : post.user.username}</td>
                                                    <td>{post.user.email}</td>
                                                    <td>{new Date(post.createdAt).toLocaleString()}</td>
                                                    <td>
                                                        <Button onClick={() => deletePost(post.postId)}>Delete</Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {activeTab === 'jobs' && (
                                <div className={classes.table}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Title</th>
                                                <th>Company</th>
                                                <th>Location</th>
                                                <th>Description</th>
                                                <th>Posted By</th>
                                                <th>Posted At</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredJobs.map(job => (
                                                <tr key={job.jobId}>
                                                    <td>{job.jobId}</td>
                                                    <td>{job.title}</td>
                                                    <td>{job.companyName}</td>
                                                    <td>{job.location}</td>
                                                    <td>{job.description}</td>
                                                    <td>{job.user.username}</td>
                                                    <td>{new Date(job.postedAt).toLocaleString()}</td>
                                                    <td>
                                                        <Button onClick={() => deleteJob(job.jobId)}>Delete</Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {activeTab === 'new-admin' && (
                                <div className={classes.formContainer}>
                                    <h2>Create New Admin User</h2>
                                    <form onSubmit={handleNewAdminSubmit}>
                                        <Input
                                            type="text"
                                            id="username"
                                            label="Username"
                                            value={newAdminData.username}
                                            onChange={(e) => setNewAdminData({
                                                ...newAdminData,
                                                username: e.target.value
                                            })}
                                            required
                                        />
                                        <Input
                                            type="email"
                                            id="email"
                                            label="Email"
                                            value={newAdminData.email}
                                            onChange={(e) => setNewAdminData({
                                                ...newAdminData,
                                                email: e.target.value
                                            })}
                                            required
                                        />
                                        <Input
                                            type="password"
                                            id="password"
                                            label="Password"
                                            value={newAdminData.password}
                                            onChange={(e) => setNewAdminData({
                                                ...newAdminData,
                                                password: e.target.value
                                            })}
                                            required
                                        />
                                        <Button type="submit" disabled={isLoading}>
                                            Create Admin User
                                        </Button>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}
                </Box>
            </Layout>
        </>
    );
} 