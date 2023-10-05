// src/components/TopMenu.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const TopMenu = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          <MuiLink component={Link} to="/" color="inherit" underline="none">
            🏠Home page
          </MuiLink>
        </Typography>
        <Button color="inherit" onClick={goToLogin}>🔒Login</Button>
      </Toolbar>
    </AppBar>
  );
};

export default TopMenu;
