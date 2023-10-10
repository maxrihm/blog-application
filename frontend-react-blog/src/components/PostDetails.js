import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const loggedInUserId = useSelector(state => state.userId); // get userId from Redux state
  const [isLiked, setIsLiked] = useState(false);  // State to track if post is liked by user

  useEffect(() => {
    fetch(`https://localhost:7046/api/Posts/${postId}?currentUserId=${loggedInUserId}`)
      .then((response) => response.json())
      .then((data) => {
        setPost(data);
        setIsLiked(data.isLikedByUser);
      });
  }, [postId, loggedInUserId]);

  const handleToggleLike = () => {
    fetch('https://localhost:7046/api/Likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId: post.postId, userId: loggedInUserId })
    })
    .then(res => res.json())
    .then(data => {
      if (data.message === "Liked successfully.") {
        setIsLiked(true);
        setPost(prevPost => {
          return { ...prevPost, totalLikes: prevPost.totalLikes + 1 };
        });
      } else if (data.message === "Unliked successfully.") {
        setIsLiked(false);
        setPost(prevPost => {
          return { ...prevPost, totalLikes: prevPost.totalLikes - 1 };
        });
      } else {
        alert(data.message);
      }
    })
    .catch(error => console.error("Error:", error));
  };

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
      <button onClick={handleToggleLike}>
        {isLiked ? "❤️" : "🤍"}  {/* Heart icon changes based on like status */}
      </button>
    </div>
  );
};

export default PostDetails;
