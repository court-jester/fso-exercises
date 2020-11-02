import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, updateBlog, removeBlog, userName }) => {
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
      {blog.title} {blog.author}{' '}
      <button onClick={() => setBlogVisible(!blogVisible)}>
        {blogVisible ? 'hide' : 'view'}
      </button>
      <ul style={listStyle} className="toggleableContent">
        <li>{blog.url}</li>
        <li>
          likes {`${blog.likes} `}
          <button onClick={() => updateBlog(blog.id)}>like</button>
        </li>
        {blog.user.username === userName && (
          <button onClick={() => removeBlog(blog.id)}>remove</button>
        )}
      </ul>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func,
  userName: PropTypes.string.isRequired
};
export default Blog;
