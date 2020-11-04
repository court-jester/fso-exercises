import React, { useState } from 'react';
import PropTypes from 'prop-types';

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const addBlog = e => {
    e.preventDefault();
    createBlog({
      title: title,
      author: author,
      url: url
    });
    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <form onSubmit={addBlog}>
      <label>
        title
        <input
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          name="Title"
        />
      </label>
      <label>
        author
        <input
          id="author"
          type="text"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          name="Author"
        />
      </label>
      <label>
        url
        <input
          id="url"
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          name="URL"
        />
      </label>
      <button type="submit" id="blog-button">
        create
      </button>
    </form>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
};

export default BlogForm;
