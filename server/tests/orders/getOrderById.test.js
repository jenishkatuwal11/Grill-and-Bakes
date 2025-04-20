//tests/orders/getOrderById.test.js
const { getOrderById } = require("../../controllers/orderController");
const Order = require("../../models/Order");

jest.mock("../../models/Order");

describe("Order Controller - getOrderById", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        id: "order123",
      },
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

  it("should return 200 with order data if found", async () => {
    const mockOrder = {
      _id: "order123",
      user: { username: "jenish", email: "jenish@example.com" },
      items: [{ product: { name: "Mocha", price: 100 } }],
    };

    const populateMock = jest.fn().mockReturnThis();
    Order.findById.mockReturnValue({
      populate: populateMock.mockReturnValueOnce({
        populate: jest.fn().mockResolvedValue(mockOrder),
      }),
    });

    await getOrderById(req, res);

    expect(Order.findById).toHaveBeenCalledWith("order123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockOrder);
  });

  it("should return 404 if order not found", async () => {
    const populateMock = jest.fn().mockReturnThis();
    Order.findById.mockReturnValue({
      populate: populateMock.mockReturnValueOnce({
        populate: jest.fn().mockResolvedValue(null),
      }),
    });

    await getOrderById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Order not found" });
  });

  it("should handle server error", async () => {
    Order.findById.mockImplementation(() => {
      throw new Error("DB Error");
    });

    await getOrderById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error, please try again",
    });
  });
});
