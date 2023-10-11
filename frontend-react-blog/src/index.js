// frontend-react-blog/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppWrapper from './App';  // Import AppWrapper instead of App
import reportWebVitals from './reportWebVitals';
import { connectSignalR } from './actions/signalRActions';
import { Provider } from 'react-redux';
import store from './redux/store';
import './App.css';  // Assuming your styles are in App.css



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <AppWrapper />  {/* Use AppWrapper here */}
    </React.StrictMode>
  </Provider>
);

store.dispatch(connectSignalR());

reportWebVitals();
