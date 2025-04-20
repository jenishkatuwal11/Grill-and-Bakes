const { addItemToCart } = require("../../controllers/cartController");
const Cart = require("../../models/cart");

jest.mock("../../models/cart");

describe("Cart Controller - addItemToCart", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: "user123" },
      body: {
        itemId: "item123",
        name: "Cafe Mocha",
        price: 5.5,
        quantity: 1,
        img: "mocha.png",
        customizations: { milk: "Almond" },
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it("should add a new item to the cart", async () => {
    Cart.findOne.mockResolvedValue(null);

    const savedCart = {
      userId: "user123",
      cartItems: [req.body],
      totalQuantity: 1,
      save: jest.fn(),
    };

    Cart.mockImplementation(() => savedCart);

    await addItemToCart(req, res);

    expect(Cart.findOne).toHaveBeenCalledWith({ userId: "user123" });
    expect(savedCart.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(savedCart);
  });

  it("should increase quantity if the item already exists with same customizations", async () => {
    const existingCart = {
      userId: "user123",
      cartItems: [
        {
          itemId: "item123",
          name: "Cafe Mocha",
          price: 5.5,
          quantity: 1,
          img: "mocha.png",
          customizations: { milk: "Almond" },
        },
      ],
      totalQuantity: 1,
      save: jest.fn(),
    };

    Cart.findOne.mockResolvedValue(existingCart);

    await addItemToCart(req, res);

    expect(existingCart.save).toHaveBeenCalled();
    expect(existingCart.cartItems[0].quantity).toBe(2);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(existingCart);
  });

  it("should return 401 if user ID is missing", async () => {
    req.user = null;

    await addItemToCart(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized: No user ID found!",
    });
  });

  it("should handle server errors", async () => {
    Cart.findOne.mockRejectedValue(new Error("DB error"));

    await addItemToCart(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error adding item",
      error: "DB error",
    });
  });
});
