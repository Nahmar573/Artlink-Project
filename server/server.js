// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ===== Middleware Order Matters =====
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads')); // serve uploaded files

// ===== Import Routes =====
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const artworkRoutes = require('./routes/artworkRoutes');
app.use('/api/artworks', artworkRoutes);

// Purchase routes (buyer system)
const purchaseRoutes = require('./routes/purchaseRoutes'); // make sure this file exists
app.use('/api/purchases', purchaseRoutes);

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ===== Root Route =====
app.get('/', (req, res) => {
  res.send('🎨 ArtLink Backend Running!');
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
