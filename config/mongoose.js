const mongoose = require("mongoose");

async function connectMongoose() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MongoDB URI is not defined in .env");
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
}

module.exports = connectMongoose;
