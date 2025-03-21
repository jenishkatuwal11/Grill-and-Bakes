const User = require("../models/Users");
const { hashPassword, matchPassword } = require("../utils/passwordUtils");
const { generateToken } = require("../middlewares/jwtMiddlewares");

//  Register User with JWT
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({
        message:
          userExists.email === email
            ? "Email already exists"
            : "Username already exists",
      });
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    // Generate JWT Token
    const token = generateToken({ id: user._id, role: user.role });

    res.status(201).json({
      message: "Registration successful",
      token, // Return JWT Token
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(" Error in registerUser:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

//  Login User with JWT
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admins from logging in here
    if (user.role === "admin") {
      return res
        .status(403)
        .json({ message: "Admins are not allowed to log in here." });
    }

    const isMatch = await matchPassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = generateToken({ id: user._id, role: user.role });

    res.status(200).json({
      message: "Login successful",
      token, //  Return JWT Token
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(" Error in loginUser:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Login Admin with JWT
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const admin = await User.findOne({ username, role: "admin" });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await matchPassword(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate Admin JWT Token
    const adminToken = generateToken({ id: admin._id, role: "admin" });

    res.status(200).json({
      message: "Admin login successful",
      adminToken, // Return JWT Token
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: "admin",
      },
    });
  } catch (error) {
    console.error(" Error in loginAdmin:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Logout User (Just clears JWT token from frontend)
const logoutUser = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {
  registerUser,
  loginUser,
  loginAdmin,
  logoutUser,
};
