const mongoose = require("mongoose");

let isMongoConnected = false;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri);
      console.log("=========================================");
      console.log("🍃 MongoDB Atlas Connected Successfully!");
      console.log("=========================================");
      isMongoConnected = true;
      return true;
    } catch (err) {
      console.error("❌ MongoDB Connection Error:", err.message);
      console.log("Falling back to local JSON file storage.");
      isMongoConnected = false;
      return false;
    }
  } else {
    console.log("=========================================");
    console.log("💾 Using local JSON files as database.");
    console.log("=========================================");
    isMongoConnected = false;
    return false;
  }
};

const getDbMode = () => {
  return isMongoConnected ? "mongodb" : "json";
};

module.exports = { connectDB, getDbMode };
