const { getItemById } = require("../../controllers/itemController");
const Items = require("../../models/Items");

jest.mock("../../models/Items");

describe("Item Controller - getItemById", () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: "item123" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("should return item if found", async () => {
    const item = {
      _id: "item123",
      name: "Pasta",
      description: "Delicious pasta",
      price: 15,
      category: "Main Course",
    };

    Items.findById.mockResolvedValue(item);

    await getItemById(req, res);

    expect(Items.findById).toHaveBeenCalledWith("item123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(item);
  });

  it("should return 404 if item not found", async () => {
    Items.findById.mockResolvedValue(null);

    await getItemById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
  });

  it("should return 500 on server error", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // ✅ suppress console.error

    Items.findById.mockRejectedValue(new Error("DB Error"));

    await getItemById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error",
      error: "DB Error",
    });
  });
});
