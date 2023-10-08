import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardActionArea, Typography } from '@mui/material';

const Post = ({ post }) => {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className="post-card">
      <CardActionArea component={Link} to={`/post/${post.id}`}>
        <CardContent>
          <Typography variant="h6" component="div">
            {post.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {post.body}
          </Typography>
          {post.author && (
            <Typography variant="subtitle2" color="textSecondary">
              By: {post.author.name}
            </Typography>
          )}
          <Typography variant="subtitle2" color="textSecondary" style={{ marginTop: '0.5rem' }}>
            Date: {formattedDate}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary" style={{ marginTop: '0.5rem' }}>
            Likes: {post.likes}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default Post;
