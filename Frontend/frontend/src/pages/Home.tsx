import React from 'react';
import { Container, Grid, Paper, Typography, TextField, Button, Avatar, Box } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import PhotoIcon from '@mui/icons-material/Photo';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import EventIcon from '@mui/icons-material/Event';

const Home = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {/* Left Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Avatar
                sx={{ width: 80, height: 80, mx: 'auto', mb: 1 }}
                src="/path-to-profile-image.jpg"
              />
              <Typography variant="h6">John Doe</Typography>
              <Typography variant="body2" color="text.secondary">
                Software Engineer
              </Typography>
            </Box>
            <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Profile views: 123
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Post impressions: 456
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Main Feed */}
        <Grid item xs={12} md={6}>
          {/* Create Post */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ mr: 2 }} />
              <TextField
                fullWidth
                placeholder="Start a post"
                variant="outlined"
                size="small"
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
              <Button startIcon={<PhotoIcon />}>Photo</Button>
              <Button startIcon={<VideoCallIcon />}>Video</Button>
              <Button startIcon={<EventIcon />}>Event</Button>
              <Button startIcon={<CreateIcon />}>Write article</Button>
            </Box>
          </Paper>

          {/* Sample Posts */}
          {[1, 2, 3].map((post) => (
            <Paper key={post} sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="subtitle1">Jane Smith</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Software Developer at Tech Corp
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                This is a sample post content. It will be replaced with real content when we connect to the backend.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button>Like</Button>
                <Button>Comment</Button>
                <Button>Share</Button>
              </Box>
            </Paper>
          ))}
        </Grid>

        {/* Right Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Suggested for you
            </Typography>
            {[1, 2, 3].map((item) => (
              <Box key={item} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="subtitle2">Suggested User {item}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Software Engineer
                  </Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home; 