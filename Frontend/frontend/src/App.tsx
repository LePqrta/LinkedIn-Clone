import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={
            <>
              <Navbar />
              <Home />
            </>
          } />
          <Route path="/profile" element={
            <>
              <Navbar />
              <Profile />
            </>
          } />
          <Route path="/network" element={
            <>
              <Navbar />
              <Network />
            </>
          } />
          <Route path="/jobs" element={
            <>
              <Navbar />
              <Jobs />
            </>
          } />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={
            <>
              <Navbar />
              <AdminPanel />
            </>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
