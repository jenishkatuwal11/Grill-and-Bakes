const request = require("supertest");
const express = require("express");
const {
  generateToken,
  verifyToken,
  verifyAdminToken,
} = require("../middlewares/jwtMiddlewares");

require("dotenv").config();

const app = express();
app.use(express.json());

// Mock route for user token test
app.get("/test-user", verifyToken, (req, res) => {
  res.status(200).json({ message: "User token verified", user: req.user });
});

// Mock route for admin token test
app.get("/test-admin", verifyAdminToken, (req, res) => {
  res.status(200).json({ message: "Admin token verified", user: req.user });
});

describe("JWT Middleware Functions", () => {
  const userPayload = { id: "user123", role: "user" };
  const adminPayload = { id: "admin123", role: "admin" };

  const userToken = generateToken(userPayload);
  const adminToken = generateToken(adminPayload);

  test("generateToken should return a valid token", () => {
    expect(typeof userToken).toBe("string");
    expect(userToken.length).toBeGreaterThan(10);
  });

  test("verifyToken should allow access to protected route for valid user token", async () => {
    const res = await request(app)
      .get("/test-user")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.id).toBe("user123");
  });

  test("verifyToken should deny access with no token", async () => {
    const res = await request(app).get("/test-user");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("No token provided, authorization denied.");
  });

  test("verifyAdminToken should allow access for admin token", async () => {
    const res = await request(app)
      .get("/test-admin")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.role).toBe("admin");
  });

  test("verifyAdminToken should deny access if not admin", async () => {
    const res = await request(app)
      .get("/test-admin")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Access denied: Admins only.");
  });
});
