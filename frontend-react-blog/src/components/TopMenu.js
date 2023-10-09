// src/components/TopMenu.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';  // Import both useSelector and useDispatch

const TopMenu = ({ userName }) => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector(state => state.isLoggedIn);  // Get login status from redux
  const dispatch = useDispatch();  // Get dispatch function from redux

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
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    dispatch({ type: 'LOGOUT' });  // Dispatch LOGOUT action to redux
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
        <Typography variant="h6" style={{ marginRight: '1rem' }}>
          {userName ? `Welcome, ${userName}!` : ''}
        </Typography>
        {!isLoggedIn && <Button color="inherit" onClick={goToLogin}>Login</Button>}
        {!isLoggedIn && <Button color="inherit" onClick={goToRegister}>Register</Button>}
        {isLoggedIn && <Button color="inherit" onClick={goToWritePost}>Write Post</Button>}
        {isLoggedIn && <Button color="inherit" onClick={handleLogout}>Logout</Button>}
      </Toolbar>
    </AppBar>
  );
};

export default TopMenu;
