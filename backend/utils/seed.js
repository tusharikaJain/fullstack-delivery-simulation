require('dotenv').config();
const connectDB = require('../config/db');
const Driver = require('../models/Driver');
const Route = require('../models/Route');
const Order = require('../models/Order');
const fs = require('fs');
const path = require('path');

const run = async () => {
  try {
    await connectDB();
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'initial_data.json'), 'utf-8'));

    await Driver.deleteMany({});
    await Route.deleteMany({});
    await Order.deleteMany({});

    if (data.drivers && data.drivers.length) await Driver.insertMany(data.drivers);
    if (data.routes && data.routes.length) await Route.insertMany(data.routes);

    if (data.orders && data.orders.length) {
      const orders = data.orders.map(o => ({
        orderId: o.orderId,
        valueRs: o.valueRs,
        assignedRoute: o.assignedRoute,
        // seed with a dummy date + time derived from deliveryMinutes (so it's valid Date)
        deliveryTimestamp: new Date(2025, 0, 1, Math.floor(o.deliveryMinutes / 60), o.deliveryMinutes % 60)
      }));
      await Order.insertMany(orders);
    }

    console.log('✅ Database seeded with initial data');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
