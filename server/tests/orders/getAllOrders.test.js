// tests/orders/getAllOrders.test.js
const { getAllOrders } = require("../../controllers/orderController");
const Order = require("../../models/Order");

jest.mock("../../models/Order");

describe("Order Controller - getAllOrders", () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should return paginated orders", async () => {
    const mockOrders = [
      {
        _id: "order123",
        user: { username: "jenish", email: "jenish@example.com" },
        items: [{ product: { name: "Burger", price: 120 } }],
        createdAt: new Date(),
      },
    ];

    Order.countDocuments.mockResolvedValue(1);

    Order.find.mockReturnValue({
      sort: () => ({
        skip: () => ({
          limit: () => ({
            populate: () => ({
              populate: () => Promise.resolve(mockOrders),
            }),
          }),
        }),
      }),
    });

    await getAllOrders(req, res);

    expect(Order.countDocuments).toHaveBeenCalledWith({});
    expect(Order.find).toHaveBeenCalledWith({});
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        totalOrders: 1,
        currentPage: 1,
        totalPages: 1,
        orders: expect.any(Array),
      })
    );
  });

  it("should return filtered orders by date", async () => {
    req.query.startDate = "2024-04-01";
    req.query.endDate = "2024-04-30";

    Order.countDocuments.mockResolvedValue(0);

    Order.find.mockReturnValue({
      sort: () => ({
        skip: () => ({
          limit: () => ({
            populate: () => ({
              populate: () => Promise.resolve([]),
            }),
          }),
        }),
      }),
    });

    await getAllOrders(req, res);

    expect(Order.countDocuments).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        totalOrders: 0,
        currentPage: 1,
        totalPages: 1,
        orders: [],
      })
    );
  });

  it("should handle server error", async () => {
    Order.countDocuments.mockRejectedValue(new Error("DB error"));

    await getAllOrders(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error, please try again",
    });
  });
});
