const express = require('express');
const router = express.Router();
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');
const {
  uploadArtwork,
  getAllArtworks,
  getArtworkById,
  updateArtwork,
  deleteArtwork
} = require('../controllers/artworkController');

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Public routes (search & filters also handled here)
router.get('/', getAllArtworks);
router.get('/:id', getArtworkById);

// Protected routes
router.post('/upload', authMiddleware, upload.single('image'), uploadArtwork);
router.put('/:id', authMiddleware, upload.single('image'), updateArtwork);
router.delete('/:id', authMiddleware, deleteArtwork);

module.exports = router;
