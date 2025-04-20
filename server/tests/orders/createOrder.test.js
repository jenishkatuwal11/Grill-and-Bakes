// tests/orders/createOrder.test.js
const { createOrder } = require("../../controllers/orderController");
const Items = require("../../models/Items");

// Mock Items
jest.mock("../../models/Items");

// Declare mock function for order save
const mockSave = jest.fn();

// Mock Order using special prefix
jest.mock("../../models/Order", () =>
  jest.fn().mockImplementation(function (orderData) {
    return {
      ...orderData,
      save: mockSave,
    };
  })
);

const Order = require("../../models/Order"); // import after mock

describe("Order Controller - createOrder", () => {
  let req, res;

  // Suppress console.error once globally for this suite
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    req = {
      user: { id: "user123" },
      body: {
        items: [
          {
            itemId: "item123",
            name: "Mocha",
            price: 100,
            quantity: 2,
            customizations: { sugar: "low" },
          },
        ],
        totalPrice: 200,
        contact: "9876543210",
        address: "Pokhara, Nepal",
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
        name: "Mocha",
      },
    ]);

    mockSave.mockResolvedValue({
      _id: "order123",
      ...req.body,
      user: req.user.id,
      items: req.body.items.map((i) => ({
        product: i.itemId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        customizations: i.customizations,
      })),
      paymentMethod: "Cash on Delivery",
      paymentStatus: "Pending",
    });

    jest.clearAllMocks();
  });

  it("should create order and return 201 with order data", async () => {
    await createOrder(req, res);

    expect(Items.find).toHaveBeenCalledWith({ _id: { $in: ["item123"] } });
    expect(mockSave).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Order placed successfully",
        order: expect.objectContaining({
          user: "user123",
          contact: "9876543210",
          address: "Pokhara, Nepal",
          totalPrice: 200,
        }),
      })
    );
  });

  it("should return 400 if items are missing", async () => {
    req.body.items = [];

    await createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "No items in order" });
  });

  it("should return 404 if items not found", async () => {
    Items.find.mockResolvedValue([]);

    await createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "One or more items not found",
    });
  });

  it("should handle server error", async () => {
    Items.find.mockRejectedValue(new Error("DB Error"));

    await createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error, please try again",
    });
  });
});
