const mongoose = require("mongoose");
const connectDB = async () => {
  const URI = process.env.mongoDB_URL;
  try {
    await mongoose.connect(URI);
    console.log("connected successfuly");
  } catch (error) {
    console.log("Connection failed:", error.message);
    process.exit(0);
  }
};
module.exports = connectDB;
