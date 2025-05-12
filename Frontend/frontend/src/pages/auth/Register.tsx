import React from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Grid,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Register = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" align="center" sx={{ mb: 4, color: 'primary.main' }}>
          LinkedIn
        </Typography>
        <Typography variant="h5" align="center" sx={{ mb: 3 }}>
          Make the most of your professional life
        </Typography>

        <Box component="form" noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="firstName"
                label="First name"
                name="firstName"
                autoComplete="given-name"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last name"
                name="lastName"
                autoComplete="family-name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                By clicking Agree & Join, you agree to the LinkedIn{' '}
                <Link href="#" underline="hover">
                  User Agreement
                </Link>
                ,{' '}
                <Link href="#" underline="hover">
                  Privacy Policy
                </Link>
                , and{' '}
                <Link href="#" underline="hover">
                  Cookie Policy
                </Link>
                .
              </Typography>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Agree & Join
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Already on LinkedIn?
            </Typography>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              fullWidth
            >
              Sign in
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register; 