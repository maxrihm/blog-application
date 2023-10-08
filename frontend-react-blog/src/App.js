// App.js
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

function App() {
  const userName = 'John Doe'; // set the userName prop value here

  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <TopMenu userName={userName} /> {/* pass the userName prop value here */}
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/write-post" element={<WritePost />} />
            <Route path="/post/:postId" element={<PostDetails />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
