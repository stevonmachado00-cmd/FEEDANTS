const mongoose = require('mongoose');

/**
 * Connects to MongoDB with graceful error handling
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/feedants';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ MongoDB connection warning: ${error.message}`);
    console.warn('⚡ Operating with dynamic resilience: API fallback active.');
    return false;
  }
};

module.exports = connectDB;
