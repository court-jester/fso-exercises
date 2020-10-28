import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs));
  }, []);

  const handleLogin = async event => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (e) {
      console.error(e);
    }
  };

  if (user === null)
    return (
      <>
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
      <h2>blogs</h2>
      <span>{user.username} logged in</span>
      {blogs.map(blog => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
