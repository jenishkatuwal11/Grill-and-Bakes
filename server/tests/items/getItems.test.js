// tests/items/getItems.test.js
const { getItems } = require("../../controllers/itemController");
const Items = require("../../models/Items");

jest.mock("../../models/Items");

describe("Item Controller - getItems", () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it("should fetch and return all items", async () => {
    const mockItems = [
      { name: "Burger", price: 200 },
      { name: "Mocha", price: 150 },
    ];

    Items.find.mockResolvedValue(mockItems);

    await getItems(req, res);

    expect(Items.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      items: mockItems,
      message: "Fetched all items",
    });
  });

  it("should return 500 on server error", async () => {
    Items.find.mockRejectedValue(new Error("DB Error"));

    await getItems(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error fetching items",
      error: "DB Error",
    });
  });
});
