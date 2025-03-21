const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Items",
        },
        name: String,
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    paymentMethod: { type: String, default: "Cash on Delivery" },
    status: {
      type: String,
      enum: ["Out for Delivery", "Preparing", "Delivered", "Canceled"],
      default: "Preparing",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
