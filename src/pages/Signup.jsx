
import React, { useState } from 'react';
import axios from 'axios';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', { name, password });

      localStorage.setItem('token', response.data.token);

      window.location.href = '/login';
    } catch (err) {
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      
      <form className="form" onSubmit={handleSignup}>
        <p className="form-title"><b>Sign up</b> for a new account</p>
        <div className="input-container">
          <input 
            type="text" 
            placeholder="Enter username"  
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        </div>
        <div className="input-container">
          <input 
            type="password" 
            placeholder="Enter password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="submit">Sign up</button>
        <p className="signup-link">
          Already have an account? <a href="/">Sign in</a>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
