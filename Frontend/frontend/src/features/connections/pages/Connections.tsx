import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box } from '../../authentication/components/box/Box';
import { Input } from '../../authentication/components/input/Input';
import { Loader } from '../../../component/loader/Loader';
import { Navbar } from '../../../component/Navbar';
import classes from './Connections.module.scss';

// UserResponse DTO (matching backend response)
interface UserResponse {
    id: string;
    username: string;
    email: string;
    name: string | null;
    surname: string | null;
    role: string;
}

interface PendingConnection {
    connectionId: number;
    sender: UserResponse;
    receiver: UserResponse;
    status: 'PENDING';
    createdAt: string;
}

export function Connections() {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [pendingConnections, setPendingConnections] = useState<PendingConnection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sendingRequests, setSendingRequests] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');

    const currentUsername = localStorage.getItem('username');
    console.log('Current username:', currentUsername); // Debug log

    // Filter functions
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

    const filteredPendingConnections = pendingConnections.filter(connection => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        const receiver = connection.receiver;
        return (
            (receiver.username?.toLowerCase() || '').includes(searchLower) ||
            (receiver.email?.toLowerCase() || '').includes(searchLower) ||
            (receiver.name?.toLowerCase() || '').includes(searchLower) ||
            (receiver.surname?.toLowerCase() || '').includes(searchLower)
        );
    });

    const fetchPendingConnections = async () => {
        try {
            const token = localStorage.getItem("token");
            console.log('Fetching pending connections with token:', token ? 'Token exists' : 'No token'); // Debug log

            const response = await fetch(`${import.meta.env.VITE_API_URL}/connections/pending-connections-sender`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                },
                credentials: "include"
            });

            console.log('Pending connections response status:', response.status); // Debug log

            if (!response.ok) {
                const errorText = await response.text();
                 console.error('Error fetching pending connections:', errorText); // Debug log
                 throw new Error(`Failed to fetch pending connections: ${errorText}`);
            }

            const data = await response.json();
            // (Removed extra debug log so that raw data is printed only in the debug box.)

            // Do not filter pending connections; use the raw data returned by the endpoint.
            setPendingConnections(data);
        } catch (err) {
             console.error("Error fetching pending connections:", err);
             setError(err instanceof Error ? err.message : "Failed to fetch pending connections");
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/users-without-connection`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Accept": "application/json"
                },
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }

            const data = await response.json();
            console.log('Users without connections:', data);
            
            // Filter out current user and users with pending connections
            const filteredUsers = data.filter((user: UserResponse) => 
                user.username !== currentUsername && 
                !pendingConnections.some(conn => 
                    conn.sender.username === user.username || 
                    conn.receiver.username === user.username
                )
            );
            
            setUsers(filteredUsers);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch users");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                await fetchPendingConnections();
                await fetchUsers();
            } catch (err) {
                console.error("Error loading data:", err);
                setError(err instanceof Error ? err.message : "Failed to load data");
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSendConnection = async (username: string) => {
        if (sendingRequests.has(username)) return;

        setSendingRequests(prev => new Set(prev).add(username));

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

            const data = await response.json();
            console.log('Connection response:', data);

            if (data.message === "Connection sent successfully") {
                // Remove user from available users immediately
                setUsers(prev => prev.filter(user => user.username !== username));
                
                // Fetch updated pending connections
                await fetchPendingConnections();
            } else {
                throw new Error('Unexpected response from server');
            }

        } catch (err) {
            console.error("Error sending connection request:", err);
            alert(err instanceof Error ? err.message : "Failed to send connection request");
        } finally {
            setSendingRequests(prev => {
                const next = new Set(prev);
                next.delete(username);
                return next;
            });
        }
    };

    const renderUserCard = (user: UserResponse) => {
        if (!user || !user.username) {
            console.error('Invalid user object:', user);
            return null;
        }

        const isPending = pendingConnections.some(conn => 
            conn.sender?.username === user.username || 
            conn.receiver?.username === user.username
        );
        
        const pendingConnection = pendingConnections.find(conn => 
            conn.sender?.username === user.username || 
            conn.receiver?.username === user.username
        );
        
        const isSentByMe = pendingConnection?.sender?.username === currentUsername;

        return (
            <div key={user.id} className={classes.userCard}>
                <div className={classes.userInfo}>
                    <div className={classes.avatar}>
                        {user.name?.[0] || user.username[0]}
                    </div>
                    <div className={classes.details}>
                        <h3>
                            <Link to={`/profile/${user.username}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                {user.name || user.username}
                            </Link>
                        </h3>
                        <p className={classes.email}>{user.email}</p>
                    </div>
                </div>
                {isPending ? (
                    <button
                        className={classes.connectButton}
                        onClick={() => handleSendConnection(user.username)}
                        disabled={sendingRequests.has(user.username)}
                    >
                        {sendingRequests.has(user.username) ? "Sending..." : "Connect"}
                    </button>
                ) : (
                    <button
                        className={classes.connectButton}
                        onClick={() => handleSendConnection(user.username)}
                        disabled={sendingRequests.has(user.username)}
                    >
                        {sendingRequests.has(user.username) ? "Sending..." : "Connect"}
                    </button>
                )}
            </div>
        );
    };

    // Separate sent and received connections
    const sentConnections = pendingConnections.filter(conn => conn.sender.username === currentUsername);
    const receivedConnections = pendingConnections.filter(conn => conn.receiver.username === currentUsername);

    console.log('Current state:', { // Debug log
        pendingConnections,
        sentConnections,
        receivedConnections,
        currentUsername
    });

    if (isLoading) {
        return (
            <div className={classes.root}>
                <Navbar />
                <div className={classes.container}>
                    <Loader />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={classes.root}>
                <Navbar />
                <div className={classes.container}>
                    <Box className={classes.errorBox}>
                        <h2>Error</h2>
                        <p>{error}</p>
                        <button 
                            className={classes.retryButton}
                            onClick={() => {
                                setIsLoading(true);
                                setError(null);
                                fetchPendingConnections();
                                fetchUsers();
                            }}
                        >
                            Retry
                        </button>
                    </Box>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className={classes.root}>
                <div className={classes.container}>
                    {/* Search Input */}
                    <div className={classes.searchContainer}>
                        <Input
                            type="text"
                            label="Search connections"
                            placeholder="Search by name, email, or username..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Pending Connections Box */}
                    <Box className={classes.connectionsBox}>
                        <h1>Pending Connections</h1>
                        {pendingConnections.length === 0 ? (
                            <p className={classes.noUsers}>No pending connections.</p>
                        ) : filteredPendingConnections.length === 0 ? (
                            <p className={classes.noUsers}>No matching pending connections.</p>
                        ) : (
                            <div className={classes.usersList}>
                                {filteredPendingConnections.map((connection) => (
                                    <div key={connection.connectionId} className={classes.userCard}>
                                        <div className={classes.userInfo}>
                                            <div className={classes.avatar}>
                                                {connection.receiver.name?.[0] || connection.receiver.username[0]}
                                            </div>
                                            <div className={classes.details}>
                                                <h3>
                                                    <Link to={`/profile/${connection.receiver.username}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                                        {connection.receiver.name || connection.receiver.username}
                                                    </Link>
                                                </h3>
                                                <p className={classes.email}>{connection.receiver.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            className={classes.connectButton}
                                            onClick={async () => {
                                                try {
                                                    const token = localStorage.getItem("token");
                                                    const response = await fetch(`http://localhost:8080/connections/remove-connection/${connection.connectionId}`, {
                                                        method: 'DELETE',
                                                        headers: {
                                                            "Authorization": `Bearer ${token}`,
                                                            "Accept": "application/json"
                                                        },
                                                        credentials: "include"
                                                    });
                                                    if (!response.ok) {
                                                        const errorText = await response.text();
                                                        throw new Error(errorText || 'Failed to remove connection');
                                                    }
                                                    // Remove from state
                                                    setPendingConnections(prev => prev.filter(c => c.connectionId !== connection.connectionId));
                                                } catch (err) {
                                                    alert('Failed to remove connection request.');
                                                }
                                            }}
                                        >
                                            Pending
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Box>

                    {/* People You May Know Box */}
                    <Box className={classes.connectionsBox}>
                        <h1>People You May Know</h1>
                        {users.length === 0 ? (
                            <p className={classes.noUsers}>No new connections available at the moment.</p>
                        ) : filteredUsers.length === 0 ? (
                            <p className={classes.noUsers}>No matching users found.</p>
                        ) : (
                            <div className={classes.usersList}>
                                {filteredUsers.map(user => renderUserCard(user))}
                            </div>
                        )}
                    </Box>
                </div>
                <footer>
                    <ul className={classes.footerContainer}>
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