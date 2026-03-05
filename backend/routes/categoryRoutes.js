const express = require('express');
const Receipt = require('../models/Reciept');
const router = express.Router();

// Category Breakdown
router.get('/breakdown', async (req, res) => {
    try {
        const breakdown = await Receipt.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.category",
                    total: { $sum: "$items.price" }
                }
            },
            { $sort: { total: -1 } }
        ]);
        res.json(breakdown);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Single Category Details
router.get('/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const receipts = await Receipt.find({
            "items.category": category
        });
        res.json(receipts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/add-item', async (req, res) => {
  try {
    const { product, price, category } = req.body;

    if (!product || !price || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newReceipt = new Receipt({
      userId: 'shubham_01',
      items: [{ product, price, category }],
      totalAmount: price,             // same as the added item's price
      imageUrl: '',                   // optional, can leave blank for now
    });

    await newReceipt.save();

    res.status(201).json({ message: 'Item added successfully', receipt: newReceipt });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;