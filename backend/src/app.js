// filepath: c:\Users\FRAVEGA\Downloads\Documents\GitHub\distributed-task-manager\backend\src\app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectDB = require('./config/database-config');

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
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/dashboard', require('./routes/dashboard'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;