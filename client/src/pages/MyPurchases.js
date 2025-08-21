import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyPurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/purchases/my-purchases', {
          headers: { 'x-user-id': userId, 'x-user-role': userRole },
        });
        setPurchases(res.data || []);
      } catch (err) {
        console.error('Failed to load purchases:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId && userRole) {
      fetchPurchases();
    } else {
      setLoading(false);
    }
  }, [userId, userRole]);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2 style={{ color: '#222' }}>My Purchases</h2>
      {purchases.length === 0 && <p style={{ color: '#555' }}>You have not purchased any artworks yet.</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {purchases.map((p) => {
          const img = p?.artwork?.imageUrl ? `http://localhost:5000${p.artwork.imageUrl}` : null;
          return (
            <div
              key={p._id}
              style={{
                background: 'white',
                color: '#222', // ✅ Ensure visible text color
                borderRadius: 10,
                padding: '1rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              {img && (
                <img
                  src={img}
                  alt={p?.artwork?.title || 'Artwork'}
                  style={{
                    width: '100%',
                    height: 180,
                    objectFit: 'contain',
                    background: '#f0f0f0',
                    borderRadius: 8,
                    marginBottom: 10,
                  }}
                />
              )}
              <h3 style={{ margin: '0 0 0.5rem', color: '#111' }}>{p?.artwork?.title || 'Untitled'}</h3>
              <p><strong>Artist:</strong> {p?.artist?.name || 'Unknown'}</p>
              <p><strong>Price:</strong> ${p?.price}</p>
              <p><strong>Date:</strong> {p?.purchasedAt ? new Date(p.purchasedAt).toLocaleDateString() : '-'}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyPurchases;
