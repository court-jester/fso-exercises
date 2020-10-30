import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog }) => {
  const [blogVisible, setBlogVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  };

  const listStyle = {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    display: blogVisible ? '' : 'none'
  };

  return (
    <div style={blogStyle}>
      {blog.title} <button onClick={() => setBlogVisible(true)}>view</button>
      <ul style={listStyle}>
        <li>{blog.url}</li>
        <li>
          likes {blog.likes} <button>like</button>
        </li>
        <li>{blog.author}</li>
        <button onClick={() => setBlogVisible(false)}>close</button>
      </ul>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object
};
export default Blog;
