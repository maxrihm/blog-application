// src/components/TopMenu.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const TopMenu = ({ userName }) => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };

  const goToRegister = () => {
    navigate('/register');
  };

  const goToWritePost = () => {
    navigate('/write-post');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            React Blog
          </Link>
        </Typography>
        {userName ? (
          <>
            <Typography variant="h6" style={{ marginRight: '1rem' }}>
              Welcome, {userName}!
            </Typography>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Button color="inherit" onClick={goToLogin}>Login</Button>
            <Button color="inherit" onClick={goToRegister}>Register</Button>
          </>
        )}
        <Button color="inherit" onClick={goToWritePost}>Write Post</Button>
      </Toolbar>
    </AppBar>
  );
};

export default TopMenu;
