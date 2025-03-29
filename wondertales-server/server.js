require("dotenv").config();
const express = require('express');
const cors = require('cors');
const connectDB = require("./config/db");
const path = require("path");

//routes folder 
const userRoutes = require('./routes/auth.Routes.js')
const storiesRoutes = require('./routes/story.Routes.js');

const app = express();

// Middleware
app.use(express.json());

// CORS with explicit settings
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// Connect to DB with error handling
connectDB().catch(err => {
    console.error("Database connection failed:", err);
    process.exit(1); // Stop server if DB connection fails
});

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

//Routes
app.use('/api/users',userRoutes);
app.use('/api/stories',storiesRoutes);

// Health check route
app.get("/", (req, res) => {
    res.status(200).json({ message: "API is running successfully!" });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("Server Error:", err.message);
    res.status(500).json({ error: true, message: "Internal Server Error" });
});

// // PORT Configuration
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//     console.log(`🚀 Server running `);
// });

module.exports = app;