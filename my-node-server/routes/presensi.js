const express = require("express");
const router = express.Router();

const presensiController = require("../controllers/presensiController");
const { authenticateToken, addUserData, isMahasiswa } = require("../middleware/permissionMiddleware");

// Route Check-In (Sudah Benar)
router.post(
  "/check-in",
  authenticateToken,
  addUserData,
  isMahasiswa,
  presensiController.upload.single("image"),
  presensiController.checkIn
);

// Route Check-Out (Diperbaiki: Menambahkan middleware upload)
router.post(
  "/check-out",
  authenticateToken,
  addUserData,
  isMahasiswa,
  presensiController.upload.single("image"), // <-- TAMBAHKAN INI
  presensiController.checkOut
);

module.exports = router;