const { toggleUserStatus } = require("../../controllers/userController");
const User = require("../../models/Users");

jest.mock("../../models/Users");

describe("User Controller - toggleUserStatus", () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: "user123" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should toggle user active status and return 200", async () => {
    const mockUser = { active: true, save: jest.fn() };
    User.findById.mockResolvedValue(mockUser);

    await toggleUserStatus(req, res);

    expect(User.findById).toHaveBeenCalledWith("user123");
    expect(mockUser.active).toBe(false); // toggled
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "User status updated",
      user: mockUser,
    });
  });

  it("should return 404 if user not found", async () => {
    User.findById.mockResolvedValue(null);

    await toggleUserStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should return 500 on server error", async () => {
    User.findById.mockRejectedValue(new Error("DB Error"));

    await toggleUserStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
  });
});
