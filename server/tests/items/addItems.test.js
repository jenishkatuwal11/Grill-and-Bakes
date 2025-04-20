// tests/items/addItems.test.js
const { addItems } = require("../../controllers/itemController");
const Items = require("../../models/Items");

jest.mock("../../models/Items");

describe("Item Controller - addItems", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        name: "Burger",
        description: "Delicious grilled burger",
        price: 250,
        category: "Fast Food",
      },
      file: {
        filename: "burger.jpg",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it("should add a new item successfully", async () => {
    Items.findOne.mockResolvedValue(null); // Item doesn't exist
    Items.prototype.save = jest.fn().mockResolvedValue(); // Mock instance save

    await addItems(req, res);

    expect(Items.findOne).toHaveBeenCalledWith({ name: "Burger" });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "Success",
        message: "Item has been added successfully",
        newItem: expect.any(Object),
      })
    );
  });

  it("should return 400 if item already exists", async () => {
    Items.findOne.mockResolvedValue({ name: "Burger" });

    await addItems(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Item already exists!" });
  });

  it("should handle server errors", async () => {
    Items.findOne.mockRejectedValue(new Error("DB error"));

    await addItems(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "Fail",
      message: "Error while adding item",
      error: "DB error",
    });
  });
});
