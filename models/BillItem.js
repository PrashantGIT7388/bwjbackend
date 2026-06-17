const mongoose = require('mongoose');

const billItemSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  metalName: String,
  weight: Number,
  itemType: String,
  totalBeforeGst: Number,
  finalPrice: Number,
  makingDisplay: String,
  makingCharge: Number,
  rate: String,
  noGST: Boolean,
  itemValue: Number,
  originalMakingCharge: Number,
  originalFinalPrice: Number,
  isSilver: Boolean,
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('BillItem', billItemSchema);