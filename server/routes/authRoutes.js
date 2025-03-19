const express = require("express");
const {
  registerUser,
  loginUser,
  loginAdmin,
} = require("../controllers/authController");
const { verifyToken } = require("../middlewares/jwtMiddlewares");

const router = express.Router();

//  User Registration
router.post("/register", registerUser);

// User Login (Returns JWT Token)
router.post("/login", loginUser);

//  Admin Login (Returns JWT Token)
router.post("/admin/login", loginAdmin);

//  Protect routes using verifyToken
router.get("/user", verifyToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

module.exports = router;
