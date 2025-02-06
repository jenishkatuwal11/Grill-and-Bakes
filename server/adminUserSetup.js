require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/Users");
const { hashPassword } = require("./utils/passwordUtils");

const AdminUserSetup = async () => {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to the database");

    // Check if admin already exists
    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      console.log("Admin user already exists");
      return;
    }

    // Create admin user
    const hashedPassword = await hashPassword("Bake&Grills123");
    const adminUser = new User({
      username: "Bake&Grills",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin", // Assign the admin role
    });

    await adminUser.save();
    console.log("Admin user created successfully");
  } catch (error) {
    console.error("Error seeding admin user:", error);
  } finally {
    mongoose.connection.close();
  }
};

AdminUserSetup();
