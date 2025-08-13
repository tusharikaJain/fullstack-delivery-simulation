const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI_PROD; // Production URI in Render env vars

    // Check if URI exists
    if (!mongoURI) {
      console.error('❌ MONGO_URI_PROD is not set in environment variables!');
      process.exit(1);
    }

    // Log start of URI (hide password)
    const uriPreview = mongoURI.replace(/:\/\/.*?:.*?@/, '://<hidden>:<hidden>@');
    console.log(`🔌 Connecting to MongoDB using URI: ${uriPreview}`);

    // Connect
    await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
