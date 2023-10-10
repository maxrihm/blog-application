// frontend-react-blog/src/components/WritePost.js 
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { TextField, Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function WritePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const userName = useSelector(state => state.auth.username);
    const userId = useSelector(state => state.auth.userId);
    const navigate = useNavigate();

    const handlePostSubmit = () => {
        const apiUrl = "https://localhost:7046/api/Posts";

        const postData = {
            UserId: userId,
            UserName: userName,
            Title: title,
            Content: content
        };

        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postData)
        })
            .then(response => response.json())
            .then(data => {
                alert('Post created successfully!');
                navigate('/'); // navigate to home page after successful post creation
            })
            .catch(error => {
                console.error("There was an error creating the post", error);
                alert('Error creating post. Please try again.');
            });
    };

    return (
        <Grid container justifyContent="center" style={{ marginTop: '1rem' }}>
            <Grid item xs={12} md={8} lg={6}>
                <Paper style={{ padding: '2rem' }}>
                    <h2>Write a Post</h2>
                    <TextField
                        fullWidth
                        label="Title"
                        variant="outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ marginBottom: '1rem' }}
                    />
                    <TextField
                        fullWidth
                        label="Content"
                        variant="outlined"
                        multiline
                        rows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{ marginBottom: '1rem' }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ marginTop: '1rem', marginRight: '1rem' }}
                        onClick={handlePostSubmit}
                    >
                        Submit Post
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        style={{ marginTop: '1rem' }}
                        onClick={() => navigate('/')}
                    >
                        Cancel
                    </Button>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default WritePost;
