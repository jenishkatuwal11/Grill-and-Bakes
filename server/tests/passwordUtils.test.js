// backend/tests/passwordUtils.test.js

const { hashPassword, matchPassword } = require("../utils/passwordUtils");

describe("Password Utility Functions", () => {
  const plainPassword = "TestPassword123";

  let hashed;

  it("should hash the password correctly", async () => {
    hashed = await hashPassword(plainPassword);

    expect(hashed).toBeDefined();
    expect(typeof hashed).toBe("string");
    expect(hashed).not.toBe(plainPassword);
  });

  it("should return true for correct password match", async () => {
    const isMatch = await matchPassword(plainPassword, hashed);

    expect(isMatch).toBe(true);
  });

  it("should return false for incorrect password", async () => {
    const isMatch = await matchPassword("WrongPassword", hashed);

    expect(isMatch).toBe(false);
  });
});
