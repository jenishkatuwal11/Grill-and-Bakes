const Items = require("../models/Items");

// Fetch All Items

const getItems = async (req, res) => {
  try {
    const items = await Items.find();

    res.status(200).json({
      items,
      message: "Fetched all items",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching items",
      error: error.message,
    });
  }
};

//  Add Items By Admin Only
const addItems = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    // Check if item already exists
    const existingItem = await Items.findOne({ name });
    if (existingItem) {
      return res.status(400).json({ message: "Item already exists!" });
    }

    const newItem = new Items({
      name,
      description,
      price,
      category,
      image, //  Store image filename
    });

    await newItem.save();
    res.status(201).json({
      status: "Success",
      message: "Item has been added successfully",
      newItem,
    });
  } catch (error) {
    res.status(500).json({
      status: "Fail",
      message: "Error while adding item",
      error: error.message,
    });
  }
};

// Updating Items By Admin Only
const updateItems = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const item = await Items.findByIdAndUpdate(id, updateData, { new: true });

    if (!item) {
      return res.status(404).json({
        status: "Failed",
        message: "Item not found",
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Item updated successfully",
      item,
    });
  } catch (error) {
    res.status(500).json({
      status: "Server Error",
      message: "Error while updating item",
      error: error.message,
    });
  }
};

// Deleting Items By Admin
const deleteItems = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Items.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({
        status: "Failed",
        message: "Item not found",
      });
    }

    res.status(200).json({
      status: "Successful",
      message: "Item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "Server Error",
      message: "Error in deleting item",
      error: error.message,
    });
  }
};

//  Get a single item by ID
const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Items.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getItems, addItems, updateItems, deleteItems, getItemById };
