// frontend/src/pages/LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import './LoginPage.css';

const LoginPage = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { name, password });

      localStorage.setItem('token', response.data.token);
     
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
     
      <form className="form" onSubmit={handleLogin}>
        <p className="form-title"><b>Sign in</b> to your account</p>
        <div className="input-container">
          <input
            type="text" 
            placeholder="Enter username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='username-input'
          />
        </div>
        <div className="input-container">
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
             className="password-input"
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="submit">
          Sign in
        </button>
        <p className="signup-link">
          No account?
          <a href="/signup">Sign up</a> {/* Updated the link to point to the sign-up page */}
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
