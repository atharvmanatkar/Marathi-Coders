const mongoose = require('mongoose');

const ReceiptSchema = new mongoose.Schema({
  userId: { type: String, required: true, default: "shubham_01" },
  merchantName: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  // 🟢 NEW FIELDS FOR SPLITTING & LIMITS
  personalShare: { type: Number }, 
  splitWith: { type: Number, default: 1 },
  date: { type: Date, default: Date.now },
  category: { type: String },
  items: Array,
  imageUrl: { type: String }
});

module.exports = mongoose.model('Receipt', ReceiptSchema);