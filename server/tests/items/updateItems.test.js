// tests/items/updateItems.test.js
const { updateItems } = require("../../controllers/itemController");
const Items = require("../../models/Items");

jest.mock("../../models/Items");

describe("Item Controller - updateItems", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: "item123" },
      body: {
        name: "Updated Item",
        price: 15,
        description: "Updated description",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it("should update an item and return success", async () => {
    const updatedItem = {
      _id: "item123",
      ...req.body,
    };

    Items.findByIdAndUpdate.mockResolvedValue(updatedItem);

    await updateItems(req, res);

    expect(Items.findByIdAndUpdate).toHaveBeenCalledWith("item123", req.body, {
      new: true,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "Success",
      message: "Item updated successfully",
      item: updatedItem,
    });
  });

  it("should return 404 if item is not found", async () => {
    Items.findByIdAndUpdate.mockResolvedValue(null);

    await updateItems(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: "Failed",
      message: "Item not found",
    });
  });

  it("should return 500 on server error", async () => {
    Items.findByIdAndUpdate.mockRejectedValue(new Error("DB error"));

    await updateItems(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "Server Error",
      message: "Error while updating item",
      error: "DB error",
    });
  });
});
