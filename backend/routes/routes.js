// backend/routes/routes.js
const express = require('express');
const router = express.Router();
const RouteModel = require('../models/Route');

let auth = (req, res, next) => next();
try { auth = require('../middleware/auth'); } catch(e){}

router.get('/', auth, async (req, res) => {
  try { const routes = await RouteModel.find().sort({ createdAt: -1 }); res.json(routes); }
  catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { routeId, distanceKm, trafficLevel='Low', baseTimeMinutes } = req.body;
    if (!routeId || distanceKm == null || baseTimeMinutes == null) return res.status(400).json({ error: 'Missing fields' });
    const exists = await RouteModel.findOne({ routeId });
    if (exists) return res.status(400).json({ error: 'routeId exists' });
    const r = new RouteModel({ routeId, distanceKm, trafficLevel, baseTimeMinutes });
    await r.save();
    res.status(201).json(r);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await RouteModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Route not found' });
    res.json(updated);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const removed = await RouteModel.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Route not found' });
    res.json({ message: 'Route deleted' });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
