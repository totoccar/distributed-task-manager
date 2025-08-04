const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { getDashboardStats, getRecentTasks } = require('../controllers/dashboardController');

// Obtener estadísticas del dashboard
router.get('/stats', auth, getDashboardStats);

// Obtener tareas recientes
router.get('/recent-tasks', auth, getRecentTasks);

module.exports = router;
