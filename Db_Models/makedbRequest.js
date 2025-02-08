const mongoose = require('mongoose');
const Nutrient = require("./userModel");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const connectDB = require("./db2");

const makeDbRequest = async (food, quantity) => {
    await connectDB(); // Ensure DB is connected
  
    try {
      const updatedUser = await Nutrient.findOne({ name: food }); // Search by name
      console.log(updatedUser);
    } catch (err) {
      console.error('Database Error:', err);
    } finally {
      mongoose.connection.close(); // Always close the connection
    }
  };
   

module.exports = makeDbRequest;