import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './PostDetails.module.css';

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const loggedInUserId = useSelector(state => state.auth.userId);
  const loggedInUserName = useSelector(state => state.auth.username);
  const loggedInUserRole = useSelector(state => state.auth.role);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5097/api/Posts/${postId}?currentUserId=${loggedInUserId}`)
      .then((response) => response.json())
      .then((data) => {
        setPost(data);
        setIsLiked(data.isLikedByUser);
      });
  }, [postId, loggedInUserId]);

  useEffect(() => {
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
        postTitle: post.title,
        postAuthor: post.userName,
        loggedInUserName: loggedInUserName
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
            navigate("/");
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
      UserName: loggedInUserName,
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
        setNewComment('');
      });
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      fetch(`http://localhost:5097/api/Comments/${commentId}`, {
        method: 'DELETE'
      })
      .then(res => {
        if (res.ok) {
          setComments(comments.filter(comment => comment.commentId !== commentId));
        } else {
          alert("Error deleting comment.");
        }
      })
      .catch(error => console.error("Error:", error));
    }
  };

  const handleEditPost = () => {
    navigate(`/edit-post/${postId}`);
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
        <>
          <button onClick={handleEditPost} className={styles.editButton}>
            Edit Post
          </button>
          <button onClick={handleDeletePost} className={styles.deleteButton}>
            Delete Post
          </button>
        </>
      )}

      <div className={styles.commentsSection}>
        <h3>Comments</h3>
        {comments.map(comment => (
          <div key={comment.commentId} className={styles.comment}>
            <p><strong>{comment.userName}</strong>: {comment.content}</p>
            <small>{new Date(comment.dateCreated).toLocaleString()}</small>
            {(comment.userName === loggedInUserName || loggedInUserRole === 'Admin') && (
              <button onClick={() => handleDeleteComment(comment.commentId)} className={styles.deleteCommentButton}>
                🗑️
              </button>
            )}
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
