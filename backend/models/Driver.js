const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  currentShiftHours: { type: Number, default: 0 }, // hours today
  pastWeekHours: { type: [Number], default: [] } // last 7 days hours array (most recent last)
}, { timestamps: true });

module.exports = mongoose.model('Driver', DriverSchema);
