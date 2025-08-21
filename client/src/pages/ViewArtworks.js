import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ViewStyles.css';

const ViewArtworks = () => {
  const [artworks, setArtworks] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: ''
  });

  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('userId');
  const currentUserRole = localStorage.getItem('userRole');

  // Fetch artworks with filters
  const fetchArtworks = async () => {
    try {
      const params = {};

      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      // ✅ Fix: Buyers & Guests should see ALL unsold artworks
      // Artists should see their artworks (sold or not)
      if (currentUserRole === 'artist' && currentUserId) {
        params.artist = currentUserId;
      }

      const res = await axios.get('http://localhost:5000/api/artworks', { params });
      setArtworks(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch artworks:', err);
    }
  };

  // Run on mount + when filters change
  useEffect(() => {
    fetchArtworks();
    // eslint-disable-next-line
  }, [currentUserRole, currentUserId]);

  // Delete artwork (Artist only)
  const handleDelete = async (id) => {
    if (!currentUserId) {
      alert('You must be logged in to delete artworks.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this artwork?')) {
      try {
        await axios.delete(`http://localhost:5000/api/artworks/${id}`, {
          headers: {
            'x-user-id': currentUserId,
            'x-user-role': currentUserRole
          }
        });
        alert('✅ Artwork deleted successfully!');
        fetchArtworks();
      } catch (err) {
        alert('❌ Failed to delete artwork!');
        console.error(err);
      }
    }
  };

  // Purchase artwork (Buyer only)
  const handlePurchase = async (artId) => {
    if (!currentUserId) {
      alert('You must be logged in to purchase artworks.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/purchases',
        { artworkId: artId },
        {
          headers: {
            'x-user-id': currentUserId,
            'x-user-role': currentUserRole
          }
        }
      );
      alert('✅ Purchase successful!');
      fetchArtworks();
    } catch (err) {
      alert('❌ Purchase failed!');
      console.error(err);
    }
  };

  return (
    <div className="view-container">
      <h2>Explore Artworks</h2>

      {/* Search / Filter UI */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search artworks..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        />
        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
        />
        <button onClick={fetchArtworks}>Apply</button>
        <button
          onClick={() => {
            setFilters({ search: '', category: '', minPrice: '', maxPrice: '' });
            fetchArtworks();
          }}
        >
          Clear
        </button>
      </div>

      {/* Artworks Grid */}
      <div className="art-grid">
        {artworks.length === 0 ? (
          <p>No artworks found.</p>
        ) : (
          artworks.map((art) => {
            const artistId = art.artistID ? (art.artistID._id || art.artistID) : null;
            const canEdit =
              currentUserRole === 'artist' &&
              currentUserId &&
              artistId &&
              currentUserId === String(artistId);
            const canBuy =
              currentUserRole === 'buyer' && !art.isSold; // Only buyers can buy if not sold

            return (
              <div key={art._id} className="art-card">
                <img
                  src={`http://localhost:5000${art.imageUrl}`}
                  alt={art.title}
                  className="art-image"
                />
                <div className="art-info">
                  <h3>{art.title}</h3>
                  <p className="description">{art.description}</p>
                  <p><strong>Price:</strong> ${art.price}</p>
                  <p><strong>Category:</strong> {art.category}</p>
                  {art.isSold && <p style={{ color: 'red', fontWeight: 'bold' }}>SOLD</p>}
                  <div className="art-actions">
                    {canEdit && (
                      <>
                        <button onClick={() => navigate(`/edit/${art._id}`)}>✏ Edit</button>
                        <button onClick={() => handleDelete(art._id)}>🗑 Delete</button>
                      </>
                    )}
                    {canBuy && (
                      <button onClick={() => handlePurchase(art._id)}>🛒 Purchase</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ViewArtworks;
