const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    console.log(" Generated Token:", token); // Debugging line
    return token;
  } catch (error) {
    console.error(" Error generating token:", error.message);
    return null;
  }
};

//  Extract Token from Request
const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1]; // Extract token from 'Bearer <token>'
  }
  return null;
};

//  Verify User Token Middleware
const verifyToken = (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided, authorization denied." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

//  Verify Admin Token Middleware
const verifyAdminToken = (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided, authorization denied." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only." });
    }

    req.user = decoded; // Attach admin info to request
    next();
  } catch (error) {
    console.error("Error verifying admin token:", error.message);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

module.exports = { generateToken, verifyToken, verifyAdminToken };
