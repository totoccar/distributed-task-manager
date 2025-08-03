// filepath: c:\Users\FRAVEGA\Downloads\Documents\GitHub\distributed-task-manager\backend\src\controllers\taskController.js
const Task = require('../models/Task');
const Project = require('../models/Project');

const taskController = {
    // Obtener todas las tareas
    getAllTasks: async (req, res) => {
        try {
            let query = {};
            const { project, status, priority, assignedTo } = req.query;

            // Filtros opcionales
            if (project) query.project = project;
            if (status) query.status = status;
            if (priority) query.priority = priority;
            if (assignedTo) query.assignedTo = assignedTo;

            // Si no es admin, solo mostrar tareas donde el usuario está involucrado
            if (req.user.role !== 'admin') {
                query.$or = [
                    { assignedTo: req.user.id },
                    { createdBy: req.user.id }
                ];
            }

            const tasks = await Task.find(query)
                .populate('assignedTo', 'name email role')
                .populate('project', 'name description status')
                .populate('createdBy', 'name email')
                .sort({ createdAt: -1 });

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
            const taskData = {
                ...req.body,
                createdBy: req.user.id
            };

            // Verificar que el proyecto existe si se especifica
            if (taskData.project) {
                const project = await Project.findById(taskData.project);
                if (!project) {
                    return res.status(404).json({
                        success: false,
                        message: 'Project not found'
                    });
                }

                // Verificar permisos para crear tareas en el proyecto
                if (req.user.role !== 'admin' && !project.isUserAssigned(req.user.id)) {
                    return res.status(403).json({
                        success: false,
                        message: 'No tienes permisos para crear tareas en este proyecto'
                    });
                }
            }

            const task = new Task(taskData);
            await task.save();

            await task.populate('assignedTo', 'name email role');
            await task.populate('project', 'name description status');
            await task.populate('createdBy', 'name email');

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
            const task = await Task.findById(req.params.id)
                .populate('assignedTo', 'name email role')
                .populate('project', 'name description status')
                .populate('createdBy', 'name email');

            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: 'Task not found'
                });
            }

            // Verificar permisos
            if (req.user.role !== 'admin' &&
                task.assignedTo?.toString() !== req.user.id &&
                task.createdBy?.toString() !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permisos para ver esta tarea'
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
            const task = await Task.findById(req.params.id);

            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: 'Task not found'
                });
            }

            // Verificar permisos
            if (req.user.role !== 'admin' &&
                task.assignedTo?.toString() !== req.user.id &&
                task.createdBy?.toString() !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permisos para actualizar esta tarea'
                });
            }

            const updatedTask = await Task.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            ).populate('assignedTo', 'name email role')
                .populate('project', 'name description status')
                .populate('createdBy', 'name email');

            res.json({
                success: true,
                data: updatedTask
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
            const task = await Task.findById(req.params.id);

            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: 'Task not found'
                });
            }

            // Verificar permisos
            if (req.user.role !== 'admin' &&
                task.createdBy?.toString() !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permisos para eliminar esta tarea'
                });
            }

            await Task.findByIdAndDelete(req.params.id);

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