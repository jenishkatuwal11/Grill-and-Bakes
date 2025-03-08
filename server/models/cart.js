const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  cartItems: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Items",
        required: true,
      },
      name: String,
      price: Number,
      quantity: Number,
      img: String,
    },
  ],
  totalQuantity: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Cart", cartSchema);
