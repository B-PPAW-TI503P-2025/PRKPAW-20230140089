// controllers/presensiController.js

const { Presensi } = require("../models");
const multer = require("multer");
const path = require("path");

// Konfigurasi Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Contoh: 8-1765033146978.jpg
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Hanya file gambar yang diperbolehkan!"), false);
};

exports.upload = multer({
  storage,
  fileFilter
});

// Check-In
exports.checkIn = async (req, res) => {
  try {
    const { id: userId, nama } = req.user;
    const { latitude, longitude } = req.body;

    // 🔑 PERBAIKAN KRITIS: Menggunakan filename dan menggabungkannya dengan folder 'uploads'
    // Ini memastikan jalur disimpan dengan forward slash (/) dan sesuai dengan logika reportController
    let buktiFotoPath = null;
    if (req.file) {
        // Kita simpan format yang konsisten, misalnya: uploads/8-1765033146978.jpg
        buktiFotoPath = path.join('uploads', req.file.filename).replace(/\\/g, '/');
    }
    
    const already = await Presensi.findOne({
      where: {
        userId,
        checkOut: null
      }
    });

    if (already) {
      return res
        .status(400)
        .json({ message: "Anda sudah melakukan check-in, lakukan check-out dulu!" });
    }

    await Presensi.create({
      userId,
      checkIn: new Date(),
      latitude,
      longitude,
      buktiFoto: buktiFotoPath // Menggunakan jalur yang sudah dinormalisasi
    });

    res.json({ message: "Check-In berhasil!" });
  } catch (err) {
    console.error("CheckIn error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

// Check-Out
exports.checkOut = async (req, res) => {
  try {
    const record = await Presensi.findOne({
      where: { userId: req.user.id, checkOut: null }
    });

    if (!record) {
      return res.status(400).json({ message: "Tidak ada Check-In aktif." });
    }

    // Catatan: Jika check-out juga memerlukan foto, Anda perlu menambahkan
    // middleware upload Multer di sini dan menyimpan buktiFoto baru.
    
    record.checkOut = new Date();
    await record.save();

    res.json({ message: "Check-Out berhasil!" });
  } catch (err) {
    res.status(500).json({ message: "Server error check-out." });
  }
};