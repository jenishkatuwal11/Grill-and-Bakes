const mongoose = require("mongoose");
const { getAdminStats } = require("../../controllers/adminControllers");
const Order = require("../../models/Order");
const User = require("../../models/Users");

// Mock models
jest.mock("../../models/Order");
jest.mock("../../models/Users");

describe("Admin Controller - getAdminStats", () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Silence error logs during tests
    jest.spyOn(console, "error").mockImplementation(() => {});

    jest.clearAllMocks();
  });

  it("should return admin statistics correctly", async () => {
    // Mock document counts
    Order.countDocuments
      .mockResolvedValueOnce(10) // totalOrders
      .mockResolvedValueOnce(3) // pendingOrders
      .mockResolvedValueOnce(2); // canceledOrders

    // Mock total revenue
    Order.aggregate.mockResolvedValueOnce([{ total: 500 }]);

    // Mock active users
    User.countDocuments.mockResolvedValueOnce(7);

    // Mock order trend
    Order.aggregate.mockResolvedValueOnce([
      { _id: "2025-04-10", count: 2 },
      { _id: "2025-04-11", count: 3 },
    ]);

    // Mock category revenue
    Order.find.mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue([
        {
          items: [
            {
              product: { category: "Beverage" },
              quantity: 2,
              price: 100,
            },
            {
              product: { category: "Food" },
              quantity: 1,
              price: 200,
            },
          ],
        },
      ]),
    }));

    await getAdminStats(req, res);

    expect(Order.countDocuments).toHaveBeenCalledTimes(3);
    expect(Order.aggregate).toHaveBeenCalledTimes(2);
    expect(Order.find).toHaveBeenCalledTimes(1);
    expect(User.countDocuments).toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      stats: {
        totalOrders: 10,
        pendingOrders: 3,
        canceledOrders: 2,
        totalRevenue: 500,
        activeUsers: 7,
      },
      orderTrend: [
        { _id: "2025-04-10", count: 2 },
        { _id: "2025-04-11", count: 3 },
      ],
      categoryRevenue: {
        Beverage: 200,
        Food: 200,
      },
    });
  });

  it("should handle errors gracefully", async () => {
    Order.countDocuments.mockRejectedValue(new Error("DB Error"));

    await getAdminStats(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Failed to fetch admin stats",
    });
  });
});
