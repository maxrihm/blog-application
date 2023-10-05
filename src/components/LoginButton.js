// LoginButton.js
import React from 'react';
import { useDispatch } from 'react-redux';
import Button from '@mui/material/Button';

const ActionButton = ({ actionType, label }) => {
  const dispatch = useDispatch();

  const handleAction = () => {
    dispatch({ type: actionType });
    if (actionType === 'LOGIN') alert('Logged in!');
  };

  return (
    <Button color="inherit" onClick={handleAction}>
      {label}
    </Button>
  );
};

export default ActionButton;
