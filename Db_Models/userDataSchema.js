const mongoose = require("mongoose");

const userFoodSchema = new mongoose.Schema({
  id: { type: String, required: true }, // User Identifier
  foodData: [
    {
      foodname: { type: String, required: true },
      quantity: { type: Number, required: true },
    }
  ],
  createdAt: { type: Date, default: Date.now, expires: "15d" }, // TTL index to auto-delete after 15 days
  
});

// Create Model
const UserFood = mongoose.model("UserFood", userFoodSchema);

module.exports = UserFood;
