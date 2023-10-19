import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // useNavigate is imported instead of useHistory
import { useSelector } from 'react-redux';
import styles from './PostDetails.module.css';

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const loggedInUserId = useSelector(state => state.auth.userId); // get userId from auth state
  const loggedInUserName = useSelector(state => state.auth.username); // Extracting username from the Redux store
  const loggedInUserRole = useSelector(state => state.auth.role); // get user role from auth state
  const [isLiked, setIsLiked] = useState(false);  // State to track if post is liked by user
  const [comments, setComments] = useState([]);   // State to hold the list of comments
  const [newComment, setNewComment] = useState(''); // State to hold the value of a new comment
  const navigate = useNavigate();  // useNavigate is used instead of useHistory

  useEffect(() => {
    fetch(`http://localhost:5097/api/Posts/${postId}?currentUserId=${loggedInUserId}`)
      .then((response) => response.json())
      .then((data) => {
        setPost(data);
        setIsLiked(data.isLikedByUser);
      });
  }, [postId, loggedInUserId]);

  useEffect(() => {
    // Fetch comments when the component mounts
    fetch(`http://localhost:5097/api/Comments/${postId}`)
      .then(response => response.json())
      .then(data => setComments(data));
  }, [postId]);

  const handleToggleLike = () => {
    fetch('http://localhost:5097/api/Likes', {
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
      fetch(`http://localhost:5097/api/Posts/${post.postId}?currentUserId=${loggedInUserId}&userRole=${loggedInUserRole}`, {
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

  const handleAddComment = () => {
    const comment = {
      PostId: postId,
      UserId: loggedInUserId,
      UserName: loggedInUserName,  // Send the username with the request
      Content: newComment
    };

    fetch('http://localhost:5097/api/Comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment)
    })
      .then(response => response.json())
      .then(data => {
        setComments(prevComments => [...prevComments, data]);
        setNewComment(''); // Clear the comment input
      });
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
      {(post.userName === loggedInUserName || loggedInUserRole === 'Admin') && (
        <button onClick={handleDeletePost} className={styles.deleteButton}>
          Delete Post
        </button>
      )}

      <div className={styles.commentsSection}>
        <h3>Comments</h3>
        {comments.map(comment => (
          <div key={comment.commentId} className={styles.comment}>
            <p><strong>{comment.userName}</strong>: {comment.content}</p>
            <small>{new Date(comment.dateCreated).toLocaleString()}</small>
          </div>
        ))}

        <textarea
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        ></textarea>
        <button onClick={handleAddComment}>Add Comment</button>
      </div>
    </div>
  );
};

export default PostDetails;
