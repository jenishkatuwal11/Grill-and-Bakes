const express = require("express");
const {
  verifyToken,
  verifyAdminToken,
} = require("../middlewares/jwtMiddlewares");
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getUserOrders,
} = require("../controllers/orderController");

const router = express.Router();

//  Create a new order (User)
router.post("/create", verifyToken, createOrder);

//  Get all orders (Admin only)
router.get("/", verifyAdminToken, getAllOrders);

//  Get order by ID (Admin & User)
router.get("/:id", verifyToken, getOrderById);

//  Update order status (Admin only)
router.put("/:id", verifyAdminToken, updateOrderStatus);

// Get Orders for a Specific User
router.get("/user/:id", verifyToken, getUserOrders);

module.exports = router;
