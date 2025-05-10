import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Network from './pages/Network';
import Jobs from './pages/Jobs';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminPanel from './pages/admin/AdminPanel';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0a66c2',
    },
    secondary: {
      main: '#057642',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/network" element={<Network />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
