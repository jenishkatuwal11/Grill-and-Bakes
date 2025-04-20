const Items = require("../models/Items");
const Order = require("../models/Order");

//  Create a new order (Cash on Delivery)
const createOrder = async (req, res) => {
  try {
    const { items, totalPrice, contact, address } = req.body;
    const userId = req.user.id; // Get user ID from token

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    // Extract item IDs
    const itemIds = items.map((item) => item.itemId);

    // Fetch all items in a single query
    const existingItems = await Items.find({ _id: { $in: itemIds } });

    if (existingItems.length !== itemIds.length) {
      return res.status(404).json({ message: "One or more items not found" });
    }

    // Enrich items with full product details
    const enrichedItems = items.map((item) => {
      const product = existingItems.find((prod) =>
        prod._id.equals(item.itemId)
      );
      return {
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        //price: product.price,
        price: item.price, // this includes the customization cost
        customizations: item.customizations || {}, //store customizations
      };
    });

    // Create the order with enriched items
    const newOrder = new Order({
      user: userId,
      items: enrichedItems,
      totalPrice,
      contact,
      address,
      paymentMethod: "Cash on Delivery",
      paymentStatus: "Pending",
    });

    await newOrder.save();
    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error, please try again" });
  }
};

//  Get all orders for Admin
const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { startDate, endDate } = req.query;

    const query = {};

    // If startDate and endDate are provided, apply date filter
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Adjust end to include the whole day till 23:59:59
      end.setHours(23, 59, 59, 999);

      query.createdAt = { $gte: start, $lte: end };
    }

    const totalOrders = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username email")
      .populate("items.product", "name price");

    if (!orders || orders.length === 0) {
      return res.status(200).json({
        totalOrders: 0,
        currentPage: page,
        totalPages: 1,
        orders: [],
      });
    }

    res.status(200).json({
      totalOrders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error, please try again" });
  }
};

//  Get a single order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "username email")
      .populate("items.product", "name price");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Server error, please try again" });
  }
};

//  Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = [
      "Out for Delivery",
      "Preparing",
      "Delivered",
      "Canceled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;

    //  Automatically mark as Paid if status is Delivered (for both COD and Khalti)
    if (
      (order.paymentMethod === "Cash on Delivery" ||
        order.paymentMethod === "Khalti") &&
      status === "Delivered"
    ) {
      order.paymentStatus = "Paid";
    }

    await order.save();
    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server error, please try again" });
  }
};

// Fetch Orders for Logged-in User
const getUserOrders = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.length !== 24) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const orders = await Order.find({ user: id })
      .populate("items.product", "name price image")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error(" Error fetching user orders:", error);
    res.status(500).json({ message: "Server error, please try again" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getUserOrders,
};
