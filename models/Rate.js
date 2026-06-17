const mongoose = require('mongoose');

const rateSchema = new mongoose.Schema({
  gold18KRate: { type: String, default: '' },
  gold20KRate: { type: String, default: '' },
  gold22KRate: { type: String, default: '' },
  gold24KRate: { type: String, default: '' },
  silverRate: { type: String, default: '' },
  silver925Rate: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('Rate', rateSchema);