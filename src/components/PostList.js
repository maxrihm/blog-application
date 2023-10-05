// PostList.js
import React, { useEffect, useState } from 'react';
import Post from './Post';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch posts
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((response) => response.json())
      .then((data) => setPosts(data));

    // Fetch users
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <div>
      {posts.map((post) => {
        const author = users.find(user => user.id === post.userId);
        return <Post key={post.id} post={post} author={author} />;
      })}
    </div>
  );
};

export default PostList;
