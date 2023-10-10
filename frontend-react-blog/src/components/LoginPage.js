// frontend-react-blog/src/components/LoginPage.js

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { TextField, Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    const apiUrl = "https://localhost:7264/Auth/login";

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + btoa(username + ":" + password)  // Basic authentication header
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
          dispatch({ 
              type: 'LOGIN', 
              payload: {
                  username: data.username,
                  role: data.role,
                  userId: data.userId  // Storing userId in Redux store
              }
          });
          // Store username, role, and userId in localStorage
          localStorage.setItem('username', data.username);
          localStorage.setItem('role', data.role);
          localStorage.setItem('userId', data.userId);  // Storing userId in localStorage
  
          alert('Logged in!');
          navigate('/'); // navigate to home page after successful login
      } else {
          alert(data.message || 'Error logging in');
      }
  })
    .catch(error => {
      console.error("There was an error logging in", error);
      alert('Error logging in. Please try again.');
    });
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ marginBottom: '1rem' }}
          />
          <TextField 
            fullWidth 
            label="Password" 
            variant="outlined" 
            type="password" 
            name="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
