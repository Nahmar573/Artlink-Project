const Artwork = require('../models/Artwork');
const User = require('../models/User'); // for searching by artist name

// ===== Upload Artwork (Artist only) =====
const uploadArtwork = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized: user id required' });
    }
    if (req.userRole !== 'artist') {
      return res.status(403).json({ message: 'Forbidden: only artists can upload artworks' });
    }

    const { title, description, category, price } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    if (!title || !description || !category || !price || !imageUrl) {
      return res.status(400).json({ message: 'All fields including image are required' });
    }

    const newArtwork = new Artwork({
      title,
      description,
      category,
      price,
      imageUrl,
      artistID: req.userId,
      isSold: false // ✅ New field for purchase system
    });

    await newArtwork.save();
    res.status(201).json({ message: 'Artwork uploaded successfully', artwork: newArtwork });
  } catch (err) {
    console.error('❌ Upload Error:', err);
    res.status(500).json({ message: 'Error uploading artwork', error: err });
  }
};

// ===== Get All Artworks (with role-based filtering) =====
const getAllArtworks = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, artist } = req.query;
    const userRole = req.headers['x-user-role'] || null;
    const userId = req.headers['x-user-id'] || null;

    let query = {};

    // Text search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by artist ID or name
    if (artist) {
      if (/^[0-9a-fA-F]{24}$/.test(artist)) {
        query.artistID = artist;
      } else {
        const foundArtist = await User.findOne({ name: { $regex: artist, $options: 'i' } });
        if (foundArtist) query.artistID = foundArtist._id;
      }
    }

    // ===== Role-based filtering =====
    if (userRole === 'buyer') {
      // Buyers → Only see artworks that are not sold
      query.isSold = false;
    } else if (userRole === 'artist') {
      // Artists → See only their own artworks
      if (userId) {
        query.artistID = userId;
      }
    } 
    // Guests → No extra filter, they can see all artworks

    const artworks = await Artwork.find(query)
      .populate('artistID', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json(artworks);
  } catch (error) {
    console.error('❌ Fetch Error:', error);
    res.status(500).json({ message: 'Failed to fetch artworks', error });
  }
};

// ===== Get Single Artwork =====
const getArtworkById = async (req, res) => {
  try {
    const art = await Artwork.findById(req.params.id).populate('artistID', 'name email role');
    if (!art) return res.status(404).json({ message: 'Artwork not found' });
    res.status(200).json(art);
  } catch (error) {
    console.error('❌ Fetch Single Error:', error);
    res.status(500).json({ message: 'Failed to fetch artwork', error });
  }
};

// ===== Update Artwork (Artist only) =====
const updateArtwork = async (req, res) => {
  try {
    if (!req.userId) return res.status(401).json({ message: 'Unauthorized' });
    if (req.userRole !== 'artist') {
      return res.status(403).json({ message: 'Forbidden: only artists can update artworks' });
    }

    const { id } = req.params;
    const existing = await Artwork.findById(id);
    if (!existing) return res.status(404).json({ message: 'Artwork not found' });

    if (existing.artistID.toString() !== req.userId) {
      return res.status(403).json({ message: 'Forbidden: you are not the owner' });
    }

    const updates = {};
    if (req.body.title) updates.title = req.body.title;
    if (req.body.description) updates.description = req.body.description;
    if (req.body.category) updates.category = req.body.category;
    if (req.body.price) updates.price = req.body.price;
    if (req.file) updates.imageUrl = `/uploads/${req.file.filename}`;

    const updatedArtwork = await Artwork.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json({ message: 'Artwork updated successfully', artwork: updatedArtwork });
  } catch (err) {
    console.error('❌ Update Error:', err);
    res.status(500).json({ message: 'Error updating artwork', error: err });
  }
};

// ===== Delete Artwork (Artist only) =====
const deleteArtwork = async (req, res) => {
  try {
    if (!req.userId) return res.status(401).json({ message: 'Unauthorized' });
    if (req.userRole !== 'artist') {
      return res.status(403).json({ message: 'Forbidden: only artists can delete artworks' });
    }

    const { id } = req.params;
    const existing = await Artwork.findById(id);
    if (!existing) return res.status(404).json({ message: 'Artwork not found' });

    if (existing.artistID.toString() !== req.userId) {
      return res.status(403).json({ message: 'Forbidden: you are not the owner' });
    }

    await Artwork.findByIdAndDelete(id);
    res.status(200).json({ message: 'Artwork deleted successfully' });
  } catch (err) {
    console.error('❌ Delete Error:', err);
    res.status(500).json({ message: 'Error deleting artwork', error: err });
  }
};

module.exports = {
  uploadArtwork,
  getAllArtworks,
  getArtworkById,
  updateArtwork,
  deleteArtwork
};
