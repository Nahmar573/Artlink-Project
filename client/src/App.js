import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
} from 'react-router-dom';

import Register from './pages/Register';
import Login from './pages/Login';
import ArtworkUpload from './pages/ArtworkUpload';
import ViewArtworks from './pages/ViewArtworks';
import Landing from './pages/Landing';
import EditArtwork from './pages/EditArtwork';

// ✅ New pages for Purchase System
import MyPurchases from './pages/MyPurchases';
import MySales from './pages/MySales';

import './App.css';
import './styles.css';

function Navbar({ isLoggedIn, handleLogout }) {
  const location = useLocation();
  const role = localStorage.getItem('userRole');

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

        {/* ✅ Artist menu */}
        {isLoggedIn && role === 'artist' && <Link to="/upload">Upload</Link>}
        {isLoggedIn && role === 'artist' && <Link to="/my-sales">My Sales</Link>}

        {/* ✅ Buyer menu */}
        {isLoggedIn && role === 'buyer' && <Link to="/my-purchases">My Purchases</Link>}

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
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('userLoggedIn') === 'true'
  );

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    alert('✅ Logged out!');
    window.location.href = '/login';
  };

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('userLoggedIn') === 'true');
  }, []);

  const role = localStorage.getItem('userRole');

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <div className="container">
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<Landing />} />

          {/* Auth */}
          <Route
            path="/register"
            element={
              isLoggedIn
                ? role === 'artist'
                  ? <Navigate to="/upload" />
                  : <Navigate to="/view" />
                : <Register />
            }
          />
          <Route
            path="/login"
            element={
              isLoggedIn
                ? role === 'artist'
                  ? <Navigate to="/upload" />
                  : <Navigate to="/view" />
                : <Login setIsLoggedIn={setIsLoggedIn} />
            }
          />

          {/* Artist Only */}
          <Route
            path="/upload"
            element={
              isLoggedIn && role === 'artist'
                ? <ArtworkUpload />
                : <Navigate to="/view" />
            }
          />
          <Route
            path="/edit/:id"
            element={
              isLoggedIn && role === 'artist'
                ? <EditArtwork />
                : <Navigate to="/login" />
            }
          />
          {/* ✅ New: My Sales (Artist Only) */}
          <Route
            path="/my-sales"
            element={
              isLoggedIn && role === 'artist'
                ? <MySales />
                : <Navigate to="/login" />
            }
          />

          {/* Buyer Only */}
          {/* ✅ New: My Purchases (Buyer Only) */}
          <Route
            path="/my-purchases"
            element={
              isLoggedIn && role === 'buyer'
                ? <MyPurchases />
                : <Navigate to="/login" />
            }
          />

          {/* Public */}
          <Route path="/view" element={<ViewArtworks />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
