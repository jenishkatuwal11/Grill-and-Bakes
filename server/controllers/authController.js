const User = require("../models/Users");
const { hashPassword, matchPassword } = require("../utils/passwordUtils");
const { generateToken } = require("../middlewares/jwtMiddlewares");

// Register User
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists (by email or username)
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({
        message:
          userExists.email === email
            ? "Email already exists"
            : "Username already exists",
      });
    }

    // Hash the password before saving
    const hashedPassword = await hashPassword(password);

    // Create the new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "user", // Default role for regular users
    });

    // Generate token
    const token = generateToken({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    // Respond with the new user's details and a token
    res.status(201).json({
      message: "Registration successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admins from logging in via this endpoint
    if (user.role === "admin") {
      return res
        .status(403)
        .json({ message: "Admins are not allowed to log in here." });
    }

    // Verify the password
    const isMatch = await matchPassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    // Respond with user details and a token
    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Login Admin
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the admin exists in the database
    const admin = await User.findOne({ username, role: "admin" });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Verify the password
    const isMatch = await matchPassword(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken({
      id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    });

    // Respond with admin details and a token
    res.status(200).json({
      message: "Admin login successful",
      user: {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
      token,
    });
  } catch (error) {
    console.error("Error in loginAdmin:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

module.exports = { registerUser, loginUser, loginAdmin };
