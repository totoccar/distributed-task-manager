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
router.get('/users', auth, authController.getUsers);
router.put('/users/:id', auth, authController.updateUser);
router.delete('/users/:id', auth, authController.deleteUser);


// Google Auth endpoint
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Reemplaza por tu client_id

router.post('/google', async (req, res) => {
    const { credential } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload.email;
        const name = payload.name;

        // Busca el usuario por email
        let user = await User.findOne({ email });

        // Si no existe, créalo
        if (!user) {
            user = new User({
                name,
                email,
                password: '', // No se usa para Google
                role: 'user',
                isActive: true,
                provider: 'google'
            });
            await user.save();
        }

        // Genera tu propio JWT
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(401).json({ error: 'Token de Google inválido' });
    }
});

module.exports = router;