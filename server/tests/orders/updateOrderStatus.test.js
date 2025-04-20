const { updateOrderStatus } = require("../../controllers/orderController");
const Order = require("../../models/Order");

jest.mock("../../models/Order");

describe("Order Controller - updateOrderStatus", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: "order123" },
      body: { status: "Delivered" },
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

  it("should update order status and mark as Paid if Delivered", async () => {
    const mockOrder = {
      _id: "order123",
      status: "Preparing",
      paymentMethod: "Cash on Delivery",
      paymentStatus: "Pending",
      save: jest.fn().mockResolvedValue(true),
    };

    Order.findById.mockResolvedValue(mockOrder);

    await updateOrderStatus(req, res);

    expect(Order.findById).toHaveBeenCalledWith("order123");
    expect(mockOrder.status).toBe("Delivered");
    expect(mockOrder.paymentStatus).toBe("Paid");
    expect(mockOrder.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Order status updated",
      order: mockOrder,
    });
  });

  it("should return 400 for invalid status", async () => {
    req.body.status = "InvalidStatus";

    await updateOrderStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid status value",
    });
  });

  it("should return 404 if order not found", async () => {
    Order.findById.mockResolvedValue(null);

    await updateOrderStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Order not found" });
  });

  it("should handle server errors", async () => {
    Order.findById.mockRejectedValue(new Error("DB Error"));

    await updateOrderStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error, please try again",
    });
  });
});
