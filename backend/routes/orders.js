// backend/routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

let auth = (req, res, next) => next();
try { auth = require('../middleware/auth'); } catch(e){}

router.get('/', auth, async (req, res) => {
  try { const orders = await Order.find().sort({ createdAt: -1 }); res.json(orders); }
  catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { orderId, valueRs, assignedRoute, deliveryMinutes, deliveryTimestamp } = req.body;
    if (!orderId || valueRs == null || !assignedRoute) return res.status(400).json({ error: 'Missing required fields' });
    const exists = await Order.findOne({ orderId });
    if (exists) return res.status(400).json({ error: 'orderId exists' });
    const o = new Order({ orderId, valueRs, assignedRoute, deliveryMinutes, deliveryTimestamp });
    await o.save();
    res.status(201).json(o);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json(updated);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const removed = await Order.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
