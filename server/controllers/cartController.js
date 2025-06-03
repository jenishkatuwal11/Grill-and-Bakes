const Cart = require("../models/cart");

// Fetch Cart for Logged-in User
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

// Add Item to Cart
const addItemToCart = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID found!" });
    }

    const {
      itemId,
      name,
      price,
      img,
      quantity = 1,
      customizations = {}, // Destructure this
    } = req.body;

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({ userId: req.user.id, cartItems: [], totalQuantity: 0 });
    }

    const existingItem = cart.cartItems.find(
      (item) =>
        item.itemId.toString() === itemId &&
        JSON.stringify(item.customizations) === JSON.stringify(customizations)
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.cartItems.push({
        itemId,
        name,
        price,
        quantity,
        img,
        customizations, //  Save customizations
      });
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
      .json({ message: "Error adding item", error: error.message });
  }
};

// Increase Quantity
const increaseQuantity = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const existingItem = cart.cartItems.find(
      (item) => item.itemId.toString() === req.params.id
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

// Decrease Quantity
const decreaseQuantity = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const existingItem = cart.cartItems.find(
      (item) => item.itemId.toString() === req.params.id
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

// Remove Item from Cart
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

// Clear Cart
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
