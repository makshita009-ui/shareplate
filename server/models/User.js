const mongoose = require('mongoose');
module.exports = mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['donor', 'ngo', 'admin'], default: 'donor' },
  orgName: String,
  phone: String,
  city: String,
  isVerified: { type: Boolean, default: false },
}, { timestamps: true }));
