// Post.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardActionArea, Typography } from '@mui/material';

const Post = ({ post, author }) => {
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
          {author && (
            <Typography variant="subtitle2" color="textSecondary">
              By: {author.name}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default Post;
