import React, { useState } from 'react';
import './styles/LoginComp.css';

const LoginComp = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add login logic here
    console.log('Login attempted with:', formData);
  };

  return (
    <>
      <div className="header-banner">
        <h1>BK Queue Management System</h1>
      </div>
      <div className="login-container">
        <div className="login-box">
          <h2>Login to Your Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="login-button">Login</button>
          </form>
          <p className="signup-link">
            Don't have an account? <a href="/signup">Sign up here</a>.
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginComp;