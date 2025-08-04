const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },  
  category: { type: String, required: true },
  price: { type: Number, required: true },
  artistID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true }); 

module.exports = mongoose.model('Artwork', artworkSchema);
