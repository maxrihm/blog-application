// src/redux/store.js
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const initialState = {
  isLoggedIn: false,
  username: null   // Add a username field
};

function reducer(state = initialState, action) {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, isLoggedIn: true, username: action.payload };  // Store the username
        case 'LOGOUT':
            return { ...state, isLoggedIn: false, username: null };  // Clear the username
        default:
            return state;
    }
}

const store = createStore(reducer, applyMiddleware(thunk));

export default store;
