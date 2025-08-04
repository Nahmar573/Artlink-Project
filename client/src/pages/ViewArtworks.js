import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewStyles.css'; 

const ViewArtworks = () => {
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/artworks');
        setArtworks(res.data);
      } catch (err) {
        console.error('Failed to fetch artworks:', err);
      }
    };

    fetchArtworks();
  }, []);

  return (
    <div className="view-container">
      <h2>Explore Artworks</h2>
      <div className="art-grid">
        {artworks.map((art) => (
          <div key={art._id} className="art-card">
            <img src={`http://localhost:5000${art.imageUrl}`} alt={art.title} />
            <div className="art-info">
              <h3>{art.title}</h3>
              <p className="description">{art.description}</p>
              <p><strong>Price:</strong> ${art.price}</p>
              <p><strong>Category:</strong> {art.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewArtworks;
