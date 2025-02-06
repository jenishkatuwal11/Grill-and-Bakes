const express = require("express");
const { verifyAdminToken } = require("../middlewares/jwtMiddlewares");

const router = express.Router();

// Example protected admin route
router.get("/dashboard", verifyAdminToken, (req, res) => {
  res.status(200).json({
    message: "Welcome to the Admin Dashboard",
    user: req.user,
  });
});

// Add more admin-specific routes as needed
module.exports = router;
