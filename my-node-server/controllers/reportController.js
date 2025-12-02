const { Presensi, User } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama } = req.query;

    // Tentukan rentang tanggal hari ini
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    let options = {
      where: {
        createdAt: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["nama", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    };

    // Jika admin mencari berdasarkan nama
    if (nama) {
      options.include[0].where = {
        nama: { [Op.like]: `%${nama}%` },
      };
    }

    const records = await Presensi.findAll(options);

    res.json({
      success: true,
      date: new Date().toLocaleDateString(),
      total: records.length,
      data: records,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil laporan",
      error: error.message,
    });
  }
};
