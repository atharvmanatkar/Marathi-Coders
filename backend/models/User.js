const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String },
    profileImage: { type: String, default: "" },

    limits: {
        daily: { type: Number, default: 500 },
        weekly: { type: Number, default: 40000 },
        monthly: { type: Number, default: 15000 }
    },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);