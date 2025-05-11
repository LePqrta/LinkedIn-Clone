import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Avatar } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WorkIcon from '@mui/icons-material/Work';
import ChatIcon from '@mui/icons-material/Chat';

const Navbar = () => {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            color: 'primary.main',
            textDecoration: 'none',
            fontWeight: 'bold',
            flexGrow: 0,
            mr: 4,
          }}
        >
          LinkedIn
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <IconButton color="inherit" sx={{ mr: 2 }}>
            <SearchIcon />
          </IconButton>
          <Button
            component={RouterLink}
            to="/"
            color="inherit"
            sx={{ mr: 2 }}
          >
            Home
          </Button>
          <Button
            component={RouterLink}
            to="/network"
            color="inherit"
            sx={{ mr: 2 }}
          >
            Network
          </Button>
          <Button
            component={RouterLink}
            to="/jobs"
            color="inherit"
            sx={{ mr: 2 }}
          >
            Jobs
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="inherit" sx={{ mr: 1 }}>
            <ChatIcon />
          </IconButton>
          <IconButton color="inherit" sx={{ mr: 1 }}>
            <NotificationsIcon />
          </IconButton>
          <IconButton color="inherit" sx={{ mr: 1 }}>
            <WorkIcon />
          </IconButton>
          <Avatar
            component={RouterLink}
            to="/profile"
            sx={{ width: 32, height: 32, cursor: 'pointer' }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 