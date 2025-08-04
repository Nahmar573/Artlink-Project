const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware order matters
app.use(cors());
app.use(express.urlencoded({ extended: true })); // Supports form data
app.use(express.json()); // Supports JSON
app.use('/uploads', express.static('uploads')); // Serve uploaded images

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const artworkRoutes = require('./routes/artworkRoutes');
app.use('/api/artworks', artworkRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Root route
app.get('/', (req, res) => {
  res.send('🎨 ArtLink Backend Running!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
