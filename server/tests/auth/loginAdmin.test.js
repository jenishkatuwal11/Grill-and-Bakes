// tests/auth/loginAdmin.test.js
const { loginAdmin } = require("../../controllers/authController");
const User = require("../../models/Users");
const { matchPassword } = require("../../utils/passwordUtils");
const { generateToken } = require("../../middlewares/jwtMiddlewares");

jest.mock("../../models/Users");
jest.mock("../../utils/passwordUtils");
jest.mock("../../middlewares/jwtMiddlewares");

describe("Auth Controller - loginAdmin", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        username: "adminuser",
        password: "adminpass",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it("should log in admin and return a token", async () => {
    User.findOne.mockResolvedValue({
      _id: "admin123",
      username: "adminuser",
      email: "admin@example.com",
      role: "admin",
      password: "hashedPassword",
    });

    matchPassword.mockResolvedValue(true);
    generateToken.mockReturnValue("admin_jwt_token");

    await loginAdmin(req, res);

    expect(User.findOne).toHaveBeenCalledWith({
      username: "adminuser",
      role: "admin",
    });

    expect(matchPassword).toHaveBeenCalledWith("adminpass", "hashedPassword");
    expect(generateToken).toHaveBeenCalledWith({
      id: "admin123",
      role: "admin",
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Admin login successful",
      adminToken: "admin_jwt_token",
      user: {
        id: "admin123",
        username: "adminuser",
        email: "admin@example.com",
        role: "admin",
      },
    });
  });

  it("should return 404 if admin not found", async () => {
    User.findOne.mockResolvedValue(null);

    await loginAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Admin not found" });
  });

  it("should return 401 if password is invalid", async () => {
    User.findOne.mockResolvedValue({
      _id: "admin123",
      username: "adminuser",
      email: "admin@example.com",
      role: "admin",
      password: "hashedPassword",
    });

    matchPassword.mockResolvedValue(false);

    await loginAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
  });

  it("should handle server errors", async () => {
    console.error = jest.fn(); // Suppress expected error logs
    User.findOne.mockRejectedValue(new Error("DB error"));

    await loginAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error. Please try again later.",
    });
  });
});
