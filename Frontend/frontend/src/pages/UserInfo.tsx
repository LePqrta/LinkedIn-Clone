import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, CircularProgress, Alert, Button } from '@mui/material';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserInfo = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authService.getUserInfo();
        setUser(data);
      } catch (err: any) {
        setError('Failed to fetch user info.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <Container sx={{ mt: 8 }}><CircularProgress /></Container>;
  if (error) return <Container sx={{ mt: 8 }}><Alert severity="error">{error}</Alert></Container>;

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" align="center" sx={{ mb: 4 }}>
          User Info
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Username:</strong> {user.username || user.name || '-'}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Email:</strong> {user.email || '-'}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Role:</strong> {user.role || '-'}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleLogout} sx={{ mt: 2 }}>
          Logout
        </Button>
      </Paper>
    </Container>
  );
};

export default UserInfo; 