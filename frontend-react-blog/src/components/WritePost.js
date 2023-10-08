import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Uncomment below if using react-quill
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css'; 

const WritePost = () => {
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSave = () => {
    // Here you can save the content to a backend/API or Redux
    console.log(content);
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div>
      <h1>Write a new post</h1>
      {/* Uncomment below if using react-quill */}
      {/* <ReactQuill value={content} onChange={setContent} /> */}
      <TextField
        label="Write your post"
        multiline
        rows={10}
        fullWidth
        variant="outlined"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div style={{ marginTop: '1rem' }}>
        <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
        <Button variant="contained" onClick={handleCancel} style={{ marginLeft: '1rem' }}>Cancel</Button>
      </div>
    </div>
  );
};

export default WritePost;
