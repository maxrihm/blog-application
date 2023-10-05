// src/components/TopMenu.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TopMenu = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };

  return (
<AppBar position="static" style={{ marginBottom: '1rem' }}>
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          React Blog
        </Typography>
        <Button color="inherit" onClick={goToLogin}>Login</Button>
        {/* Add more buttons if needed */}
      </Toolbar>
    </AppBar>
  );
};

export default TopMenu;
