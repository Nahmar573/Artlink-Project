const Artwork = require('../models/Artwork');

const uploadArtwork = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;

    // File is available as req.file
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    if (!title || !description || !category || !price || !imageUrl) {
      return res.status(400).json({ message: 'All fields including image are required' });
    }

    const newArtwork = new Artwork({
      title,
      description,
      category,
      price,
      imageUrl
    });

    await newArtwork.save();

    res.status(201).json({ message: 'Artwork uploaded successfully', artwork: newArtwork });
  } catch (err) {
    console.error('❌ Upload Error:', err);
    res.status(500).json({ message: 'Error uploading artwork', error: err });
  }
};

const getAllArtworks = async (req, res) => {
  try {
    const artworks = await Artwork.find();
    res.status(200).json(artworks);
  } catch (error) {
    console.error('❌ Fetch Error:', error);
    res.status(500).json({ message: 'Failed to fetch artworks', error });
  }
};

module.exports = { uploadArtwork, getAllArtworks };
