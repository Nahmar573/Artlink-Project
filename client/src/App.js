import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import ArtworkUpload from './pages/ArtworkUpload';
import ViewArtworks from './pages/ViewArtworks';
import Landing from './pages/Landing';
import './App.css';
import './styles.css'; 

function Navbar({ isLoggedIn, handleLogout }) {
  const location = useLocation();

  // Hide navbar on landing page
  if (location.pathname === '/') return null;

  return (
    <header className="navbar">
      <div style={{ fontWeight: 'bold', fontSize: '20px', color: 'white' }}>
        🎨 ArtLink
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        {!isLoggedIn && <Link to="/register">Register</Link>}
        {!isLoggedIn && <Link to="/login">Login</Link>}
        <Link to="/upload">Upload</Link>
        <Link to="/view">View</Link>
        {isLoggedIn && (
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('userLoggedIn') === 'true');

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    setIsLoggedIn(false);
    alert('✅ Logged out!');
    window.location.href = '/login';
  };

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('userLoggedIn') === 'true');
  }, []);

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={isLoggedIn ? <Navigate to="/upload" /> : <Register />} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/upload" /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/upload" element={isLoggedIn ? <ArtworkUpload /> : <Navigate to="/login" />} />
          <Route path="/view" element={<ViewArtworks />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
