// src/components/TopMenu.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const TopMenu = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };

  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            React Blog
          </Link>
        </Typography>
        <Button color="inherit" onClick={goToLogin}>Login</Button>
        <Button color="inherit" onClick={goToRegister}>Register</Button>
      </Toolbar>
    </AppBar>
  );
};

export default TopMenu;
