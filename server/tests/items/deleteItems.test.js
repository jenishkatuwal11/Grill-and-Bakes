const { deleteItems } = require("../../controllers/itemController");
const Items = require("../../models/Items");

jest.mock("../../models/Items");

describe("Item Controller - deleteItems", () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: "item123" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it("should delete an item successfully", async () => {
    Items.findByIdAndDelete.mockResolvedValue({
      _id: "item123",
      name: "Burger",
    });

    await deleteItems(req, res);

    expect(Items.findByIdAndDelete).toHaveBeenCalledWith("item123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "Successful",
      message: "Item deleted successfully",
    });
  });

  it("should return 404 if item is not found", async () => {
    Items.findByIdAndDelete.mockResolvedValue(null);

    await deleteItems(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: "Failed",
      message: "Item not found",
    });
  });

  it("should return 500 on server error", async () => {
    Items.findByIdAndDelete.mockRejectedValue(new Error("DB error"));

    await deleteItems(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "Server Error",
      message: "Error in deleting item",
      error: "DB error",
    });
  });
});
