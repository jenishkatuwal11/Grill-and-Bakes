require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/dbConnectin");
const adminRoutes = require("./routes/adminRoute"); // Import admin routes
const itemRoutes = require("./routes/itemRoutes"); // impoering items routes
const cartRoutes = require("./routes/cartRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
// app.use(cors());
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Allow requests from the client
app.use(bodyParser.json());

app.use("/uploads", express.static("uploads"));
//app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/users", userRoutes);

// Connect Database
connectDB();

// Start Server
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
