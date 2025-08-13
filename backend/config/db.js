const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI_PROD; // Production URI in Render env vars
    console.log(`🔌 Connecting to MongoDB...`);

    await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
