const mongoose = require('mongoose');
module.exports = mongoose.model('Donation', new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodType: { type: String, required: true },            // e.g. Veg meals, Bread, Fruits
  description: String,
  servings: { type: Number, required: true, min: 1 },     // number of meals / portions
  preparedTime: Date,
  expiryTime: { type: Date, required: true },             // safe-to-eat deadline
  address: { street: String, area: String, city: { type: String, required: true }, pincode: String },
  contactPhone: String,
  pickupInstructions: String,
  status: { type: String, enum: ['available', 'claimed', 'collected', 'cancelled'], default: 'available' },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  collectedAt: Date,
}, { timestamps: true }));
