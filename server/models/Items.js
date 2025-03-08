const mongoose = require("mongoose");

const ItemsSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    require: true,
  },
  type: {
    type: String,
    enum: ["Meal", "Drink"],
    require: true,
  },
  category: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Items", ItemsSchema);
