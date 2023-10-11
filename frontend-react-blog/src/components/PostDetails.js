import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // useNavigate is imported instead of useHistory
import { useSelector } from 'react-redux';
import styles from './PostDetails.module.css';

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const loggedInUserId = useSelector(state => state.auth.userId); // get userId from auth state
  const loggedInUserName = useSelector(state => state.auth.username); // Extracting username from the Redux store
  const [isLiked, setIsLiked] = useState(false);  // State to track if post is liked by user
  const navigate = useNavigate();  // useNavigate is used instead of useHistory

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
      body: JSON.stringify({
        postId: post.postId,
        userId: loggedInUserId,
        postTitle: post.title,            // Sending post title
        postAuthor: post.userName,        // Sending post author
        loggedInUserName: loggedInUserName // Using the extracted username
      })
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

  const handleDeletePost = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      fetch(`https://localhost:7046/api/Posts/${post.postId}?currentUserId=${loggedInUserId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then(res => {
          if (res.ok) {
            alert("Post deleted successfully.");
            navigate("/");  // navigate is used instead of history.push
          } else {
            return res.json().then(err => {
              throw err;
            });
          }
        })
        .catch(error => {
          console.error("Error:", error);
          alert(error.message || "There was an error deleting the post.");
        });
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{post.title}</h2>
      <p className={styles.content}>{post.content}</p>
      <p className={styles.details}>
        By: {post.userName}
      </p>
      <p className={styles.details}>
        Date: {new Date(post.dateCreated).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </p>
      <p className={styles.details}>
        Likes: {post.totalLikes}
      </p>
      <button
        onClick={handleToggleLike}
        className={`${styles.likeButton} ${isLiked && styles.liked}`}
      >
        {isLiked ? "UnLike ❤️" : "Like 🤍"}
      </button>
      {post.userName === loggedInUserName && (
        <button onClick={handleDeletePost} className={styles.deleteButton}>
          Delete Post
        </button>
      )}
    </div>
  );
};

export default PostDetails;
