const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { extractProducts } = require('../services/geminiService');
const Receipt = require('../models/Reciept');

// Import your new controller logic
const receiptController = require('../controllers/receiptController');

const router = express.Router();

// ================= CONFIGURATIONS =================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'SnapBudget_Receipts',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });

let lastRequestTime = 0;
const rateLimiter = (req, res, next) => {
  if (Date.now() - lastRequestTime < 1000) {
    return res.status(429).json({ error: "Too many requests, slow down!" });
  }
  lastRequestTime = Date.now();
  next();
};

// ================= DYNAMIC DASHBOARD ROUTES =================
// These now use the controller functions you just pasted

router.get('/api/dashboard-summary', receiptController.getDashboardSummary);
router.get('/api/top-merchants', receiptController.getTopMerchants);
// Add this line to your existing routes
router.get('/api/all-history', receiptController.getAllHistory);
// Add this line to handle single receipt fetching
router.get('/api/receipt/:id', receiptController.getReceiptById);

// ================= EXISTING DATA ROUTES =================

// Total Spending (Black Card)
router.get('/api/total-spending', async (req, res) => {
    try {
        const result = await Receipt.aggregate([
            { $match: { userId: "shubham_01" } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        res.json({ total: result[0]?.total || 0 });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Daily Stats (Bar Chart)
router.get('/api/daily-stats', async (req, res) => {
    try {
        const stats = await Receipt.aggregate([
            { $match: { userId: "shubham_01" } },
            {
                $group: {
                    _id: { $dayOfWeek: "$date" },
                    amount: { $sum: "$totalAmount" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);
        res.json(stats);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ================= UPLOAD ROUTE =================

router.post('/upload', rateLimiter, upload.single('receipt'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send('No image uploaded.');

    const aiResult = await extractProducts(req.file.path);
    const items = aiResult.items || [];
    const merchant = aiResult.merchant || "Unknown Store";
    const total = items.reduce((sum, item) => sum + Number(item.price), 0);

    const newReceipt = new Receipt({
      userId: "shubham_01",
      totalAmount: total,
      items: items.map(item => ({
        product: item.product,
        price: Number(item.price),
        category: item.category || 'Others'
      })),
      date: new Date(),
      merchantName: merchant,
      imageUrl: req.file.path
    });

    const savedReceipt = await newReceipt.save();
    res.json({ success: true, message: "Receipt processed!", data: savedReceipt });
  } catch (error) {
    res.status(500).json({ success: false, details: error.message });
  }
});

module.exports = router;