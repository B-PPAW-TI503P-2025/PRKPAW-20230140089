// middleware/permissionMiddleware.js
const jwt = require("jsonwebtoken");
const { User } = require("../models");

// =============== 1. Autentikasi Token ==================
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Akses ditolak. Token tidak ditemukan." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json({ message: "Token tidak valid atau sudah kedaluwarsa." });
    }

    req.user = payload; // { id, email, role }
    next();
  });
};

// =============== 2. Pastikan Data User Lengkap ==================
exports.addUserData = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Token tidak memiliki ID user." });
    }

    // Jika role atau nama belum ada di token → ambil dari DB
    if (!req.user.nama || !req.user.role) {
      const user = await User.findByPk(req.user.id, {
        attributes: ["id", "nama", "email", "role"]
      });

      if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan." });
      }

      req.user.nama = user.nama;
      req.user.role = user.role;
    }

    next();
  } catch (err) {
    return res.status(500).json({ message: "Server error (addUserData)." });
  }
};

// =============== 3. Role Mahasiswa ==================
exports.isMahasiswa = (req, res, next) => {
  if (req.user.role === "mahasiswa") return next();
  return res.status(403).json({ message: "Akses ditolak. Hanya mahasiswa." });
};

// =============== 4. Role Admin ==================
exports.isAdmin = (req, res, next) => {
  if (req.user.role === "admin") return next();
  return res.status(403).json({ message: "Akses ditolak. Hanya admin." });
};
