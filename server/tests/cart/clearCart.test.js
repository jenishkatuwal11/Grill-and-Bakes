// tests/cart/clearCart.test.js
const { clearCart } = require("../../controllers/cartController");
const Cart = require("../../models/cart");

jest.mock("../../models/cart");

describe("Cart Controller - clearCart", () => {
  let req, res;

  beforeEach(() => {
    req = { user: { id: "user123" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("should delete cart for the logged-in user", async () => {
    Cart.findOneAndDelete.mockResolvedValue({});

    await clearCart(req, res);

    expect(Cart.findOneAndDelete).toHaveBeenCalledWith({ userId: "user123" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Cart cleared" });
  });

  it("should handle errors during cart deletion", async () => {
    Cart.findOneAndDelete.mockRejectedValue(new Error("DB Error"));

    await clearCart(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error clearing cart",
      error: "DB Error",
    });
  });
});
