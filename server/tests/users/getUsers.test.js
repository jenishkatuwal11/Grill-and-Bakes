const { getUsers } = require("../../controllers/userController");
const User = require("../../models/Users");

jest.mock("../../models/Users");

describe("User Controller - getUsers", () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {
        page: "1",
        limit: "2",
      },
    };

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

  it("should return paginated users", async () => {
    const mockUsers = [
      { username: "Jenish", email: "jenish@example.com", role: "user" },
      { username: "Ashish", email: "ashish@example.com", role: "user" },
    ];

    User.countDocuments.mockResolvedValue(2);
    User.find.mockImplementation(() => ({
      skip: () => ({
        limit: () => Promise.resolve(mockUsers),
      }),
    }));

    await getUsers(req, res);

    expect(User.countDocuments).toHaveBeenCalledWith({
      role: { $ne: "admin" },
    });
    expect(User.find).toHaveBeenCalledWith(
      { role: { $ne: "admin" } },
      "username email role"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      users: mockUsers,
      currentPage: 1,
      totalPages: 1,
      totalUsers: 2,
    });
  });

  it("should handle server errors", async () => {
    User.countDocuments.mockRejectedValue(new Error("DB error"));

    await getUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
  });
});
