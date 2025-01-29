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
      const message =
        userExists.email === email
          ? "Email already exists"
          : "Username already exists";
      return res.status(400).json({ message });
    }

    // Hash the password before saving
    const hashedPassword = await hashPassword(password);

    // Create the new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Respond with the new user's details and a token
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
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

    // Verify the password
    const isMatch = await matchPassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Respond with user details and a token
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

module.exports = { registerUser, loginUser };
