// backend/models/Route.js
const mongoose = require('mongoose');

const RouteSchema = new mongoose.Schema({
  routeId: { type: String, required: true, unique: true },
  distanceKm: { type: Number, required: true },
  trafficLevel: { type: String, enum: ['Low','Medium','High'], default: 'Low' },
  baseTimeMinutes: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Route', RouteSchema);
