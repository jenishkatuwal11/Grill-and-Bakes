const Cart = require("../models/cart");

// ✅ Fetch Cart for Logged-in User
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "cartItems.itemId"
    );
    res.status(200).json(cart || { cartItems: [], totalQuantity: 0 });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching cart", error: error.message });
  }
};

// ✅ Add Item to Cart
const addItemToCart = async (req, res) => {
  try {
    console.log("🔹 Incoming Add to Cart Request:", req.body);
    console.log(
      "🔹 User ID:",
      req.user ? req.user.id : "User not authenticated!"
    );

    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID found!" });
    }

    const { itemId, name, price, img, quantity = 1 } = req.body;
    var cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({ userId: req.user.id, cartItems: [], totalQuantity: 0 });
    }

    const existingItem = cart.cartItems.find(
      (item) => item.itemId.toString() === itemId
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.cartItems.push({ itemId, name, price, quantity, img });
    }

    cart.totalQuantity = cart.cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    await cart.save();
    console.log("✅ Item added successfully:", cart);
    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding item", error: error.message });
  }
};

// ✅ Increase Item Quantity
// ✅ Increase Item Quantity
const increaseQuantity = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const existingItem = cart.cartItems.find(
      (item) => item.itemId.toString() === req.params.id // 🔄 Changed from req.body.itemId
    );

    if (!existingItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    existingItem.quantity += 1;
    cart.totalQuantity = cart.cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error increasing quantity", error: error.message });
  }
};

// ✅ Decrease Item Quantity
// ✅ Decrease Item Quantity
const decreaseQuantity = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const existingItem = cart.cartItems.find(
      (item) => item.itemId.toString() === req.params.id // 🔄 Changed from req.body.itemId
    );

    if (!existingItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (existingItem.quantity > 1) {
      existingItem.quantity -= 1;
    } else {
      cart.cartItems = cart.cartItems.filter(
        (item) => item.itemId.toString() !== req.params.id
      );
    }

    cart.totalQuantity = cart.cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error decreasing quantity", error: error.message });
  }
};

// ✅ Remove Item from Cart (DO NOT DELETE ENTIRE CART)
const removeItemFromCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.cartItems = cart.cartItems.filter(
      (item) => item.itemId.toString() !== req.params.id
    );
    cart.totalQuantity = cart.cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing item", error: error.message });
  }
};

// ✅ Clear Cart (ONLY IF USER CLEARS IT)
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user.id });
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error clearing cart", error: error.message });
  }
};

module.exports = {
  getCart,
  addItemToCart,
  increaseQuantity,
  decreaseQuantity,
  removeItemFromCart,
  clearCart,
};
