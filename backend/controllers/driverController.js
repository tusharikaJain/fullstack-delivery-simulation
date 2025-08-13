const Driver = require('../models/Driver');

exports.createDriver = async (req, res) => {
  try {
    const d = new Driver(req.body);
    await d.save();
    res.json(d);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDriver = async (req, res) => {
  try {
    const d = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(d);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteDriver = async (req, res) => {
  try {
    await Driver.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
