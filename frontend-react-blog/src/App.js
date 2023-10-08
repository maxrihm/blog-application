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

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <TopMenu />
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/post/:postId" element={<PostDetails />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
