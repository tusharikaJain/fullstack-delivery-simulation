require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/drivers', require('./routes/drivers'));
app.use('/api/routes', require('./routes/routes'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/simulate', require('./routes/simulate'));

// simulation history (protected)
app.get('/api/simulations/history', require('./middleware/auth'), async (req, res) => {
  const SimulationResult = require('./models/SimulationResult');
  const results = await SimulationResult.find().sort({ createdAt: -1 }).limit(50);
  res.json(results);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
module.exports = app;
