const { increaseQuantity } = require("../../controllers/cartController");
const Cart = require("../../models/cart");

jest.mock("../../models/cart");

describe("Cart Controller - increaseQuantity", () => {
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

  it("should increase item quantity and return updated cart", async () => {
    const mockCart = {
      cartItems: [
        { itemId: "item123", quantity: 1 },
        { itemId: "item456", quantity: 2 },
      ],
      totalQuantity: 3,
      save: jest.fn().mockResolvedValue(),
    };

    Cart.findOne.mockResolvedValue(mockCart);

    await increaseQuantity(req, res);

    expect(mockCart.cartItems[0].quantity).toBe(2);
    expect(mockCart.totalQuantity).toBe(4);
    expect(mockCart.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockCart);
  });

  it("should return 404 if cart not found", async () => {
    Cart.findOne.mockResolvedValue(null);

    await increaseQuantity(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Cart not found" });
  });

  it("should return 404 if item not found in cart", async () => {
    const mockCart = {
      cartItems: [{ itemId: "item999", quantity: 2 }],
      totalQuantity: 2,
      save: jest.fn(),
    };

    Cart.findOne.mockResolvedValue(mockCart);

    await increaseQuantity(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Item not found in cart",
    });
  });

  it("should handle server errors", async () => {
    Cart.findOne.mockRejectedValue(new Error("DB error"));

    await increaseQuantity(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error increasing quantity",
      error: "DB error",
    });
  });
});
