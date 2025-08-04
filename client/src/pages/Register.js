import React, { useState } from 'react';
import axios from 'axios';
import './FormStyles.css'; 

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'artist'
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/register', formData);
      alert('✅ Registration successful!');
    } catch (err) {
      alert('❌ Registration failed!');
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <h2>Register as User</h2>
      <form onSubmit={handleRegister} className="form-box">
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <select name="role" onChange={handleChange}>
          <option value="artist">Artist</option>
          <option value="buyer">Buyer</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;