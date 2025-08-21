const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { purchaseArtwork, getMyPurchases, getMySales } = require('../controllers/purchaseController');

router.post('/', authMiddleware, purchaseArtwork);
router.get('/my-purchases', authMiddleware, getMyPurchases);
router.get('/my-sales', authMiddleware, getMySales);

module.exports = router;
