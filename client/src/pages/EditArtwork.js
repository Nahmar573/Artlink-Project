import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './FormStyles.css';

const EditArtwork = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('userId');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    image: null,
    existingImageUrl: '',
    artistID: '',
  });

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/artworks/${id}`);
        const art = res.data;
        setFormData({
          title: art.title || '',
          description: art.description || '',
          category: art.category || '',
          price: art.price || '',
          image: null,
          existingImageUrl: art.imageUrl || '',
          artistID: art.artistID ? (art.artistID._id || art.artistID) : '',
        });
      } catch (err) {
        console.error('❌ Failed to load artwork:', err);
        alert('Failed to load artwork details!');
      }
    };
    fetchArtwork();
  }, [id]);

  useEffect(() => {
    if (
      formData.artistID &&
      currentUserId &&
      currentUserId !== String(formData.artistID)
    ) {
      alert('You are not allowed to edit this artwork.');
      navigate('/view');
    }
  }, [formData.artistID, currentUserId, navigate]);

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleUpdate = async (e) => {
  e.preventDefault();
  try {
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('price', formData.price);
    if (formData.image) data.append('image', formData.image);

    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');

    if (!userId) {
      alert('You must be logged in to perform this action.');
      return;
    }

    await axios.put(`http://localhost:5000/api/artworks/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-user-id': userId,
        'x-user-role': userRole
      }
    });

    alert('✅ Artwork updated successfully!');
    navigate('/view');
  } catch (err) {
    console.error(err);
    alert('❌ Update failed!');
  }
};

  return (
    <div className="form-container">
      <h2>Edit Artwork</h2>
      <form
        onSubmit={handleUpdate}
        className="form-box"
        encType="multipart/form-data"
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        {formData.existingImageUrl && (
          <div style={{ marginBottom: '10px' }}>
            <p>Current Image:</p>
            <img
              src={`http://localhost:5000${formData.existingImageUrl}`}
              alt="Current Artwork"
              style={{ width: '150px', borderRadius: '5px' }}
            />
          </div>
        )}

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditArtwork;
