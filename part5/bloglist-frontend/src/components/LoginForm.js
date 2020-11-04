import React from 'react';
import PropTypes from 'prop-types';

const LoginForm = ({
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
  handleSubmit
}) => {
  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleSubmit}>
        <label>
          username
          <input
            id="username"
            type="text"
            value={username}
            onChange={handleUsernameChange}
            name="Username"
          />
        </label>
        <span>password</span>
        <input
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          name="Password"
        />
        <button type="submit" id="login-button">
          login
        </button>
      </form>
    </div>
  );
};

LoginForm.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

export default LoginForm;
