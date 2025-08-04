const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadArtwork, getAllArtworks } = require('../controllers/artworkController');

// Set up multer to store files in /uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// POST route for file upload with multer middleware
router.post('/upload', upload.single('image'), uploadArtwork);

// GET all artworks
router.get('/', getAllArtworks);

module.exports = router;
