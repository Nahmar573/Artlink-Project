const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  description: { type: String, required: true },
  imageUrl: String,
  category: { type: String, required: true, index: true },
  price: { type: Number, required: true },
  artistID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sold: { type: Boolean, default: false } 
}, { timestamps: true });

artworkSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Artwork', artworkSchema);
