import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import signalRReducer from './reducers/signalRReducer';
import { signalRMiddleware } from './middlewares/signalRMiddleware';

const initialState = {
  isLoggedIn: localStorage.getItem('username') ? true : false,
  username: localStorage.getItem('username') || null,
  role: localStorage.getItem('role') || null,
  userId: localStorage.getItem('userId') || null  // Initializing userId from localStorage
};

function authReducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN':
      return { 
        ...state, 
        isLoggedIn: true, 
        username: action.payload.username, 
        role: action.payload.role,
        userId: action.payload.userId  // Storing userId in Redux store state
      };
    case 'LOGOUT':
      return { ...state, isLoggedIn: false, username: null, role: null, userId: null };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  auth: authReducer,
  signalR: signalRReducer,
  // ... other reducers ...
});

const store = createStore(rootReducer, applyMiddleware(thunk, signalRMiddleware));

export default store;
