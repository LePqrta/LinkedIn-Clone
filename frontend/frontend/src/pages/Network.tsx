import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Network = () => {
  const { user } = useAuth();
  const [people, setPeople] = useState<any[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<any[]>([]);
  const [requestSent, setRequestSent] = useState<{ [username: string]: boolean }>({});

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return setPeople([]);
        const response = await axios.get('http://localhost:8080/user/users-without-connection', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPeople(Array.isArray(response.data) ? response.data.slice(0, 6) : []);
      } catch (err) {
        setPeople([]);
      }
    };
    const fetchInvitations = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return setPendingInvitations([]);
        const response = await axios.get('http://localhost:8080/connections/pending-connections', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPendingInvitations(Array.isArray(response.data) ? response.data.slice(0, 6) : []);
      } catch (err) {
        setPendingInvitations([]);
      }
    };
    fetchPeople();
    fetchInvitations();
  }, []);

  const handleConnect = async (username: string) => {
    setRequestSent((prev) => ({ ...prev, [username]: true }));
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8080/connections/send-connection',
        { username },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      // Optionally handle error, revert button if needed
    }
  };

  // Compute a set of usernames who have sent us a pending invitation
  const pendingSenderUsernames = new Set(
    pendingInvitations
      .filter(invitation => user && invitation.receiver?.username === user.username)
      .map(invitation => invitation.sender?.username)
      .filter(Boolean)
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {/* Left Column - Invitations */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Invitations
            </Typography>
            <List>
              {pendingInvitations
                .filter(invitation => user && invitation.receiver?.username === user.username)
                .map((invitation, idx) => (
                  <React.Fragment key={invitation.id || idx}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar src={`/path-to-avatar.jpg`} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={invitation.sender?.name ? `${invitation.sender.name} ${invitation.sender.surname || ''}` : invitation.sender?.username || 'User'}
                        secondary={invitation.sender?.username ? `@${invitation.sender.username}` : ''}
                      />
                      <Box>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<CheckIcon />}
                          sx={{ mr: 1 }}
                          disabled
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<CloseIcon />}
                          disabled
                        >
                          Ignore
                        </Button>
                      </Box>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
            </List>
          </Paper>
        </Grid>

        {/* Right Column - People You May Know */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              People You May Know
            </Typography>
            <Grid container spacing={2}>
              {people
                .filter(person => !pendingSenderUsernames.has(person.username))
                .map((person, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={person.id || idx}>
                    <Paper
                      sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                      }}
                    >
                      <Avatar
                        sx={{ width: 80, height: 80, mb: 2 }}
                        src={"/path-to-avatar.jpg"}
                      />
                      <Typography variant="subtitle1">
                        {person.name || 'User'} {person.surname || ''}
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<PersonAddIcon />}
                        fullWidth
                        disabled={!!requestSent[person.username]}
                        onClick={() => handleConnect(person.username)}
                      >
                        {requestSent[person.username] ? 'Request Sent' : 'Connect'}
                      </Button>
                    </Paper>
                  </Grid>
                ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Network; 