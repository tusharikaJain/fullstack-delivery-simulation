// backend/routes/drivers.js
const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');

let authMiddleware = (req, res, next) => next();
try {
  authMiddleware = require('../middleware/auth'); // use if available
} catch (e) {
  /* no auth middleware found - routes stay public for dev */
}

// GET /api/drivers         -> list all drivers
router.get('/', authMiddleware, async (req, res) => {
  try {
    const drivers = await Driver.find().sort({ createdAt: -1 });
    res.json(drivers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/drivers        -> create driver
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, currentShiftHours = 0, pastWeekHours = [] } = req.body;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Name is required' });
    }
    const d = new Driver({ name, currentShiftHours, pastWeekHours });
    await d.save();
    res.status(201).json(d);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/drivers/:id     -> update driver
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {};
    const { name, currentShiftHours, pastWeekHours } = req.body;
    if (name !== undefined) updates.name = name;
    if (currentShiftHours !== undefined) updates.currentShiftHours = currentShiftHours;
    if (pastWeekHours !== undefined) updates.pastWeekHours = pastWeekHours;
    const updated = await Driver.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) return res.status(404).json({ error: 'Driver not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/drivers/:id  -> delete driver
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await Driver.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ error: 'Driver not found' });
    res.json({ message: 'Driver deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
