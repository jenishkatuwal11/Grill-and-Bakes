const express = require("express");
const multer = require("multer");
const path = require("path");
const { verifyAdminToken } = require("../middlewares/jwtMiddlewares");
const {
  getItems,
  addItems,
  updateItems,
  deleteItems,
  getItemById,
} = require("../controllers/itemController");

const router = express.Router();

//  Setup Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save images in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

//  Updated Routes
router.get("/", getItems);
router.post("/add", verifyAdminToken, upload.single("image"), addItems);
router.put(
  "/update/:id",
  verifyAdminToken,
  upload.single("image"),
  updateItems
);
router.delete("/delete/:id", verifyAdminToken, deleteItems);

router.get("/:id", getItemById);

module.exports = router;
