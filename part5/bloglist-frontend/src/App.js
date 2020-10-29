import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const notifyWith = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleLogin = async e => {
    e.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      console.log('user');

      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user));
      blogService.setToken(user.token);

      setUser(user);
      setUsername('');
      setPassword('');
    } catch (e) {
      const errorMessage = e.response.data.error;
      notifyWith(`Error: ${errorMessage}`, 'error');
      console.error(e.response);
    }
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem('loggedBlogUser');
  };

  const addBlog = async e => {
    e.preventDefault();

    const blogObject = {
      title: title,
      author: author,
      url: url
    };

    try {
      const blog = await blogService.create(blogObject);
      setBlogs(blogs.concat(blog));
      notifyWith(
        `A new blog titled "${blog.title}" by ${blog.author} has been added`
      );
    } catch (e) {
      const errorMessage = e.response.data.error;
      notifyWith(`Error: ${errorMessage}`, 'error');
      console.error(e.response);
    }
  };

  const blogForm = () => {
    return (
      <form onSubmit={addBlog}>
        <label>
          title
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            name="Title"
          />
        </label>
        <label>
          author
          <input
            type="text"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            name="Author"
          />
        </label>
        <label>
          url
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            name="URL"
          />
        </label>
        <button type="submit">create</button>
      </form>
    );
  };

  if (user === null)
    return (
      <>
        <Notification notification={notification} />
        <h2>log in to application</h2>
        <form onSubmit={handleLogin}>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              name="Username"
            />
          </label>
          <span>password</span>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            name="Password"
          />
          <button type="submit">login</button>
        </form>
      </>
    );

  return (
    <div>
      <Notification notification={notification} />
      <h2>blogs</h2>
      <p>{user.username} logged in</p>
      <button onClick={handleLogout}>logout</button>
      <h2>create new</h2>
      {blogForm()}
      {blogs.map(blog => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
