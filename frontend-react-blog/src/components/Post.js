// frontend-react-blog/src/components/Post.js 
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardActionArea, Typography } from '@mui/material';

const Post = ({ post }) => {
  const formattedDate = new Date(post.dateCreated).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className="post-card">
      <CardActionArea component={Link} to={`/post/${post.postId}`}>
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
          {/* Likes are omitted for now as per your instruction */}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default Post;
