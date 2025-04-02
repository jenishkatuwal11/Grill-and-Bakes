const express = require("express");
const { verifyToken } = require("../middlewares/jwtMiddlewares");
const {
  getCart,
  addItemToCart,
  increaseQuantity,
  decreaseQuantity,
  removeItemFromCart,
  clearCart,
} = require("../controllers/cartController");

const router = express.Router();

//  Fetch Cart for Logged-in User
router.get("/", verifyToken, getCart);

//  Add Item to Cart
router.post("/add", verifyToken, addItemToCart);

//  Increase Item Quantity
router.post("/increase/:id", verifyToken, increaseQuantity);

//  Decrease Item Quantity
router.post("/decrease/:id", verifyToken, decreaseQuantity);

//  Remove Item from Cart
router.delete("/remove/:id", verifyToken, removeItemFromCart);

//  Clear Cart (ONLY IF USER CLEARS IT)
router.delete("/clear", verifyToken, clearCart);

module.exports = router;
