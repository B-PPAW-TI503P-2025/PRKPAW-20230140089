const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";

// ============================
// REGISTER
// ============================
exports.register = async (req, res) => {
  try {
    const { nama, email, password, role } = req.body;

    if (!nama || !email || !password) {
      return res.status(400).json({ message: "Nama, email, dan password harus diisi." });
    }

    const validRole = role || "mahasiswa";
    if (!["admin", "mahasiswa"].includes(validRole)) {
      return res.status(400).json({ message: "Role hanya boleh admin atau mahasiswa" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      nama,
      email,
      password: hashed,
      role: validRole
    });

    return res.status(201).json({
      message: "Registrasi berhasil",
      user: {
        id: newUser.id,
        nama: newUser.nama,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


// ============================
// LOGIN
// ============================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Email tidak ditemukan" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Password salah" });
    }

    const payload = {
      id: user.id,
      nama: user.nama,
      role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "6h" });

    return res.json({
      message: "Login berhasil",
      token,
      user: payload
    });

  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
