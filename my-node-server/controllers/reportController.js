// reportController.js

const { Presensi, User } = require("../models");
const { Op } = require("sequelize");
// ... (Pastikan Anda sudah mengimpor modul yang diperlukan)

exports.getDailyReport = async (req, res) => {
    try {
        const { nama, startDate, endDate } = req.query; 

        // --- Tentukan Rentang Tanggal (Kode ini sudah benar) ---
        let dateFilter = {};
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); 
            
            dateFilter = {
                createdAt: {
                    [Op.between]: [start, end],
                },
            };
        } else {
            // Filter hari ini (sesuai log SQL Anda)
            const today = new Date();
            const startOfDay = new Date(today.setHours(0, 0, 0, 0));
            const endOfDay = new Date(today.setHours(23, 59, 59, 999));
            
            dateFilter = {
                createdAt: {
                    [Op.between]: [startOfDay, endOfDay],
                },
            };
        }

        let options = {
            where: dateFilter, 
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["nama", "email"],
                    where: {},
                },
            ],
            order: [["createdAt", "DESC"]], 
        };

        if (nama) {
            options.include[0].where = {
                nama: { [Op.like]: `%${nama}%` },
            };
        }

        const records = await Presensi.findAll(options);
        
        // --- PERBAIKAN KRITIS: Mapping dan Penormalan Jalur ---
        const processedRecords = records.map(record => {
            const data = record.get({ plain: true });
            
            // FUNGSI PERBAIKAN JALUR:
            const normalizePath = (path) => {
                if (!path) return null;
                
                // Hapus semua awalan jalur yang tidak perlu, hanya menyisakan nama file.
                // Misal: 'uploads/nama.jpg' atau '/uploads/nama.jpg' menjadi 'nama.jpg'
                let fileName = path.replace(/^(?:\/uploads\/|uploads\/)/, '');
                
                // Bangun jalur yang BENAR yang dicari oleh Express Static
                return `/uploads/${fileName}`; 
            };
            
            // 🔑 Pemetaan: buktifoto (DB) -> foto_check_in (React)
            data.foto_check_in = normalizePath(data.buktiFoto); 
            
            // Karena tidak ada kolom foto check-out, pastikan diset NULL
            data.foto_check_out = null; 
            
            return data; 
        });
        
        // --- Kirim Respon ---
        res.json({
            success: true,
            date: new Date().toLocaleDateString(),
            total: processedRecords.length,
            data: processedRecords, 
        });

    } catch (error) {
        console.error("Error in getDailyReport:", error); 
        // 🚨 Penting: Jika Error 500 masih terjadi, pastikan Anda melihat log error.message
        res.status(500).json({
            success: false,
            message: "Gagal mengambil laporan",
            error: error.message,
        });
    }
};