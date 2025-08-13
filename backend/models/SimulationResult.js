const mongoose = require('mongoose');

const SimulationResultSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  inputs: Object,
  totalProfit: Number,
  efficiencyScore: Number,
  onTimeDeliveries: Number,
  lateDeliveries: Number,
  totalDeliveries: Number,
  fuelCostBreakdown: Object,
  details: Array // optional per-order breakdown
}, { timestamps: true });

module.exports = mongoose.model('SimulationResult', SimulationResultSchema);
