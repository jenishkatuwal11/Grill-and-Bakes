const Order = require("../models/Order");
const User = require("../models/Users");
const Items = require("../models/Items");

const getAdminStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({
      paymentStatus: "Pending",
    });

    const canceledOrders = await Order.countDocuments({
      status: "Canceled",
    });

    //  Include Paid orders and Delivered COD orders
    const revenueFilter = {
      $or: [
        { paymentMethod: "Cash on Delivery", status: "Delivered" },
        { paymentMethod: { $ne: "Cash on Delivery" }, paymentStatus: "Paid" },
      ],
    };

    const totalRevenueResult = await Order.aggregate([
      { $match: revenueFilter },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;
    const activeUsers = await User.countDocuments({ role: "user" });

    //  Order trend for the past 7 days
    const past7Days = new Date();
    past7Days.setDate(past7Days.getDate() - 6);

    const orderTrend = await Order.aggregate([
      { $match: { createdAt: { $gte: past7Days } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }, // e.g., "2025-04-02"
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    //  Revenue by Category (use same filter as total revenue)
    const orders = await Order.find(revenueFilter).populate("items.product");

    const categoryRevenue = {};

    for (const order of orders) {
      for (const item of order.items) {
        const category = item.product?.category || "Uncategorized";
        const itemRevenue = item.quantity * item.price;
        categoryRevenue[category] =
          (categoryRevenue[category] || 0) + itemRevenue;
      }
    }

    res.status(200).json({
      stats: {
        totalOrders,
        pendingOrders,
        canceledOrders,
        totalRevenue,
        activeUsers,
      },
      orderTrend,
      categoryRevenue,
    });
  } catch (error) {
    console.error("Admin Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};

// Admin Reports Controller
const getReports = async (req, res) => {
  try {
    // Filter: Only consider completed (Delivered) or Paid orders
    const revenueFilter = {
      $or: [
        { paymentMethod: "Cash on Delivery", status: "Delivered" },
        { paymentMethod: { $ne: "Cash on Delivery" }, paymentStatus: "Paid" },
      ],
    };

    // Total Revenue
    const totalRevenueResult = await Order.aggregate([
      { $match: revenueFilter },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    // Total Orders (completed or paid)
    const totalOrders = await Order.countDocuments(revenueFilter);

    // Best Selling Items
    const orders = await Order.find(revenueFilter).populate("items.product");
    const itemSalesMap = {};

    for (const order of orders) {
      for (const item of order.items) {
        const name = item.product?.name || "Unknown Item";
        itemSalesMap[name] = (itemSalesMap[name] || 0) + item.quantity;
      }
    }

    const bestSellers = Object.entries(itemSalesMap)
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    // Order Status Breakdown
    const statusBreakdown = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const breakdownMap = {
      Pending: 0,
      Preparing: 0,
      Delivered: 0,
      Canceled: 0,
    };
    statusBreakdown.forEach((s) => {
      breakdownMap[s._id] = s.count;
    });

    res.status(200).json({
      totalRevenue,
      totalOrders,
      bestSellers,
      orderStatusData: breakdownMap,
    });
  } catch (err) {
    console.error("Reports Fetch Error:", err);
    res.status(500).json({ message: "Failed to generate reports" });
  }
};

module.exports = { getAdminStats, getReports };
