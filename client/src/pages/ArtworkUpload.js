import React, { useState } from 'react';
import axios from 'axios';
import './FormStyles.css';

const ArtworkUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    image: null,
  });

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleUpload = async (e) => {
  e.preventDefault();
  const data = new FormData();
  data.append('title', formData.title);
  data.append('description', formData.description);
  data.append('category', formData.category);
  data.append('price', formData.price);
  data.append('image', formData.image);

  try {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');

    if (!userId) {
      alert('You must be logged in to upload artwork.');
      return;
    }

    const res = await axios.post('http://localhost:5000/api/artworks/upload', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-user-id': userId,
        'x-user-role': userRole
      }
    });

    alert('✅ Artwork uploaded successfully!');
    setFormData({ title: '', description: '', category: '', price: '', image: null });
  } catch (err) {
    alert('❌ Upload failed!');
    console.error(err);
  }
};


  return (
    <div className="form-container">
      <h2>Upload Artwork</h2>
      <form
        onSubmit={handleUpload}
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
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          required
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default ArtworkUpload;
