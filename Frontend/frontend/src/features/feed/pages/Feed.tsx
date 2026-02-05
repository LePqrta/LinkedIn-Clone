import { useState, useEffect, type FormEvent } from 'react';
import { useAuthentication } from '../../authentication/contexts/AuthenticationContextProvider';
import feedClasses from './Feed.module.scss';
import postClasses from '../../profile/pages/Profile.module.scss';
import { Navbar } from '../../../component/Navbar';
import { Link } from 'react-router-dom';

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
    user: UserResponse | null;
    content: string;
    createdAt: string;
}

interface CommentResponse {
    commentId: number;
    user: UserResponse | null;
    content: string;
    createdAt: string;
}

export function Feed() {
    const auth = useAuthentication();
    const [newPost, setNewPost] = useState("");
    const [posts, setPosts] = useState<PostResponse[]>([]);
    const [postsLoading, setPostsLoading] = useState(false);
    const [postsError, setPostsError] = useState<string | null>(null);
    const [likeLoading, setLikeLoading] = useState<{[postId: number]: boolean}>({});
    const [likeCounts, setLikeCounts] = useState<{[postId: number]: number}>({});
    const [commentInputs, setCommentInputs] = useState<{[postId: number]: string}>({});
    const [comments, setComments] = useState<{[postId: number]: CommentResponse[]}>({});
    const [deleteLoading, setDeleteLoading] = useState<{[id: number]: boolean}>({});

    useEffect(() => {
        const fetchPosts = async () => {
            setPostsLoading(true);
            setPostsError(null);
            try {
                const response = await fetch('http://localhost:8080/post/get-posts-of-connections', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Accept': 'application/json',
                    },
                    credentials: 'include',
                });
                if (!response.ok) throw new Error('Failed to fetch posts');
                const data = await response.json();
                data.sort((a: PostResponse, b: PostResponse) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setPosts(data);
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
    }, []);

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
            if (!response.ok) throw new Error('Failed to delete post');
            setPosts(prev => prev.filter(post => post.postId !== postId));
        } catch (err) {
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

    const handleCreatePost = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newPost.trim()) return;
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to create a post.");
            return;
        }
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + "/post/create-post", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
                body: JSON.stringify({ content: newPost }),
            });
            if (response.ok) {
                setNewPost("");
                // Refresh posts
                setPostsLoading(true);
                const refreshed = await fetch('http://localhost:8080/post/get-posts-of-connections', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                    credentials: 'include',
                });
                if (refreshed.ok) {
                    const data = await refreshed.json();
                    data.sort((a: PostResponse, b: PostResponse) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    setPosts(data);
                    for (const post of data) {
                        fetchLikeCount(post.postId);
                        fetchComments(post.postId);
                    }
                }
                setPostsLoading(false);
            } else {
                const text = await response.text();
                let message: string;
                try {
                    const json = JSON.parse(text);
                    message = json.message;
                } catch (e) {
                    message = "An error occurred while creating the post.";
                }
                alert(message);
            }
        } catch (e) {
            alert("An unexpected error occurred.");
        }
    };

    if (!auth) {
        return null;
    }

    return (
        <>
            <Navbar />
            <div className={feedClasses.root}>
                <main className={feedClasses.content}>
                    <div className={feedClasses.center}>
                        <div className={feedClasses.posting}>
                            <form onSubmit={handleCreatePost}>
                                <input
                                    type="text"
                                    value={newPost}
                                    onChange={(e) => setNewPost(e.target.value)}
                                    placeholder="What's on your mind?"
                                />
                                <button type="submit" disabled={!newPost.trim()}>Post</button>
                            </form>
                        </div>
                        <div>
                            {postsLoading ? (
                                <div>Loading...</div>
                            ) : postsError ? (
                                <div>{postsError}</div>
                            ) : posts.length === 0 ? (
                                <div>No posts from your connections yet.</div>
                            ) : (
                                posts.map(post => (
                                    <div key={post.postId} className={postClasses.postItem}>
                                        {auth?.user?.username && post.user?.username === auth.user.username && (
                                            <button
                                                className={postClasses.postDeleteButton}
                                                onClick={() => handleDeletePost(post.postId)}
                                                disabled={deleteLoading[post.postId]}
                                                title="Delete post"
                                            >
                                                {deleteLoading[post.postId] ? '...' : '×'}
                                            </button>
                                        )}
                                        <div className={postClasses.postHeader}>
                                            <Link
                                                to={post.user?.username ? `/profile/${post.user.username}` : '#'}
                                                style={{ color: '#0a66c2', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}
                                                title="View profile"
                                            >
                                                {post.user?.name || post.user?.username || 'Unknown User'}
                                            </Link>
                                            <span className={postClasses.postDate}>{new Date(post.createdAt).toLocaleString()}</span>
                                        </div>
                                        <div className={postClasses.postContent}>{post.content}</div>
                                        <div className={postClasses.postActions}>
                                            <button
                                                className={postClasses.miniButton}
                                                style={{ width: 36, height: 36, fontSize: 18 }}
                                                onClick={() => handleLike(post.postId)}
                                                disabled={likeLoading[post.postId]}
                                            >
                                                👍
                                            </button>
                                            <span className={postClasses.postLikeCount}>{likeCounts[post.postId] ?? 0} Likes</span>
                                        </div>
                                        <div className={postClasses.postCommentInput}>
                                            <input
                                                type="text"
                                                placeholder="Add a comment..."
                                                value={commentInputs[post.postId] || ''}
                                                onChange={e => setCommentInputs(prev => ({ ...prev, [post.postId]: e.target.value }))}
                                            />
                                            <button
                                                className={postClasses.miniButton}
                                                onClick={() => handleAddComment(post.postId)}
                                            >
                                                Add
                                            </button>
                                        </div>
                                        {comments[post.postId]?.length > 0 && (
                                            <div className={postClasses.postComments}>
                                                {comments[post.postId].map((c, idx) => (
                                                    <div key={c.commentId || idx} className={postClasses.postComment}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                            <Link
                                                                to={c.user?.username ? `/profile/${c.user.username}` : '#'}
                                                                style={{ color: '#0a66c2', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}
                                                                title="View profile"
                                                            >
                                                                {c.user?.name || c.user?.username || 'User'}
                                                            </Link>:
                                                            <span>{c.content}</span>
                                                            <span className={postClasses.postCommentDate}>{new Date(c.createdAt).toLocaleString()}</span>
                                                        </div>
                                                        {auth?.user?.username && c.user?.username === auth.user.username && (
                                                            <button
                                                                className={postClasses.commentDeleteButton}
                                                                style={{ width: 24, height: 24, fontSize: 16, marginLeft: 8 }}
                                                                onClick={() => handleDeleteComment(c.commentId, post.postId)}
                                                                disabled={deleteLoading[c.commentId]}
                                                                title="Delete comment"
                                                            >
                                                                {deleteLoading[c.commentId] ? '...' : '×'}
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </main>
                <footer>
                    <ul className={feedClasses.footerContainer}>
                        <li>
                            <img alt="" src="/logo-dark.svg" />
                            <span>2025</span>
                        </li>
                        <li><a href="">Accessibility</a></li>
                        <li><a href="">User Agreement</a></li>
                        <li><a href="">Privacy Policy</a></li>
                        <li><a href="">Cookie Policy</a></li>
                        <li><a href="">Copyright Policy</a></li>
                        <li><a href="">Brand Policy</a></li>
                        <li><a href="">Guest Controls</a></li>
                        <li><a href="">Community Guidelines</a></li>
                        <li><a href="">Language</a></li>
                    </ul>
                </footer>
            </div>
        </>
    );
}