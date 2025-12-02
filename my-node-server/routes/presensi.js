const express = require("express");
const router = express.Router();

const presensiController = require("../controllers/presensiController");
const { authenticateToken, addUserData, isMahasiswa } = require("../middleware/permissionMiddleware");

router.post("/check-in", authenticateToken, addUserData, isMahasiswa, presensiController.checkIn);
router.post("/check-out", authenticateToken, addUserData, isMahasiswa, presensiController.checkOut);

module.exports = router;
