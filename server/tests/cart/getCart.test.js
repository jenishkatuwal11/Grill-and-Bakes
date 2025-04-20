// tests/cart/getCart.test.js
const { getCart } = require("../../controllers/cartController");
const Cart = require("../../models/cart");

jest.mock("../../models/cart");

describe("Cart Controller - getCart", () => {
  let req, res;

  beforeEach(() => {
    req = { user: { id: "user123" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("should return user's cart when found", async () => {
    const fakeCart = {
      cartItems: [
        {
          itemId: "item1",
          name: "Burger",
          quantity: 2,
          price: 5,
        },
      ],
      totalQuantity: 2,
    };

    Cart.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue(fakeCart),
    });

    await getCart(req, res);

    expect(Cart.findOne).toHaveBeenCalledWith({ userId: "user123" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeCart);
  });

  it("should return empty cart if not found", async () => {
    Cart.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    await getCart(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ cartItems: [], totalQuantity: 0 });
  });

  it("should return 500 on error", async () => {
    Cart.findOne.mockImplementation(() => ({
      populate: jest.fn().mockRejectedValue(new Error("DB Error")),
    }));

    await getCart(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error fetching cart",
      error: "DB Error",
    });
  });
});
