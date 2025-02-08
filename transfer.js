const mongoose = require("mongoose");
const cron = require("node-cron");
const TableASchema = require("./Db_Models/userDataSchema");
const TableBSchema = require("./Db_Models/DailyFoods");
const connectDB = require("./Db_Models/db");

// Cron Job to Run at 11:59:59 PM Every Day
cron.schedule("10 9 16 * * *", async () => {
  console.log("Cron Job Running: Transferring Data...");

  try {
    await connectDB(); // Connect to DB

    // Fetch all data from TableA
    const dataToTransfer = await TableBSchema.find({});
    if (dataToTransfer.length === 0) {
      console.log("No data found in TableA to transfer.");
      return;
    }

    // Insert into TableB
    await TableASchema.insertMany(dataToTransfer);

    // Delete from TableA after transferring
    await TableBSchema.deleteMany({});

    console.log("Data transferred successfully from TableA to TableB.");
  } catch (error) {
    console.error("Error during data transfer:", error);
  } finally {
    mongoose.connection.close(); // Close DB connection
  }
});

console.log("Cron job scheduled: Data will be transferred at 11:59:59 PM daily.");
