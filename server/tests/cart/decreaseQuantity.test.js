// tests/cart/decreaseQuantity.test.js
const { decreaseQuantity } = require("../../controllers/cartController");
const Cart = require("../../models/cart");

jest.mock("../../models/cart");

describe("Cart Controller - decreaseQuantity", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: "user123" },
      params: { id: "item123" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it("should decrease item quantity if greater than 1", async () => {
    const mockCart = {
      cartItems: [
        { itemId: "item123", quantity: 3 },
        { itemId: "item456", quantity: 2 },
      ],
      save: jest.fn(),
    };

    mockCart.cartItems.reduce = () => 4;

    Cart.findOne.mockResolvedValue(mockCart);

    await decreaseQuantity(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(mockCart.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockCart);
  });

  it("should remove item if quantity is 1", async () => {
    const mockCart = {
      cartItems: [
        { itemId: "item123", quantity: 1 },
        { itemId: "item456", quantity: 2 },
      ],
      save: jest.fn(),
    };

    mockCart.cartItems.reduce = () => 2;

    Cart.findOne.mockResolvedValue(mockCart);

    await decreaseQuantity(req, res);

    expect(mockCart.cartItems.length).toBe(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockCart);
  });

  it("should return 404 if item not found", async () => {
    const mockCart = {
      cartItems: [{ itemId: "item456", quantity: 2 }],
    };

    Cart.findOne.mockResolvedValue(mockCart);

    await decreaseQuantity(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Item not found in cart",
    });
  });

  it("should return 404 if cart not found", async () => {
    Cart.findOne.mockResolvedValue(null);

    await decreaseQuantity(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Cart not found" });
  });

  it("should handle server error", async () => {
    Cart.findOne.mockRejectedValue(new Error("DB Error"));

    await decreaseQuantity(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error decreasing quantity",
      error: "DB Error",
    });
  });
});
