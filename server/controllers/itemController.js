const Items = require("../models/Items");

// Fetch All Items
// Fetch All Items with Pagination
const getItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // default to page 1
    const limit = parseInt(req.query.limit) || 6; // default to 6 items per page
    const skip = (page - 1) * limit;

    const totalItems = await Items.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);

    const items = await Items.find().skip(skip).limit(limit);

    res.status(200).json({
      items,
      totalItems,
      totalPages,
      currentPage: page,
      message: "Successfully fetched paginated items",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching paginated items",
      error: error.message,
    });
  }
};

//  Add Items (Now Supports Image Upload)
const addItems = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null; // ✅ Save image path

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

module.exports = { getItems, addItems, updateItems, deleteItems };
