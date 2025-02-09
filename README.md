# **ASquare**  

### 🌐 [Live Website](https://asquare-nine.vercel.app)  

## 🚀 **About the Project**  
ASquare is a **nutrition tracking** web app that helps users log their daily food intake, **detect nutrient deficiencies**, and **get personalized dietary recommendations** to maintain a balanced diet.  

## 🔥 **Features**  
✅ **Food Intake Logging** – Track what you eat daily  
✅ **Nutrient Analysis** – Identify deficiencies in essential vitamins and minerals  
✅ **Personalized Recommendations** – Get food suggestions to improve your diet  
✅ **Interactive Dashboard** – View intake trends with visually engaging charts  

## 🛠 **Technologies Used**  
- **Frontend**: [React.js](https://react.dev), [Tailwind CSS](https://tailwindcss.com), [GSAP](https://greensock.com/gsap/)  
- **Backend**: [Express.js](https://expressjs.com/), [Node.js](https://nodejs.org/), [MongoDB](https://www.mongodb.com/)  
- **Authentication**: [Firebase](https://firebase.google.com/)  

## 🐞 **Challenges Faced & Solutions**  
### **CORS Policy Issue**  
While integrating the backend with the frontend hosted on different platforms, **CORS errors** blocked API requests. The solution was to properly configure CORS middleware in Express:  
```js
const cors = require("cors");
app.use(cors({ 
  origin: "https://asquare-nine.vercel.app",
  methods: "GET,POST,PUT,DELETE",
  credentials: true 
}));
