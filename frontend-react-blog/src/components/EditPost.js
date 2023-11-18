// frontend-react-blog/src/components/EditPost.js 
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Paper } from '@mui/material';
import { useSelector } from 'react-redux';

function EditPost() {
    const { postId } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();
    const usernameFromState = useSelector(state => state.auth.username);


    useEffect(() => {
        // Fetch the post data when the component mounts
        fetch(`http://localhost:5097/api/Posts/${postId}`)
            .then(response => response.json())
            .then(post => {
                setTitle(post.title);
                setContent(post.content);
            });
    }, [postId]);

    const handlePostUpdate = () => {
        const apiUrl = `http://localhost:5097/api/Posts/${postId}`;

        const updateData = {
            UserName: usernameFromState, // Add the UserName field
            Title: title,
            Content: content
        };

        fetch(apiUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData)
        })
            .then(response => {
                if (response.ok) {
                    alert('Post updated successfully!');
                    navigate(`/post/${postId}`);
                } else {
                    alert('Error updating post. Please try again.');
                }
            })
            .catch(error => {
                console.error("There was an error updating the post", error);
            });
    };

    return (
        <Grid container justifyContent="center" style={{ marginTop: '1rem' }}>
            <Grid item xs={12} md={8} lg={6}>
                <Paper style={{ padding: '2rem' }}>
                    <h2>Edit Post</h2>
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
                        onClick={handlePostUpdate}
                    >
                        Update Post
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

export default EditPost;
