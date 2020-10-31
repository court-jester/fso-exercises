import React, { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import BlogForm from './components/BlogForm';
import Toggleable from './components/Toggleable';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const blogFormRef = useRef();

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

  const addBlog = async blogObject => {
    try {
      const blog = await blogService.create(blogObject);
      setBlogs(blogs.concat(blog));
      blogFormRef.current.toggleVisibility();
      notifyWith(
        `A new blog titled "${blog.title}" by ${blog.author} has been added`
      );
    } catch (e) {
      const errorMessage = e.response.data.error;
      notifyWith(`Error: ${errorMessage}`, 'error');
      console.error(e.response);
    }
  };

  // TO CHECK: Trade offs of passing the blog as parameter, or just the id and find the blog (blogs.find())
  const updateBlog = async id => {
    const blog = blogs.find(blog => blog.id === id);
    // Blog.user seems unnecessary to update it, otherwise just add blog.user.id to the user property of the newBlog
    delete blog.user;
    const likes = ++blog.likes;

    const newBlog = {
      ...blog,
      likes
    };

    try {
      const updatedBlog = await blogService.update(id, newBlog);
      setBlogs(
        blogs.map(blog => (blog.id !== updatedBlog.id ? blog : updatedBlog))
      );
    } catch (e) {
      const errorMessage = e.response.data.error;
      notifyWith(`Error: ${errorMessage}`, 'error');
      console.error(e.response);
    }
  };

  const removeBlog = async id => {
    const blog = blogs.find(blog => blog.id === id);
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.remove(id);
        setBlogs(blogs.filter(blog => blog.id !== id));
      } catch (e) {
        const errorMessage = e.response.data.error;
        notifyWith(`Error: ${errorMessage}`, 'error');
        console.error(e.response);
      }
    }
  };

  const blogForm = () => {
    return (
      <Toggleable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Toggleable>
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
      <h2>create new blog</h2>
      {blogForm()}
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={updateBlog}
            removeBlog={removeBlog}
            userName={user.username}
          />
        ))}
    </div>
  );
};

export default App;
