// tests/admin/getReports.test.js
const { getReports } = require("../../controllers/adminControllers");
const Order = require("../../models/Order");

jest.mock("../../models/Order");

describe("Admin Controller - getReports", () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it("should return revenue, orders, best sellers, and status breakdown", async () => {
    // Mocked Data
    Order.aggregate
      .mockResolvedValueOnce([{ total: 800 }]) // Total Revenue
      .mockResolvedValueOnce([
        // Status Breakdown
        { _id: "Pending", count: 2 },
        { _id: "Delivered", count: 4 },
        { _id: "Canceled", count: 1 },
      ]);

    const populatedItems = [
      {
        product: { name: "Burger" },
        quantity: 3,
      },
      {
        product: { name: "Pizza" },
        quantity: 2,
      },
    ];

    Order.countDocuments.mockResolvedValueOnce(6); // totalOrders

    // Mock populate chain
    Order.find.mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue([{ items: populatedItems }]),
    }));

    await getReports(req, res);

    expect(Order.aggregate).toHaveBeenCalledTimes(2);
    expect(Order.countDocuments).toHaveBeenCalledTimes(1);
    expect(Order.find).toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      totalRevenue: 800,
      totalOrders: 6,
      bestSellers: [
        { name: "Burger", sales: 3 },
        { name: "Pizza", sales: 2 },
      ],
      orderStatusData: {
        Pending: 2,
        Preparing: 0,
        Delivered: 4,
        Canceled: 1,
      },
    });
  });

  it("should handle server errors", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    Order.aggregate.mockRejectedValue(new Error("DB Error"));

    await getReports(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Failed to generate reports",
    });

    consoleSpy.mockRestore();
  });
});
