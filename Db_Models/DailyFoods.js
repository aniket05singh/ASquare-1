const mongoose = require("mongoose");

const dailyFoodSchema = new mongoose.Schema({
  id: { type: String, required: true }, // User Identifier
  foodData: [
    {
      foodname: { type: String, required: true },
      quantity: { type: Number, required: true },
    }
  ],
  
});

// Create Model
const dailyFood = mongoose.model("dailyFood", dailyFoodSchema);

module.exports = dailyFood;
