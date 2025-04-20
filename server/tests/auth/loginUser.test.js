const { loginUser } = require("../../controllers/authController");
const User = require("../../models/Users");
const { matchPassword } = require("../../utils/passwordUtils");
const { generateToken } = require("../../middlewares/jwtMiddlewares");

jest.mock("../../models/Users");
jest.mock("../../utils/passwordUtils");
jest.mock("../../middlewares/jwtMiddlewares");

describe("Auth Controller - loginUser", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        username: "jenish",
        password: "password123",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {}); // suppress error logs
  });

  afterAll(() => {
    console.error.mockRestore(); // restore after tests
  });

  it("should login user and return token", async () => {
    const mockUser = {
      _id: "user123",
      username: "jenish",
      email: "jenish@example.com",
      role: "user",
      password: "hashed_pw",
    };

    User.findOne.mockResolvedValue(mockUser);
    matchPassword.mockResolvedValue(true);
    generateToken.mockReturnValue("jwt_token");

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Login successful",
      token: "jwt_token",
      user: {
        id: "user123",
        username: "jenish",
        email: "jenish@example.com",
        role: "user",
      },
    });
  });

  it("should return 404 if user not found", async () => {
    User.findOne.mockResolvedValue(null);

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should return 403 if admin tries to login from user route", async () => {
    User.findOne.mockResolvedValue({ username: "admin", role: "admin" });

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Admins are not allowed to log in here.",
    });
  });

  it("should return 401 if password is incorrect", async () => {
    User.findOne.mockResolvedValue({ role: "user", password: "hashed_pw" });
    matchPassword.mockResolvedValue(false);

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
  });

  it("should return 500 on server error", async () => {
    User.findOne.mockRejectedValue(new Error("DB error"));

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error. Please try again later.",
    });
  });
});
