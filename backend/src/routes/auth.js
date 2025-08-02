const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rutas protegidas (requieren autenticación)
router.get('/me', auth, authController.getMe);
router.put('/profile', auth, authController.updateProfile);
router.post('/change-password', auth, authController.changePassword);

module.exports = router;