// tests/orders/getUserOrders.test.js
const { getUserOrders } = require("../../controllers/orderController");
const Order = require("../../models/Order");

jest.mock("../../models/Order");

describe("Order Controller - getUserOrders", () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: "64f193e7b814c7e1b3c8b9a1" } }; // valid 24-char ObjectId
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

  it("should return user orders", async () => {
    const mockOrders = [{ _id: "order1", user: req.params.id, items: [] }];

    const sortMock = jest.fn().mockResolvedValue(mockOrders);
    const populateMock = jest.fn(() => ({ sort: sortMock }));

    Order.find.mockImplementation(() => ({
      populate: populateMock,
    }));

    await getUserOrders(req, res);

    expect(Order.find).toHaveBeenCalledWith({ user: req.params.id });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockOrders);
  });

  it("should return 400 for invalid user ID", async () => {
    req.params.id = "bad_id"; // shorter than 24 chars

    await getUserOrders(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid user ID",
    });
  });

  it("should handle server errors", async () => {
    req.params.id = "64f193e7b814c7e1b3c8b9a1"; // valid again
    Order.find.mockImplementation(() => ({
      populate: () => ({
        sort: jest.fn().mockRejectedValue(new Error("DB Error")),
      }),
    }));

    await getUserOrders(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error, please try again",
    });
  });
});
