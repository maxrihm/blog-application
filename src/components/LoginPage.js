// src/components/LoginPage.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { TextField, Button, Grid, Paper } from '@mui/material';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const dispatch = useDispatch();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = () => {
    // Here you would generally handle authentication, e.g., call an API. 
    // But for this example, let's dispatch the login action directly:
    dispatch({ type: 'LOGIN' });
    alert('Logged in!');
  };

  return (
    <Grid container justifyContent="center" style={{ marginTop: '1rem' }}>
      <Grid item xs={12} md={6} lg={4}>
        <Paper style={{ padding: '2rem' }}>
          <h2>Login</h2>
          <TextField 
            fullWidth 
            label="Username" 
            variant="outlined" 
            name="username" 
            value={credentials.username}
            onChange={handleInputChange}
            style={{ marginBottom: '1rem' }}
          />
          <TextField 
            fullWidth 
            label="Password" 
            variant="outlined" 
            type="password" 
            name="password" 
            value={credentials.password}
            onChange={handleInputChange}
          />
          <Button 
            variant="contained" 
            color="primary" 
            style={{ marginTop: '1rem' }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
