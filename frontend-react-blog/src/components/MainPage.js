import React from 'react';
import PostList from './PostList';

const MainPage = () => {
  const today = new Date();
  const day = today.toLocaleDateString('en-US', { weekday: 'long' });
  const fullDate = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const time = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div>
        <h1>Today is {day}, {fullDate} {time}</h1>
        <PostList />
    </div>
  );
};

export default MainPage;
