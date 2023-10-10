import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PostDetails = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const userId = useSelector(state => state.userId); // get userId from Redux state

    useEffect(() => {
        fetch(`https://localhost:7046/api/Posts/${postId}`)
            .then((response) => response.json())
            .then((data) => {
                setPost(data);
            });
    }, [postId]);

    const handleLike = () => {
        fetch('https://localhost:7046/api/Likes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId: post.postId, userId: userId })
        })
        .then(res => res.json())
        .then(data => {
            if (data === "Liked successfully.") {
                setPost(prevPost => {
                    return { ...prevPost, totalLikes: prevPost.totalLikes + 1 };
                });
            } else {
                alert(data);
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
            <button onClick={handleLike}>Like</button>  {/* The button to "like" the post */}
        </div>
    );
};

export default PostDetails;
