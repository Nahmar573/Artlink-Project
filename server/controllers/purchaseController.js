// server/controllers/purchaseController.js
const Artwork = require('../models/Artwork');
const Purchase = require('../models/Purchase');

/**
 * Small-fix goals (no behavior changes to listing/filtering):
 * 1) Prevent double-purchase by checking the Purchase collection (source of truth).
 * 2) Keep existing flows intact; do not rely on an isSold/sold flag (schema-agnostic).
 * 3) Optional best-effort: set an 'isSold' field on the artwork (won't break if schema lacks it).
 */
const purchaseArtwork = async (req, res) => {
  try {
    const { artworkId } = req.body;
    const buyerId = req.userId;
    const userRole = req.userRole;

    if (!buyerId) {
      return res.status(401).json({ message: 'Unauthorized: user id required' });
    }
    if (userRole !== 'buyer') {
      return res.status(403).json({ message: 'Only buyers can purchase artworks' });
    }

    // 1) Artwork must exist
    const artwork = await Artwork.findById(artworkId);
    if (!artwork) return res.status(404).json({ message: 'Artwork not found' });

    // 2) Buyer cannot buy their own artwork
    if (String(artwork.artistID) === String(buyerId)) {
      return res.status(403).json({ message: 'You cannot buy your own artwork' });
    }

    // 3) Prevent double-purchase by checking if a purchase already exists for this artwork
    const existingPurchase = await Purchase.findOne({ artwork: artworkId });
    if (existingPurchase) {
      return res.status(400).json({ message: 'Artwork already sold' });
    }

    // 4) Record the purchase
    const purchase = new Purchase({
      artwork: artwork._id,
      buyer: buyerId,
      artist: artwork.artistID,
      price: artwork.price,
    });
    await purchase.save();

    // 5) Best-effort mark as sold (safe even if schema doesn't include this field)
    try {
      await Artwork.updateOne(
        { _id: artwork._id },
        { $set: { isSold: true } } // harmless if schema doesn't have it (ignored in strict mode)
      );
    } catch (e) {
      // ignore — not critical for small fixes
    }

    // 6) Optionally return with some population to show more data to the client
    const populated = await Purchase.findById(purchase._id)
      .populate('artwork')               // includes imageUrl/title/etc. if present
      .populate('buyer', 'name email')   // minimal buyer info
      .populate('artist', 'name email'); // minimal artist info

    res.status(201).json({ message: 'Purchase successful', purchase: populated });
  } catch (err) {
    console.error('❌ Purchase Error:', err);
    res.status(500).json({ message: 'Error processing purchase', error: err });
  }
};

const getMyPurchases = async (req, res) => {
  try {
    if (!req.userId) return res.status(401).json({ message: 'Unauthorized' });

    const purchases = await Purchase.find({ buyer: req.userId })
      .sort({ createdAt: -1 })
      .populate('artwork')               // include imageUrl so UI can show images
      .populate('artist', 'name email'); // show who sold it

    res.json(purchases);
  } catch (err) {
    console.error('❌ Fetch Purchases Error:', err);
    res.status(500).json({ message: 'Error fetching purchases', error: err });
  }
};

const getMySales = async (req, res) => {
  try {
    if (!req.userId) return res.status(401).json({ message: 'Unauthorized' });

    const sales = await Purchase.find({ artist: req.userId })
      .sort({ createdAt: -1 })
      .populate('artwork')               // include imageUrl so UI can show images
      .populate('buyer', 'name email');  // show who bought it

    res.json(sales);
  } catch (err) {
    console.error('❌ Fetch Sales Error:', err);
    res.status(500).json({ message: 'Error fetching sales', error: err });
  }
};

module.exports = { purchaseArtwork, getMyPurchases, getMySales };
