const Route = require('../models/Route');

exports.createRoute = async (req, res) => {
  try {
    const r = new Route(req.body);
    await r.save();
    res.json(r);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateRoute = async (req, res) => {
  try {
    const r = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(r);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteRoute = async (req, res) => {
  try {
    await Route.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
