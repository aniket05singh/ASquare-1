const mongoose = require('mongoose');
const Nutrient = require("./userModel"); // Replace with the actual path to your model file
const dotenv = require('dotenv')

dotenv.config()

// Function to connect to MongoDB
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
    }
}

// Function to insert a nutrient entry
async function insertNutrient() {
    try {
        const newNutrient = new Nutrient({
            foodname: "Apple",
            quantity: 100,  // in grams
            Carbohydrate: 13.81,
            Protein: 0.26,
            Calcium: 6,
            Potassium_K: 107,
            Vitamin_C_total_ascorbic_acid: 4.6,
            Energy: 52 // in kcal
        });

        const savedNutrient = await newNutrient.save();
        console.log("Nutrient saved successfully:", savedNutrient);
    } catch (error) {
        console.error("Error inserting nutrient:", error);
    }
}

// Main function to run both operations
async function main() {
    await connectDB();  // Ensure DB connection
    await insertNutrient();  // Insert entry
    mongoose.connection.close(); // Close connection after inserting
}

main();
