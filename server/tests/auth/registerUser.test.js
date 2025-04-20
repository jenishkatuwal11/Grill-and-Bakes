// tests/auth/registerUser.test.js
const { registerUser } = require("../../controllers/authController");
const User = require("../../models/Users");
const { hashPassword } = require("../../utils/passwordUtils");
const { generateToken } = require("../../middlewares/jwtMiddlewares");

jest.mock("../../models/Users");
jest.mock("../../utils/passwordUtils");
jest.mock("../../middlewares/jwtMiddlewares");

describe("Auth Controller - registerUser", () => {
  let req, res;
  const originalError = console.error;

  beforeEach(() => {
    req = {
      body: {
        username: "jenish",
        email: "jenishkatuwal7@.com",
        password: "password123",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
    console.error = jest.fn(); // Suppress console.error
  });

  afterAll(() => {
    console.error = originalError; // Restore after tests
  });

  it("should register user and return token", async () => {
    User.findOne.mockResolvedValue(null);
    hashPassword.mockResolvedValue("hashed_pw");
    User.create.mockResolvedValue({
      _id: "123",
      username: "jenish",
      email: "jenishkatuwal7@.com",
      role: "user",
    });
    generateToken.mockReturnValue("jwt_token");

    await registerUser(req, res);

    expect(User.findOne).toHaveBeenCalled();
    expect(hashPassword).toHaveBeenCalledWith("password123");
    expect(User.create).toHaveBeenCalledWith({
      username: "jenish",
      email: "jenishkatuwal7@.com",
      password: "hashed_pw",
      role: "user",
    });
    expect(generateToken).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Registration successful",
      token: "jwt_token",
      user: {
        id: "123",
        username: "jenish",
        email: "jenishkatuwal7@.com",
        role: "user",
      },
    });
  });

  it("should return 400 if email or username already exists", async () => {
    User.findOne.mockResolvedValue({ username: "jenish" });

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Username already exists",
    });
  });

  it("should return 500 on server error", async () => {
    User.findOne.mockRejectedValue(new Error("DB error"));

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error. Please try again later.",
    });
  });
});
