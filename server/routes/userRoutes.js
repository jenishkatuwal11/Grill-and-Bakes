const express = require("express");
const { verifyAdminToken } = require("../middlewares/jwtMiddlewares");
const { getUsers, toggleUserStatus } = require("../controllers/userController");

const router = express.Router();

//  Route to fetch all users
router.get("/", verifyAdminToken, getUsers);

//  Route to toggle user active/inactive status (Optional)
router.put("/toggle/:id", verifyAdminToken, toggleUserStatus);

module.exports = router;
