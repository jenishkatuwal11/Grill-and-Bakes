const express = require("express");
const {
  registerUser,
  loginUser,
  loginAdmin,
  getAuthenticatedUser,
  logoutUser,
} = require("../controllers/authController");

const router = express.Router();

// ✅ Fetch authenticated user session (ONLY for users)
router.get("/user", getAuthenticatedUser);

// ✅ User Registration
router.post("/register", registerUser);

// ✅ User Login (Stores session)
router.post("/login", loginUser);

// ✅ Admin Login (Stores session)
router.post("/admin/login", loginAdmin);

// ✅ Logout User/Admin (Destroy Session)
router.post("/logout", logoutUser);

module.exports = router;
