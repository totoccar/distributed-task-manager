// filepath: c:\Users\FRAVEGA\Downloads\Documents\GitHub\distributed-task-manager\backend\src\app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database-config');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas básicas
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Task Manager API is running',
        database: 'MongoDB'
    });
});

// Rutas principales
app.use('/api/tasks', require('./routes/tasks'));

// Rutas por implementar
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/users', require('./routes/users'));
// app.use('/api/projects', require('./routes/projects'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;