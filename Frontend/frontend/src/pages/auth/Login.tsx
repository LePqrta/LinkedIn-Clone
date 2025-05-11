import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just navigate to home page
    navigate('/home');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" sx={{ mb: 4, color: 'primary.main', fontWeight: 'bold' }}>
          LinkedIn
        </Typography>
        <Typography variant="h5" align="center" sx={{ mb: 2 }}>
          Welcome back
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 4, color: 'text.secondary' }}>
          Stay updated on your professional world
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            Sign In
          </Button>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Link component={RouterLink} to="/forgot-password" variant="body2" sx={{ textDecoration: 'none' }}>
              Forgot password?
            </Link>
          </Box>
          <Divider sx={{ my: 3 }}>or</Divider>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Don't have an account?
            </Typography>
            <Button
              component={RouterLink}
              to="/register"
              variant="outlined"
              fullWidth
              size="large"
              sx={{ py: 1.5 }}
            >
              Sign up
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login; 