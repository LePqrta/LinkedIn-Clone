import React from 'react';
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

const Network = () => {
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
              {[1, 2, 3].map((invitation) => (
                <React.Fragment key={invitation}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar src={`/path-to-avatar-${invitation}.jpg`} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`User ${invitation}`}
                      secondary="Software Engineer at Company"
                    />
                    <Box>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<CheckIcon />}
                        sx={{ mr: 1 }}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<CloseIcon />}
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
              {[1, 2, 3, 4, 5, 6].map((person) => (
                <Grid item xs={12} sm={6} md={4} key={person}>
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
                      src={`/path-to-avatar-${person}.jpg`}
                    />
                    <Typography variant="subtitle1">User {person}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Software Engineer at Company
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<PersonAddIcon />}
                      fullWidth
                    >
                      Connect
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