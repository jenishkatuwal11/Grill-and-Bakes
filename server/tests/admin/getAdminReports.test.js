const { getAdminReports } = require("../../controllers/adminControllers");
const Order = require("../../models/Order");

jest.mock("../../models/Order");

describe("Admin Controller - getAdminReports", () => {
  let req, res;
  const originalConsoleError = console.error;

  beforeEach(() => {
    req = {
      query: {
        range: "last7days",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  afterAll(() => {
    console.error = originalConsoleError; // Restore console.error
  });

  it("should return reports based on range with revenue, orders, best sellers, and status breakdown", async () => {
    const populatedItems = [
      {
        product: { name: "Iced Coffee" },
        quantity: 5,
      },
      {
        product: { name: "Club Sandwich" },
        quantity: 2,
      },
    ];

    Order.aggregate
      .mockResolvedValueOnce([{ total: 1000 }]) // revenue
      .mockResolvedValueOnce([
        { _id: "Pending", count: 2 },
        { _id: "Delivered", count: 3 },
        { _id: "Preparing", count: 1 },
      ]); // status breakdown

    Order.countDocuments.mockResolvedValueOnce(10); // totalOrders

    Order.find.mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue([{ items: populatedItems }]),
    }));

    await getAdminReports(req, res);

    expect(Order.aggregate).toHaveBeenCalledTimes(2);
    expect(Order.countDocuments).toHaveBeenCalledTimes(1);
    expect(Order.find).toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      totalRevenue: 1000,
      totalOrders: 10,
      bestSellers: [
        { name: "Iced Coffee", sales: 5 },
        { name: "Club Sandwich", sales: 2 },
      ],
      orderStatusData: {
        pending: 2,
        preparing: 1,
        delivered: 3,
        canceled: 0,
      },
    });
  });

  it("should handle errors gracefully", async () => {
    console.error = jest.fn(); // Suppress console.error
    Order.aggregate.mockRejectedValue(new Error("DB Error"));

    await getAdminReports(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Failed to fetch reports.",
    });
  });
});
