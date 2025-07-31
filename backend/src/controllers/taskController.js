// filepath: c:\Users\FRAVEGA\Downloads\Documents\GitHub\distributed-task-manager\backend\src\controllers\taskController.js
const Task = require('../models/Task');

const taskController = {
    // Obtener todas las tareas
    getAllTasks: async (req, res) => {
        try {
            const tasks = await Task.find().sort({ createdAt: -1 });
            res.json({
                success: true,
                data: tasks
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching tasks',
                error: error.message
            });
        }
    },

    // Crear nueva tarea
    createTask: async (req, res) => {
        try {
            const task = new Task(req.body);
            await task.save();
            res.status(201).json({
                success: true,
                data: task
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Error creating task',
                error: error.message
            });
        }
    },

    // Obtener tarea por ID
    getTaskById: async (req, res) => {
        try {
            const task = await Task.findById(req.params.id);
            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: 'Task not found'
                });
            }
            res.json({
                success: true,
                data: task
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching task',
                error: error.message
            });
        }
    },

    // Actualizar tarea
    updateTask: async (req, res) => {
        try {
            const task = await Task.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: 'Task not found'
                });
            }
            res.json({
                success: true,
                data: task
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Error updating task',
                error: error.message
            });
        }
    },

    // Eliminar tarea
    deleteTask: async (req, res) => {
        try {
            const task = await Task.findByIdAndDelete(req.params.id);
            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: 'Task not found'
                });
            }
            res.json({
                success: true,
                message: 'Task deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting task',
                error: error.message
            });
        }
    }
};

module.exports = taskController;