const express = require("express");
const { verifyAdminToken } = require("../middlewares/jwtMiddlewares");
const {
  getAdminStats,
  getReports,
} = require("../controllers/adminControllers");

const router = express.Router();

// protected admin route
router.get("/dashboard", verifyAdminToken, (req, res) => {
  res.status(200).json({
    message: "Welcome to the Admin Dashboard",
    user: req.user,
  });
});

router.get("/stats", verifyAdminToken, getAdminStats);

router.get("/reports", verifyAdminToken, getReports); //

module.exports = router;
