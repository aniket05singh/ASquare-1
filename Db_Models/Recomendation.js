const mongoose = require('mongoose');
const recomendationSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Nutrient name (e.g., Vitamin C)
    sources: { type: [String], required: true }, // Food sources (e.g., Oranges, Spinach)
    dailyRequirement: { type: String, required: true }, // Daily requirement (e.g., 90mg for Vitamin C)
  });

const recomendation = mongoose.model('recomendation', recomendationSchema);
module.exports = recomendation;