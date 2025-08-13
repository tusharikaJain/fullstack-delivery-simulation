// backend/models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  valueRs: { type: Number, required: true },
  assignedRoute: { type: String, required: true }, // store routeId (string) to match existing CSV shape
  deliveryTimestamp: { type: Date }, // optional actual time when delivered (can be used later)
  deliveryMinutes: { type: Number }  // sample actual delivery time used in your simulation
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
