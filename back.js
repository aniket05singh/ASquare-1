const express = require("express");
const fs = require("fs");
var request = require("request");
const cors = require("cors");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const Nutrient = require("./Db_Models/userModel");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const connectDB = require("./db2");
const userInfo = require("./Db_Models/userInfo");
const UserFood = require("./Db_Models/userDataSchema")
const dailyFood = require("./Db_Models/DailyFoods");
const recommendFood=require("./Db_Models/Recomendation");
app.use(
  cors({
    origin: [
      "https://asquare-q3uwg6wsx-anish-kumars-projects-a92a48e4.vercel.app",
      "https://asquare-nine.vercel.app",
    ],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(express.json());

async function generateContent(foodItem) {
  // Initialize the Generative AI model
  const genAI = new GoogleGenerativeAI(
   
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  console.log(foodItem);

  const prompt = `just give correct spelling of food name in two word for ${foodItem} no extra info`;

  // Generate content using the AI model
  const result = await model.generateContent(prompt);
  console.log("Generated Text: ", result.response.text());
  return result.response.text(); // Return the generated text
}

// Regex pattern to match content between '**' symbols
const regex = /\*\*(.*?)\*\*/g;

async function main(foodItem) {
  try {
    // Generate the content
    const text = await generateContent(foodItem);

    // Log the generated text (for debugging purposes)

    // Use match() to find all matches
    const matches = [];
    let match;

    // Find all matches using the regex
    while ((match = regex.exec(text)) !== null) {
      matches.push(match[1]); // match[1] is the captured content between '**'
    }

    // Output the matches
    console.log("Matched Items: ", matches);
    return matches;
  } catch (error) {
    console.error("Error generating content:", error);
  }
}

// Call the nutritionix api

app.post("/formsubmit", async (req, res) => {
  const {id,todayFoods,} = req.body;

  try {
    // const foodItems = await main(food); // Assuming `main` returns an array of food items
    // console.log("Received food items:", foodItems);
    await connectDB();
    const responses = [];

    console.log(new Date().toLocaleString());
    console.log(todayFoods);
    const newFood = await dailyFood.findOne({id:id});
    if(newFood != null){
      await dailyFood.updateOne({ id: id }, { $push: {foodData: { $each: todayFoods } } });
    }
    else{
      const newDailyFood = new dailyFood({ id: id,foodData: todayFoods });
      await newDailyFood.save();
    }
    const responsePromises = todayFoods.map(async (item) => {
      const response = await makeDbRequest(item.foodname, item.quantity);
      return response; // Return the response to be collected in Promise.all
    });

    // Wait for all the promises to resolve
    const allResponses = await Promise.all(responsePromises);
    responses.push(...allResponses); // Merge all results
    

    res.json({ success: true, data: responses });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  } finally {
    console.log("closing connection");
    mongoose.connection.close(); // Always close the connection
  }
});

// Helper function to make requests to Nutritionix API
// const makeNutritionixRequest = (item) => {
//   return new Promise((resolve, reject) => {
//     const options = {
//       method: 'POST',
//       url: 'https://trackapi.nutritionix.com/v2/natural/nutrients',
//       headers: {
//         'Content-Type': 'application/json',
//         'x-app-id': '1ebff491',
//         'x-app-key': 'a95ebbb5ca84cc23b014668f33ea8f91',
//       },
//       body: JSON.stringify({ query: item }),
//     };

//     request(options, (error, response, body) => {
//       if (error) {
//         return reject(error);
//       }
//       resolve(JSON.parse(body));
//     });
//   });
// };

// app.post('/formsubmit', async (req, res) => {
//   const {food} = req.body;
//    const foodItems= await main(food);
//   console.log("pahucho gyo");
//   console.log("skjdfh",foodItems);
//   foodItems.map(setTimeout((item) => {
//     var options = {
//         method: 'POST',
//         url: 'https://trackapi.nutritionix.com/v2/natural/nutrients',
//         headers: {
//           'Content-Type': 'application/json',
//           'x-app-id': '1ebff491',
//           'x-app-key': 'a95ebbb5ca84cc23b014668f33ea8f91'
//         },
//         body: JSON.stringify({
//           "query": item
//         })
//       };

//       request(options, function (error, response) {
//         if (error) throw new Error(error);
//         res.json({response: response.body});
//       });
//   },10000));
// })

const makeDbRequest = async (food, quantity) => {
  // await connectDB(); // Ensure DB is connected

  try {
    const updatedUser = await Nutrient.findOne({ foodname: food }); // Search by name
    console.log(updatedUser, "hii");
    console.log("quat",quantity)
    const factor = quantity / updatedUser.quantity;
    console.log("calories", updatedUser.Energy * factor);
    return {updatedUser};
  } catch (err) {
    console.error("Database Error:", err);
  }
};

app.post("/infosubmit", async (req, res) => {
  try {
    await connectDB();
    const data = req.body;
    const { id, name, nationality, height, weight, dob } = data;
    const newUser = new userInfo({id, name, nationality, height, weight, dob});
    await newUser.save();
    console.log("User saved successfully:", newUser);
    res.json({ success: true, data: newUser });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  } finally {
    mongoose.connection.close(); // Always close the connection
  }
});
app.post("/checkUser", async (req, res) => {
  try {
    await connectDB();
    const data = req.body;
    const { id } = data;
    const user = await userInfo.findOne({ id: id });
    console.log("User found successfully:", user);
    if(user != null){
      res.json({ success: true});
    }
    else{
      res.json({ success: false});
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  } finally {
    mongoose.connection.close(); // Always close the connection
  }
});
app.post("/history", async (req, res) => {
  try {
    await connectDB();
    const { id, date } = req.body;

    // Convert date string to start and end of the day
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Find all food entries for the given user and date range
    const today = new Date(); 
    const inputdate=new Date(date);
    const isToday =
  inputdate.getFullYear() === today.getFullYear() &&
  inputdate.getMonth() === today.getMonth() &&
  inputdate.getDate() === today.getDate();
  let userEntries={};  
  if(isToday){
    userEntries = await dailyFood.find({
      id: id,
    });
  }
    else{
      
    userEntries = await UserFood.find({
      id: id,
      createdAt: { $gte: startDate, $lte: endDate }
    });
    }
    console.log(userEntries);
    if (!userEntries || userEntries.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data found for this user on the given date",
      });
    }

    // Collect all foodData entries into an array
    console.log("____________________________________");
    const allFoodData = userEntries.flatMap(entry => entry.foodData);
    console.log(allFoodData);
    console.log("____________________________________");
    const cal = {Carbohydrate:0,
      Protein:0,
      Total_lipid_fat:0,
      Vitamin_A:0,
      // Vitamin_A_RAE:0,
      Vitamin_B_6:0,
      Vitamin_B_12:0,
      // Vitamin_B_12_added:0,
      Vitamin_C_total_ascorbic_acid:0,
      // Vitamin_D_D2_D3:0,
      // Vitamin_D2_ergocalciferol:0,
      // Vitamin_D3_cholecalciferol:0,
      Vitamin_D:0,
      Vitamin_E_alpha_tocopherol:0,
      // Vitamin_E_added:0,
      Vitamin_K_phylloquinone:0,
      Calcium:0,
      Iron_Fe:0,
      Magnesium_Mg:0,
      Potassium_K:0,
      Zinc_Zn:0,
      Sodium_Na:0,
      Iodine:0,
      Selenium_Se:0,
      Phosphorus_P:0,
      Manganese_Mn:0,
      Copper_Cu:0,
      Fiber_total_dietary:0,
      Water:0,
      Cholesterol:0,};
    for(let i=0;i<allFoodData.length;i++){
      const nut= await makeDbRequest2(allFoodData[i].foodname,allFoodData[i].quantity);
      for(let key in cal){
        cal[key]+=nut[key];
      }
    }
    res.send({data:cal});

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  } finally {
    mongoose.connection.close(); // Always close the connection
  }
});


const makeDbRequest2 = async (food, quantity) => {
  // await connectDB(); // Ensure DB is connected

  try {
    const updatedUser = await Nutrient.findOne({ foodname: food }); // Search by name
    const factor = quantity / updatedUser.quantity;
    console.log("calories", updatedUser.Energy * factor);
    return {Carbohydrate:updatedUser.Carbohydrate* factor,
      Protein:updatedUser.Protein* factor,
      Total_lipid_fat:updatedUser.Total_lipid_fat* factor,
      Vitamin_A:(updatedUser.Vitamin_A_IU+updatedUser.Vitamin_A_RAE)* factor,
      Vitamin_B_6:updatedUser.Vitamin_B_6* factor,
      Vitamin_B_12:(updatedUser.Vitamin_B_12+updatedUser.Vitamin_B_12_added)* factor,
      Vitamin_C_total_ascorbic_acid:updatedUser.Vitamin_C_total_ascorbic_acid* factor,
      // Vitamin_D_D2_D3:updatedUser.Vitamin_D_D2_D3* factor,
      // Vitamin_D2_ergocalciferol:updatedUser.Vitamin_D2_ergocalciferol* factor,
      // Vitamin_D3_cholecalciferol:updatedUser.Vitamin_D3_cholecalciferol* factor,
      Vitamin_D:updatedUser.Vitamin_D* factor,
      Vitamin_E_alpha_tocopherol:(updatedUser.Vitamin_E_alpha_tocopherol+updatedUser.Vitamin_E_added)* factor,
      Vitamin_K_phylloquinone:updatedUser.Vitamin_K_phylloquinone* factor,
      Calcium:updatedUser.Calcium* factor,
      Iron_Fe:updatedUser.Iron_Fe* factor,
      Magnesium_Mg:updatedUser.Magnesium_Mg* factor,
      Potassium_K:updatedUser.Potassium_K* factor,
      Zinc_Zn:updatedUser.Zinc_Zn* factor,
      Sodium_Na:updatedUser.Sodium_Na* factor,
      Iodine:updatedUser.Iodine* factor,
      Selenium_Se:updatedUser.Selenium_Se* factor,
      Phosphorus_P:updatedUser.Phosphorus_P* factor,
      Manganese_Mn:updatedUser.Manganese_Mn* factor,
      Copper_Cu:updatedUser.Copper_Cu* factor,
      Fiber_total_dietary:updatedUser.Fiber_total_dietary* factor,
      Water:updatedUser.Water* factor,
      Cholesterol:updatedUser.Cholesterol* factor,};
  } catch (err) {
    console.error("Database Error:", err);
  }
};
app.post("/recommend", async (req, res) => {
  try {
    await connectDB();
    const { defi } = req.body;
    const recFoods=[]
    for(let i=0;i<defi.length;i++){
      const nut= await makeDbRequest3(defi[i]);
      recFoods.push(nut);
    }
    console.log(recFoods);

    res.send({data:recFoods});

    
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  } finally {
    mongoose.connection.close(); // Always close the connection
  }
});
const makeDbRequest3 = async (nut) => {
  // await connectDB(); // Ensure DB is connected

  try {
    const updatedUser = await recommendFood.findOne({ name: nut }); // Search by name
    return updatedUser;
  } catch (err) {
    console.error("Database Error:", err);
  }
};

app.post("/history1", async (req, res) => {
  try {
    await connectDB();
    const { id } = req.body;

    // Fetch user food history
    const userEntries = await UserFood.find({ id });
    if (!userEntries.length) {
      return res.status(404).json({ success: false, message: "No food history found" });
    }

    console.log("User Entries:", userEntries.length);

    // Initialize nutrient totals
    const cal = {
      Carbohydrate: 0, Protein: 0, Total_lipid_fat: 0, Vitamin_A: 0,
      Vitamin_B_6: 0, Vitamin_B_12: 0, Vitamin_C_total_ascorbic_acid: 0, Vitamin_D: 0,
      Vitamin_E_alpha_tocopherol: 0, Vitamin_K_phylloquinone: 0, Calcium: 0, Iron_Fe: 0,
      Magnesium_Mg: 0, Potassium_K: 0, Zinc_Zn: 0, Sodium_Na: 0, Iodine: 0, Selenium_Se: 0,
      Phosphorus_P: 0, Manganese_Mn: 0, Copper_Cu: 0, Fiber_total_dietary: 0, Water: 0, Cholesterol: 0,
    };

    // Process each user's food history
    for (let entry of userEntries) {
      const allFoodData = entry.foodData; // Already an array

      for (let food of allFoodData) {
        const nut = await makeDbRequest2(food.foodname, food.quantity);
        for (let key in cal) {
          cal[key] += nut[key] || 0; // Ensure undefined values don't cause errors
        }
      }
    }

    res.json({ success: true, data: cal });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
