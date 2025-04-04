const express = require("express");
const { verifyAdminToken } = require("../middlewares/jwtMiddlewares");
const { getAdminStats } = require("../controllers/adminControllers");

const router = express.Router();

// protected admin route
router.get("/dashboard", verifyAdminToken, (req, res) => {
  res.status(200).json({
    message: "Welcome to the Admin Dashboard",
    user: req.user,
  });
});

router.get("/stats", verifyAdminToken, getAdminStats);

// Add more admin-specific routes as needed
module.exports = router;
