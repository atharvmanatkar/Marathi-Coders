const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get limits using name (hardcoded)
router.get('/limits', async (req, res) => {
  try {
    const user = await User.findOne({ name: "Vyankatesh" });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.limits);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update limits
router.put('/limits', async (req, res) => {
  try {
    const { type, value } = req.body;

    const user = await User.findOne({ name: "Vyankatesh" });

    user.limits[type] = value;
    await user.save();

    res.json(user.limits);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;