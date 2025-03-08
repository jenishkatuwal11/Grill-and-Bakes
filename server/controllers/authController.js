const User = require("../models/Users");
const { hashPassword, matchPassword } = require("../utils/passwordUtils");

// ✅ Register User
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

    // ✅ Store user info in session
    req.session.user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    req.session.admin = null; // Remove admin session if exists

    res.status(201).json({
      message: "Registration successful",
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// ✅ Login User
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

    // ✅ Store user in session
    req.session.user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    req.session.admin = null; // Clear admin session if exists

    res.status(200).json({
      message: "Login successful",
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// ✅ Login Admin
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await User.findOne({ username, role: "admin" });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await matchPassword(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Clear any previous user session before storing admin session
    req.session.user = undefined;

    // ✅ Store admin info in session
    req.session.admin = {
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      role: "admin",
    };

    res.status(200).json({
      message: "Admin login successful",
      user: req.session.admin, // ✅ Now correctly returning admin data
    });
  } catch (error) {
    console.error("Error in loginAdmin:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const getAuthenticatedUser = (req, res) => {
  if (req.session.user) {
    return res.status(200).json({ user: req.session.user });
  } else if (req.session.admin) {
    return res
      .status(403)
      .json({ message: "Admins cannot access user pages." });
  } else {
    return res.status(401).json({ message: "Not authenticated" });
  }
};

// ✅ Logout User/Admin
const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
};

module.exports = {
  registerUser,
  loginUser,
  loginAdmin,
  logoutUser,
  getAuthenticatedUser,
};
