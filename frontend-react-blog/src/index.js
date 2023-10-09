// frontend-react-blog/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppWrapper from './App';  // Import AppWrapper instead of App
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppWrapper />  {/* Use AppWrapper here */}
  </React.StrictMode>
);

reportWebVitals();
