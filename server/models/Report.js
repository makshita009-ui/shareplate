const mongoose = require('mongoose');
module.exports = mongoose.model('Report', new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  donation: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['open', 'resolved'], default: 'open' },
}, { timestamps: true }));
