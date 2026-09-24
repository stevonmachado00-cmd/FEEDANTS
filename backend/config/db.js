const mongoose = require('mongoose');
const dns = require('dns');

/**
 * Connects to MongoDB with graceful error handling & DNS fallback
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/feedants';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    if (error.message && error.message.includes('querySrv')) {
      try {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
        const conn = await mongoose.connect(uri, {
          serverSelectionTimeoutMS: 5000,
        });
        console.log(`✅ MongoDB Connected (via DNS fallback): ${conn.connection.host}`);
        return true;
      } catch (retryError) {
        console.warn(`⚠️ MongoDB connection warning: ${retryError.message}`);
      }
    } else {
      console.warn(`⚠️ MongoDB connection warning: ${error.message}`);
    }
    console.warn('⚡ Operating with dynamic resilience: API fallback active.');
    return false;
  }
};

module.exports = connectDB;
