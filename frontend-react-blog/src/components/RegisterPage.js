import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { TextField, Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate(); // add useNavigate hook

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = () => {
    const apiUrl = "http://localhost:5108/Auth/register";
  
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials)
    })
    .then(response => {
       if (response.status === 200) {
           return response.json();
       } else if (response.status === 400) {
           return response.json().then(data => {
               throw new Error(data.errors ? Object.values(data.errors).join('\n') : 'Error registering. Please try again.');
           });
       } else {
           throw new Error('Error registering. Please try again.');
       }
    })
    .then(data => {
       alert(data.Message || 'Registered successfully!');
       navigate('/login'); // navigate to login page after successful registration
    })
    .catch(error => {
      console.error("Error Occurred:", error.message); 
      alert(error.message);
    });
  };

  return (
    <Grid container justifyContent="center" style={{ marginTop: '1rem' }}>
      <Grid item xs={12} md={6} lg={4}>
        <Paper style={{ padding: '2rem' }}>
          <h2>Register</h2>
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
            onClick={handleRegister}
          >
            Register
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default RegisterPage;
