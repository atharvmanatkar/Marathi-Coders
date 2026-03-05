const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create User
router.post('/api/users', async (req, res) => {
  try {
    const { name, email, password, profileImage } = req.body;

    const user = new User({
      name,
      email,
      password,
      profileImage
    });

    await user.save();

    res.status(201).json({
      message: "User created successfully",
      user
    });

  } catch (error) {
    res.status(500).json({
      message: "Error creating user",
      error: error.message
    });
  }
});

module.exports = router;