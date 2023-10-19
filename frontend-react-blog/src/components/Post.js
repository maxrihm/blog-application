// frontend-react-blog/src/components/Post.js 
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';  // <-- Import useNavigate hook
import { useSelector } from 'react-redux';
import { Card, CardContent, CardActionArea, Typography } from '@mui/material';

const Post = ({ post }) => {
  const navigate = useNavigate();  // <-- Get the navigate function
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  
  const formattedDate = new Date(post.dateCreated).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleCardClick = () => {
    if (!isLoggedIn) {
      alert("Please log in to view the post.");
      navigate('/login');  // <-- Use navigate function
    } else {
      navigate(`/post/${post.postId}`);  // <-- Use navigate function
    }
  };

  return (
    <Card className="post-card">
      <CardActionArea onClick={handleCardClick}>
        <CardContent>
          <Typography variant="h6" component="div">
            {post.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {post.content}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            By: {post.userName}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary" style={{ marginTop: '0.5rem' }}>
            Date: {formattedDate}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary" style={{ marginTop: '0.5rem' }}>
            Likes: {post.totalLikes}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default Post;
