require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/dbConnectin");

const app = express();

// Middleware
// app.use(cors());
app.use(cors({ origin: "http://localhost:5173" })); // Allow requests from the client
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);

// Connect Database
connectDB();

// Start Server
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
