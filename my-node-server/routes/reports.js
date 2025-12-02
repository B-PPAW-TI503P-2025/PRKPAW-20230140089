const express = require('express');
const router = express.Router();

const reportController = require('../controllers/reportController');
const { authenticateToken, addUserData, isAdmin } = require('../middleware/permissionMiddleware');

// Laporan harian khusus admin
router.get('/daily',
    authenticateToken,
    addUserData,
    isAdmin,
    reportController.getDailyReport
);

module.exports = router;
