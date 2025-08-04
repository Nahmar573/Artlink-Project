import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const isLoggedIn = localStorage.getItem('userLoggedIn');

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    alert('✅ Logged out!');
    window.location.href = '/login'; // Redirect to login page
  };

  return (
    <nav className="navbar">
      <div className="logo">🎨 ArtLink</div>
      <ul>
        <li><Link to="/">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
        {isLoggedIn && (
          <>
            <li><Link to="/upload">Upload</Link></li>
            <li><Link to="/view">View</Link></li>
            <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
