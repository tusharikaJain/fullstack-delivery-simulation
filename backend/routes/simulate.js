const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const simulateCtrl = require('../controllers/simulateController');

router.post('/', auth, simulateCtrl.runSimulation);

module.exports = router;
