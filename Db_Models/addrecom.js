const mongoose = require('mongoose');
const recomendation = require("./Recomendation"); // Import the Mongoose model
const connectDB = require("./db");

const dishes = [
    ["Carbohydrate", ["Rice", "Roti", "Potatoes", "Poha", "Idli", "Dosa", "Bread", "Paratha"], "130g"],
    ["Protein", ["Lentils (Dal)", "Eggs", "Chicken", "Paneer", "Chana (Chickpeas)", "Soya Chunks", "Fish"], "50g"],
    ["Total_lipid_fat", ["Mustard Oil", "Ghee", "Nuts", "Coconut Oil", "Butter", "Cheese", "Avocado"], "70g"],

    // Vitamins
    ["Vitamin_A_IU", ["Carrots", "Spinach", "Sweet Potatoes", "Pumpkin", "Papaya", "Mango", "Tomatoes"], "3000 IU"],
    ["Vitamin_A_RAE", ["Carrots", "Spinach", "Pumpkin", "Liver", "Dairy Products"], "900 mcg"],
    ["Vitamin_B_6", ["Whole Grains", "Eggs", "Milk", "Bananas", "Curd (Dahi)", "Peanuts", "Legumes"], "1.3mg"],
    ["Vitamin_B_12", ["Eggs", "Milk", "Fish", "Meat", "Fortified Cereals"], "2.4mcg"],
    ["Vitamin_B_12_added", ["Fortified Cereals", "Nutritional Yeast", "Dairy Products"], "2.4mcg"],
    ["Vitamin_C_total_ascorbic_acid", ["Oranges", "Guava", "Amla", "Lemon", "Tomatoes", "Bell Peppers", "Coriander Leaves"], "90mg"],
    ["Vitamin_D_D2_D3", ["Fortified Milk", "Fish", "Sunlight Exposure", "Mushrooms", "Egg Yolks"], "15mcg (600 IU)"],
    ["Vitamin_D2_ergocalciferol", ["Mushrooms", "Fortified Foods"], "15mcg"],
    ["Vitamin_D3_cholecalciferol", ["Fish", "Egg Yolks", "Fortified Dairy"], "15mcg"],
    ["Vitamin_D", ["Sunlight Exposure", "Fortified Milk", "Fish", "Mushrooms"], "15mcg (600 IU)"],
    ["Vitamin_E_alpha_tocopherol", ["Almonds", "Sunflower Seeds", "Spinach", "Peanuts", "Sesame Seeds (Til)", "Wheat Germ"], "15mg"],
    ["Vitamin_E_added", ["Fortified Cereals", "Vegetable Oils"], "15mg"],
    ["Vitamin_K_phylloquinone", ["Fenugreek Leaves (Methi)", "Spinach", "Broccoli", "Cabbage", "Lettuce", "Drumstick Leaves"], "120mcg"],
    
    // Minerals
    ["Calcium", ["Milk", "Curd (Dahi)", "Sesame Seeds (Til)", "Ragi (Finger Millet)", "Cheese", "Almonds", "Tofu"], "1000mg"],
    ["Iron_Fe", ["Spinach", "Lentils (Dal)", "Jaggery", "Methi Leaves", "Beetroot", "Peanuts", "Dates"], "18mg"],
    ["Magnesium_Mg", ["Almonds", "Cashews", "Whole Grains", "Dark Chocolate", "Pumpkin Seeds", "Green Leafy Vegetables"], "400mg"],
    ["Potassium_K", ["Bananas", "Coconut Water", "Potatoes", "Oranges", "Sweet Lime (Mosambi)", "Spinach", "Tomatoes"], "4700mg"],
    ["Zinc_Zn", ["Pumpkin Seeds", "Chickpeas", "Meat", "Cashews", "Dairy Products", "Eggs", "Lentils"], "11mg"],
    ["Sodium_Na", ["Table Salt", "Pickles", "Processed Foods (in moderation)", "Papad", "Cheese", "Soy Sauce"], "2300mg"],
    ["Iodine", ["Iodized Salt", "Seafood", "Dairy", "Eggs", "Seaweed"], "150mcg"],
    ["Selenium_Se", ["Brazil Nuts", "Sunflower Seeds", "Eggs", "Whole Wheat Bread", "Garlic", "Meat", "Brown Rice"], "55mcg"],
    ["Phosphorus_P", ["Dairy Products", "Meat", "Fish", "Nuts", "Beans", "Whole Grains"], "700mg"],
    ["Manganese_Mn", ["Pineapple", "Nuts", "Whole Grains", "Tea", "Leafy Vegetables"], "2.3mg"],
    ["Copper_Cu", ["Nuts", "Seeds", "Shellfish", "Whole Grains", "Dark Chocolate"], "900mcg"],
    
    // Other Nutrients
    ["Fiber_total_dietary", ["Whole Grains", "Fruits", "Vegetables", "Flaxseeds", "Chia Seeds", "Oats", "Legumes"], "30g"],
    ["Water", ["Plain Water", "Coconut Water", "Buttermilk (Chaas)", "Lassi", "Herbal Teas", "Lemon Water"], "2-3L"],
    ["Cholesterol", ["Eggs", "Meat", "Fish", "Dairy"], "300mg (Limit)"]
];

// Function to add dishes
const addDishes = async (name, sources, dailyRequirement) => {
    try {
        const newDish = new recomendation({ name, sources, dailyRequirement });
        await newDish.save();
        console.log("Added:", name);
    } catch (err) {
        console.log("Error adding", name, ":", err.message);
    }
};

// Function to insert all dishes
const insertDishes = async () => {
    try {
        await connectDB(); // Connect to the database

        for (let i = 0; i < dishes.length; i++) {
            const [name, sources, dailyRequirement] = dishes[i];
            await addDishes(name, sources, dailyRequirement);
        }

        console.log("All dishes added successfully!");
        mongoose.connection.close(); // Close DB connection
    } catch (err) {
        console.log("Error:", err.message);
    }
};

// Run the function
// insertDishes();

for(let a=0;a<dishes.length;a++){
    console.log(`${dishes[a][0] }:0,`);
}