import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/landing.jpg';
import './Landing.css'; 

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="overlay">
        <div className="landing-content">
          <img src={logo} alt="ArtLink Logo" className="landing-logo" />
          <h1>🎨 ArtLink</h1>
          <p>Discover, Upload, and Explore Amazing Artwork!</p>
          <button onClick={() => navigate('/login')} className="button">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
