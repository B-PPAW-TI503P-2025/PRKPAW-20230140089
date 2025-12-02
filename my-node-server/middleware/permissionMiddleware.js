// middleware/permissionMiddleware.js

const jwt = require("jsonwebtoken");
const { User } = require("../models");

const JWT_SECRET = process.env.JWT_SECRET || "secret_dev_replace_me";

// ===============================
// 1. Autentikasi Token
// ===============================
exports.authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Akses ditolak. Token tidak disediakan."
      });
    }

    jwt.verify(token, JWT_SECRET, (err, payload) => {
      if (err) {
        return res.status(403).json({
          message: "Token tidak valid atau kedaluwarsa."
        });
      }

      if (!payload || !payload.id) {
        return res.status(401).json({
          message: "Token tidak lengkap. (ID tidak ditemukan)."
        });
      }

      req.user = payload; // ex: { id, nama?, role? }
      next();
    });
  } catch (error) {
    console.error("authenticateToken error:", error);
    return res.status(500).json({
      message: "Server error pada auth middleware",
      error: error.message
    });
  }
};

// ===============================
// 2. Tambahkan data user jika token kurang
// ===============================
exports.addUserData = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized: token tidak memiliki ID."
      });
    }

    // Jika token tidak terdapat nama/role → ambil dari DB
    if (!req.user.nama || !req.user.role) {
      const user = await User.findByPk(req.user.id, {
        attributes: ["id", "nama", "email", "role"]
      });

      if (!user) {
        return res.status(401).json({
          message: "User tidak ditemukan meskipun token valid."
        });
      }

      req.user.nama = user.nama;
      req.user.role = user.role;
    }

    next();
  } catch (error) {
    console.error("addUserData error:", error);
    return res.status(500).json({
      message: "Server error pada addUserData",
      error: error.message
    });
  }
};

// ===============================
// 3. Role: Admin
// ===============================
exports.isAdmin = (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      return next();
    }

    return res.status(403).json({
      message: "Akses ditolak. Hanya admin yang diperbolehkan."
    });
  } catch (error) {
    console.error("isAdmin error:", error);
    return res.status(500).json({
      message: "Server error pada isAdmin",
      error: error.message
    });
  }
};

// ===============================
// 4. Role: Mahasiswa
// ===============================
exports.isMahasiswa = (req, res, next) => {
  try {
    if (req.user && req.user.role === "mahasiswa") {
      return next();
    }

    return res.status(403).json({
      message: "Akses ditolak. Hanya mahasiswa yang dapat melakukan presensi."
    });
  } catch (error) {
    console.error("isMahasiswa error:", error);
    return res.status(500).json({
      message: "Server error pada isMahasiswa",
      error: error.message
    });
  }
};
