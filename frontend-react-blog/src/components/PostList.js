// frontend-react-blog/src/components/PostList.js 
import React, { useEffect, useState } from 'react';
import Post from './Post';

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch posts from your API
    fetch('https://localhost:7046/api/Posts')
      .then((response) => response.json())
      .then((data) => setPosts(data));
  }, []);

  return (
    <div>
      {posts.map((post) => (
        <Post key={post.postId} post={post} />
      ))}
    </div>
  );
};

export default PostList;
