const { verifyKhalti } = require("../../controllers/paymentController");
const axios = require("axios");
const Items = require("../../models/Items");
const Order = require("../../models/Order");

// Mocks
jest.mock("axios");
jest.mock("../../models/Items");
jest.mock("../../models/Order");

describe("Payment Controller - verifyKhalti", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        pidx: "test-pidx-123",
        userId: "user123",
        orderData: {
          items: [
            {
              itemId: "item123",
              quantity: 2,
              customizations: { sugar: "less" },
            },
          ],
          totalPrice: 200,
          contact: "9876543210",
          address: "Pokhara",
        },
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Items.find.mockResolvedValue([
      {
        _id: {
          equals: (id) => id === "item123",
          toString: () => "item123",
        },
        name: "Latte",
        price: 100,
      },
    ]);

    Order.mockImplementation((orderData) => ({
      ...orderData,
      save: jest.fn().mockResolvedValue(orderData),
    }));

    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should create order if payment is completed", async () => {
    axios.post.mockResolvedValue({ data: { status: "Completed" } });

    await verifyKhalti(req, res);

    expect(axios.post).toHaveBeenCalledWith(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      { pidx: "test-pidx-123" },
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: expect.stringContaining("key "),
        }),
      })
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        order: expect.objectContaining({
          user: "user123",
          contact: "9876543210",
          address: "Pokhara",
          totalPrice: 200,
        }),
      })
    );
  });

  it("should return 400 if payment is not completed", async () => {
    axios.post.mockResolvedValue({ data: { status: "Pending" } });

    await verifyKhalti(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Payment not completed",
      status: "Pending",
    });
  });

  it("should handle error during verification", async () => {
    axios.post.mockRejectedValue({
      response: { data: { error: "Invalid Pidx" } },
    });

    await verifyKhalti(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: { error: "Invalid Pidx" },
    });
  });
});
