const express = require("express");
const router = express.Router();
const {
  verifyKhalti,
  initiateKhalti,
} = require("../controllers/paymentController");

router.post("/khalti/verify", verifyKhalti);
router.post("/khalti/initiate", initiateKhalti);

module.exports = router;
