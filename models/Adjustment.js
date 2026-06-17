const mongoose = require('mongoose');

const adjustmentSchema = new mongoose.Schema({
  type: { type: String, enum: ['gold', 'silver'], required: true },
  itemId: { type: Number, required: true },
  adjustments: {
    desiredFinal: Number,
    newMaking: Number,
    newFinal: Number
  },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

adjustmentSchema.index({ type: 1, itemId: 1 }, { unique: true });

module.exports = mongoose.model('Adjustment', adjustmentSchema);