const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Driver = require('./models/Driver'); // path is correct from backend root

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Optional: clear existing drivers
    await Driver.deleteMany({});

    // Insert new driver records
    await Driver.insertMany([
      { name: "Amit", currentShiftHours: 6, pastWeekHours: [6, 8, 7, 7, 7, 6, 10] },
      { name: "Priya", currentShiftHours: 6, pastWeekHours: [10, 9, 6, 6, 6, 7, 7] },
      { name: "Ravi", currentShiftHours: 5, pastWeekHours: [6, 8, 7, 6, 7, 6, 5] },
      { name: "Neha", currentShiftHours: 4, pastWeekHours: [8, 9, 6, 7, 6, 7, 8] },
      { name: "Karan", currentShiftHours: 3, pastWeekHours: [7, 6, 6, 8, 6, 7, 5] }
    ]);

    console.log('✅ Drivers added successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding drivers:', err);
    process.exit(1);
  }
}

seed();
