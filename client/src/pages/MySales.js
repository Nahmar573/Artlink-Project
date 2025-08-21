import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MySales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/purchases/my-sales', {
          headers: { 'x-user-id': userId, 'x-user-role': userRole },
        });
        setSales(res.data || []);
      } catch (err) {
        console.error('Failed to load sales:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId && userRole) {
      fetchSales();
    } else {
      setLoading(false);
    }
  }, [userId, userRole]);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2 style={{ color: '#222' }}>My Sales</h2>
      {sales.length === 0 && <p style={{ color: '#555' }}>You have no sales yet.</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {sales.map((s) => {
          const img = s?.artwork?.imageUrl ? `http://localhost:5000${s.artwork.imageUrl}` : null;
          return (
            <div
              key={s._id}
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
                  alt={s?.artwork?.title || 'Artwork'}
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
              <h3 style={{ margin: '0 0 0.5rem', color: '#111' }}>{s?.artwork?.title || 'Untitled'}</h3>
              <p><strong>Buyer:</strong> {s?.buyer?.name || 'Unknown'}</p>
              <p><strong>Price:</strong> ${s?.price}</p>
              <p><strong>Date:</strong> {s?.purchasedAt ? new Date(s.purchasedAt).toLocaleDateString() : '-'}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MySales;
