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
import EditPost from './components/EditPost'; // added this line
import NotificationManager from './components/NotificationManager';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

function App() {
  const userName = useSelector(state => state.auth.username);

  return (
    <Router>
      <div className="App">
        <TopMenu userName={userName} />
        <NotificationManager />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/write-post" element={<WritePost />} />
          <Route path="/post/:postId" element={<PostDetails />} />
          <Route path="/edit-post/:postId" element={<EditPost />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default AppWrapper;
