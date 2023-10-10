import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import store from './redux/store';
import TopMenu from './components/TopMenu';
import MainPage from './components/MainPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import PostDetails from './components/PostDetails';
import WritePost from './components/WritePost';
import NotificationManager from './components/NotificationManager'; // import the NotificationManager component
import { useSelector } from 'react-redux';

function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

function App() {
  const userName = useSelector(state => state.username);

  return (
    <Router>
      <div className="App">
        <TopMenu userName={userName} />
        <NotificationManager /> {/* Add the NotificationManager here */}
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/write-post" element={<WritePost />} />
          <Route path="/post/:postId" element={<PostDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default AppWrapper;
