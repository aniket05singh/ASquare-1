const mongoose = require('mongoose');
const Nutrient = require("./userModel"); // Import the Mongoose model
const connectDB = require("./db");

const updateFoods = async () => {
    try {
        await connectDB(); // Ensure DB is connected

        const foods = await Nutrient.find(); // Fetch all records

        // for (let doc of foods) {
        //     let scaleFactor = 100 / doc.quantity; // Compute scale factor
        //     let updatedFields = { quantity: 100 }; // Store updated fields

        //     // Loop through each field in the document
        //     for (let key in doc.toObject()) {
        //         if (key !== "_id" && key !== "foodname" && key !== "quantity" && typeof doc[key] === "number") {
        //             updatedFields[key] = doc[key] * scaleFactor; // Scale numeric values
        //         }
        //     }

        //     // Update document with new values
        //     await Nutrient.updateOne(
        //         { _id: doc._id }, // Find document by ID
        //         { $set: updatedFields } // Apply updated values
        //     );
        // }

        console.log("All food entries updated successfully!");
    } catch (error) {
        console.error("Error updating food entries:", error);
    }
};

const main = async () => {
    await updateFoods();
    mongoose.connection.close();
};

main();
