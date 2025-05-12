import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fullName = user ? `${user.name || ''} ${user.surname || ''}`.trim() : 'User';
  const username = user?.username || '';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Profile Header */}
      <Paper sx={{ position: 'relative', mb: 3 }}>
        <Box
          sx={{
            height: 200,
            backgroundColor: 'primary.main',
            position: 'relative',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -60,
            left: 24,
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          <Avatar
            sx={{
              width: 150,
              height: 150,
              border: '4px solid white',
            }}
            src="/path-to-profile-image.jpg"
          />
          <Box sx={{ ml: 2, mb: 2 }}>
            <Typography variant="h4">{fullName}</Typography>
            {username && (
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: 16, mt: 0.5 }}>
                @{username}
              </Typography>
            )}
            <Typography variant="body1">{user?.role || 'User'}</Typography>
            <Typography variant="body2" color="text.secondary">
              <LocationOnIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
              San Francisco, California
            </Typography>
          </Box>
        </Box>
        <Box sx={{ p: 2, mt: 8, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            sx={{ mr: 1 }}
          >
            Edit Profile
          </Button>
          <Button variant="contained" color="error" onClick={handleLogout}>Logout</Button>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          {/* About */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              About
            </Typography>
            <Typography variant="body1">
              Experienced software engineer with a passion for building scalable applications
              and solving complex problems. Specialized in full-stack development with
              expertise in React, Node.js, and cloud technologies.
            </Typography>
          </Paper>

          {/* Experience */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Experience
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <WorkIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Senior Software Engineer"
                  secondary={
                    <>
                      <Typography component="span" variant="body2">
                        Tech Corp
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="text.secondary">
                        2020 - Present
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <WorkIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Software Engineer"
                  secondary={
                    <>
                      <Typography component="span" variant="body2">
                        Previous Company
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="text.secondary">
                        2018 - 2020
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            </List>
          </Paper>

          {/* Education */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Education
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Bachelor of Science in Computer Science"
                  secondary={
                    <>
                      <Typography component="span" variant="body2">
                        University of Technology
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="text.secondary">
                        2014 - 2018
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          {/* Skills */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Skills
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker'].map((skill) => (
                <Button
                  key={skill}
                  variant="outlined"
                  size="small"
                  sx={{ borderRadius: 20 }}
                >
                  {skill}
                </Button>
              ))}
            </Box>
          </Paper>

          {/* Activity */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Activity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • 500+ profile views
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • 50+ post impressions
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile; 