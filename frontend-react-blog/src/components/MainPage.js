import React from 'react';
import PostList from './PostList';
import NotificationManager from './NotificationManager'; // Import NotificationManager

const MainPage = () => {
    return (
        <div>
            <h1>Welcome to React Blog</h1>
            <NotificationManager /> {/* Add the NotificationManager */}
            <PostList />
        </div>
    );
};

export default MainPage;
