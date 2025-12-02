// controllers/presensiController.js
const { Presensi } = require("../models");
const { Op } = require("sequelize");

// Helper untuk menentukan rentang tanggal hari ini
function getTodayRange() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const start = new Date(`${year}-${month}-${day} 00:00:00`);
  const end = new Date(`${year}-${month}-${day} 23:59:59`);

  return { start, end };
}

// ============================
// CHECK-IN
// ============================
exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const { latitude, longitude } = req.body;

    const { start, end } = getTodayRange();

    // Cek apakah sudah check-in hari ini
    const existing = await Presensi.findOne({
      where: {
        userId,
        checkIn: { [Op.between]: [start, end] }
      }
    });

    if (existing) {
      return res.status(400).json({ message: "Anda sudah check-in hari ini." });
    }

    const presensi = await Presensi.create({
      userId,
      checkIn: new Date(),
      latitude,
      longitude
    });

    return res.json({
      message: "Check-in berhasil",
      data: presensi
    });

  } catch (error) {
    console.error("Check-in Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ============================
// CHECK-OUT
// ============================
exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const { latitude, longitude } = req.body;

    const { start, end } = getTodayRange();

    // Cek record check-in hari ini
    const presensi = await Presensi.findOne({
      where: {
        userId,
        checkIn: { [Op.between]: [start, end] }
      }
    });

    if (!presensi) {
      return res.status(400).json({ message: "Anda belum check-in hari ini." });
    }

    if (presensi.checkOut) {
      return res.status(400).json({ message: "Anda sudah check-out hari ini." });
    }

    // Simpan checkout + lokasi
    presensi.checkOut = new Date();
    presensi.latitude = latitude || presensi.latitude;
    presensi.longitude = longitude || presensi.longitude;

    await presensi.save();

    return res.json({
      message: "Check-out berhasil",
      data: presensi
    });

  } catch (error) {
    console.error("Check-out Error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
