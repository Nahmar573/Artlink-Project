// src/pages/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FormStyles.css';

const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleChange = (e) =>
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/api/users/login',
        credentials
      );

      const user = res.data.user || res.data;
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('userId', user._id || user.id);
      localStorage.setItem('userName', user.name || '');
      localStorage.setItem('userRole', user.role || '');

      setIsLoggedIn(true);
      alert('✅ Login successful!');

      // Redirect based on role
      if (user.role === 'artist') {
        navigate('/upload');
      } else if (user.role === 'buyer') {
        navigate('/view');
      } else {
        navigate('/'); // fallback
      }
    } catch (err) {
      alert('❌ Login failed!');
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="form-box">
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
