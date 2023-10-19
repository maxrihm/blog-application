import React, { useEffect, useState } from 'react';
import Post from './Post';
import Paginate from 'react-paginate';


const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;
  const [pageCount, setPageCount] = useState(0);  // New state for total page count

  useEffect(() => {
    // Fetch posts from your API with pagination
    fetch(`http://localhost:5097/api/Posts?pageIndex=${pageIndex}&pageSize=${pageSize}`)
      .then((response) => response.json())
      .then((data) => {
        setPosts(data.posts);
        setPageCount(Math.ceil(data.totalCount / pageSize));  // Assuming the backend returns totalCount
      });
  }, [pageIndex]);

  const handlePageChange = (selectedItem) => {
    setPageIndex(selectedItem.selected);
  };

  return (
    <div>
      {posts.map((post) => (
        <Post key={post.postId} post={post} />
      ))}
    <Paginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={"pagination"}
        activeClassName={"active"}
    />

    </div>
  );
};

export default PostList;
