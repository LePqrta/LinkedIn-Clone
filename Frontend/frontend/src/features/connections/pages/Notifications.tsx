import { useEffect, useState } from 'react';
import { Box } from '../../authentication/components/box/Box';
import { Loader } from '../../../component/loader/Loader';
import { Navbar } from '../../../component/Navbar';
import { Link } from 'react-router-dom';
import classes from './Connections.module.scss';

interface User {
    id: string;
    username: string;
    email: string;
    name: string | null;
    surname: string | null;
    role: string;
    createdAt: string;
    updatedAt: string;
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    credentialsNonExpired: boolean;
    enabled: boolean;
    authorities: Array<{ authority: string }>;
}

interface PendingConnection {
    connectionId: number;
    sender: User;
    receiver: User;
    status: 'PENDING';
    createdAt: string;
}

export function Notifications() {
    const [pendingRequests, setPendingRequests] = useState<PendingConnection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState<Set<number>>(new Set());
    const currentUsername = localStorage.getItem('username');

    useEffect(() => {
        const fetchPending = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8080/connections/pending-connections', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                    credentials: 'include',
                });
                if (!response.ok) throw new Error('Failed to fetch pending requests');
                const data = await response.json();
                setPendingRequests(data);
            } catch (err) {
                setError('Failed to load notifications');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPending();
    }, []);

    const handleAction = async (connectionId: number, action: 'accept' | 'reject') => {
        setProcessing(prev => new Set(prev).add(connectionId));
        try {
            const token = localStorage.getItem('token');
            const url =
                action === 'accept'
                    ? `http://localhost:8080/connections/accept-connection?connectionId=${connectionId}`
                    : `http://localhost:8080/connections/reject-connection?connectionId=${connectionId}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to process request');
            setPendingRequests(prev => prev.filter(c => c.connectionId !== connectionId));
        } catch (err) {
            alert('Failed to process request.');
        } finally {
            setProcessing(prev => {
                const next = new Set(prev);
                next.delete(connectionId);
                return next;
            });
        }
    };

    return (
        <>
            <Navbar />
            <div className={classes.root}>
                <div className={classes.container}>
                    <Box className={classes.connectionsBox}>
                        <h1>Connection Requests</h1>
                        {isLoading ? (
                            <Loader />
                        ) : error ? (
                            <p className={classes.noUsers}>{error}</p>
                        ) : pendingRequests.length === 0 ? (
                            <p className={classes.noUsers}>No pending connection requests.</p>
                        ) : (
                            <div style={{ marginTop: '1.5rem' }}>
                                <div className={classes.usersList}>
                                    {pendingRequests.map((connection) => (
                                        <div key={connection.connectionId} className={classes.userCard}>
                                            <div className={classes.userInfo}>
                                                <div className={classes.avatar}>
                                                    {connection.sender.name?.[0] || connection.sender.username[0]}
                                                </div>
                                                <div className={classes.details}>
                                                    <h3>
                                                        <Link to={`/profile/${connection.sender.username}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                                            {connection.sender.name || connection.sender.username}
                                                        </Link>
                                                    </h3>
                                                    <p className={classes.email}>{connection.sender.email}</p>
                                                </div>
                                            </div>
                                            <div className={classes.actionButtons}>
                                                <button
                                                    className={`${classes.connectButton} ${classes.accept}`}
                                                    disabled={processing.has(connection.connectionId)}
                                                    onClick={() => handleAction(connection.connectionId, 'accept')}
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    className={`${classes.connectButton} ${classes.reject}`}
                                                    disabled={processing.has(connection.connectionId)}
                                                    onClick={() => handleAction(connection.connectionId, 'reject')}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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