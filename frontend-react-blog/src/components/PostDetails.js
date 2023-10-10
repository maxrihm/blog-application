// frontend-react-blog/src/components/PostDetails.js 

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
      fetch(`https://localhost:7046/api/Posts/${postId}`)
          .then((response) => response.json())
          .then((data) => {
              setPost(data);
          });
  }, [postId]);

  if (!post) return <p>Loading...</p>;

  return (
      <div>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>
              By: {post.userName}
          </p>
          <p>
              Date: {new Date(post.dateCreated).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
              })}
          </p>
          <p>
              Likes: {post.totalLikes}
          </p>
      </div>
  );
};

export default PostDetails;
