// frontend-react-blog/src/components/PostDetails.js 

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
      .then((response) => response.json())
      .then((data) => {
        setPost(data);
        return fetch(`https://jsonplaceholder.typicode.com/users/${data.userId}`);
      })
      .then((response) => response.json())
      .then((data) => setAuthor(data));
  }, [postId]);

  if (!post) return <p>Loading...</p>;

  const formattedDate = new Date(post.date || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      {author && (
        <p>
          By: {author.name}
        </p>
      )}
      <p>
        Date: {formattedDate}
      </p>
      <p>
        Likes: {post.likes || "0"} {/* Mocked likes as the API doesn't provide it */}
      </p>
    </div>
  );
};

export default PostDetails;
