// tests/cart/removeItemFromCart.test.js
const { removeItemFromCart } = require("../../controllers/cartController");
const Cart = require("../../models/cart");

jest.mock("../../models/cart");

describe("Cart Controller - removeItemFromCart", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: "user123" },
      params: { id: "item456" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("should remove item from cart and recalculate total quantity", async () => {
    const mockCart = {
      cartItems: [
        { itemId: "item456", quantity: 2 },
        { itemId: "item789", quantity: 1 },
      ],
      save: jest.fn().mockResolvedValue(),
    };

    mockCart.cartItems.reduce = jest.fn(() => 1);
    Cart.findOne.mockResolvedValue(mockCart);

    await removeItemFromCart(req, res);

    expect(Cart.findOne).toHaveBeenCalledWith({ userId: "user123" });
    expect(mockCart.cartItems).toEqual([{ itemId: "item789", quantity: 1 }]);
    expect(mockCart.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockCart);
  });

  it("should return 404 if cart not found", async () => {
    Cart.findOne.mockResolvedValue(null);

    await removeItemFromCart(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Cart not found" });
  });

  it("should handle server errors", async () => {
    Cart.findOne.mockRejectedValue(new Error("DB Error"));

    await removeItemFromCart(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error removing item",
      error: "DB Error",
    });
  });
});
