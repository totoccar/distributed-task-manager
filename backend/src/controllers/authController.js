const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generar JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });
};

const authController = {
    // POST /api/auth/register
    register: async (req, res) => {
        try {
            const { name, email, password, role } = req.body;

            // Verificar si el usuario ya existe
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User already exists with this email'
                });
            }

            // Crear nuevo usuario
            const user = new User({
                name,
                email,
                password,
                role: role || 'user'
            });

            await user.save();

            // Generar token
            const token = generateToken(user._id);

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    user,
                    token
                }
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Error registering user',
                error: error.message
            });
        }
    },

    // POST /api/auth/login
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Verificar que se proporcionen email y password
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide email and password'
                });
            }

            // Buscar usuario y incluir password para comparación
            const user = await User.findOne({ email }).select('+password');

            if (!user || !user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials or user is inactive'
                });
            }

            // Verificar password
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Actualizar último login
            user.lastLogin = new Date();
            await user.save();

            // Generar token
            const token = generateToken(user._id);

            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    user: user.toJSON(), // Esto excluye el password
                    token
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error logging in',
                error: error.message
            });
        }
    },

    // GET /api/auth/me
    getMe: async (req, res) => {
        try {
            const user = await User.findById(req.user.id);

            res.json({
                success: true,
                data: user
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching user profile',
                error: error.message
            });
        }
    },

    // PUT /api/auth/profile
    updateProfile: async (req, res) => {
        try {
            const { name, email, avatar } = req.body;

            const user = await User.findByIdAndUpdate(
                req.user.id,
                { name, email, avatar },
                { new: true, runValidators: true }
            );

            res.json({
                success: true,
                message: 'Profile updated successfully',
                data: user
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Error updating profile',
                error: error.message
            });
        }
    },

    // POST /api/auth/change-password
    changePassword: async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;

            const user = await User.findById(req.user.id).select('+password');

            // Verificar password actual
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }

            // Actualizar password
            user.password = newPassword;
            await user.save();

            res.json({
                success: true,
                message: 'Password changed successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Error changing password',
                error: error.message
            });
        }
    },

    // GET /api/auth/users
    getUsers: async (req, res) => {
        try {
            // Solo admin y manager pueden ver todos los usuarios
            if (req.user.role !== 'admin' && req.user.role !== 'manager') {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            // Los admin pueden ver todos los usuarios, los manager solo usuarios activos
            const filter = req.user.role === 'admin' ? {} : { isActive: true };
            
            const users = await User.find(filter).select('name email role avatar isActive lastLogin createdAt updatedAt');

            res.json({
                success: true,
                data: users
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching users',
                error: error.message
            });
        }
    }
};

module.exports = authController;