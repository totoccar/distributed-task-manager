// filepath: c:\Users\FRAVEGA\Downloads\Documents\GitHub\distributed-task-manager\backend\src\controllers\taskController.js
const Task = require('../models/Task');
const Project = require('../models/Project');

const taskController = {
    // Obtener todas las tareas
    getAllTasks: async (req, res) => {
        try {
            let query = {};
            const { project, status, priority, assignedTo, showAll } = req.query;

            // Filtros opcionales
            if (project) query.project = project;
            if (status) query.status = status;
            if (priority) query.priority = priority;
            if (assignedTo) query.assignedTo = assignedTo;

            // Si no es admin, solo mostrar tareas donde el usuario está involucrado
            // Si es admin y showAll es true, mostrar todas las tareas
            if (req.user.role !== 'admin' || showAll !== 'true') {
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
            console.log('=== CREATE TASK REQUEST ===');
            console.log('User:', req.user);
            console.log('Body:', req.body);

            const taskData = {
                ...req.body,
                createdBy: req.user.id
            };

            console.log('Task data to save:', taskData);

            // Verificar que el proyecto existe si se especifica
            if (taskData.project) {
                console.log('Checking project:', taskData.project);
                const project = await Project.findById(taskData.project)
                    .populate('manager', 'name email role')
                    .populate('assignedUsers.user', 'name email role');

                if (!project) {
                    console.log('Project not found');
                    return res.status(404).json({
                        success: false,
                        message: 'Project not found'
                    });
                }

                console.log('Project found:', project.name);

                // Verificar permisos para crear tareas en el proyecto
                // Admin y Manager pueden crear tareas en cualquier proyecto
                // Otros usuarios solo pueden crear tareas en proyectos donde están asignados
                if (req.user.role !== 'admin' && req.user.role !== 'manager' && !project.isUserAssigned(req.user.id)) {
                    console.log('User not assigned to project');
                    return res.status(403).json({
                        success: false,
                        message: 'No tienes permisos para crear tareas en este proyecto'
                    });
                }

                // Validar que el usuario asignado pertenece al proyecto
                if (taskData.assignedTo && taskData.assignedTo !== req.user.id) {
                    const isUserInProject = project.manager._id.toString() === taskData.assignedTo ||
                        project.assignedUsers.some(assignment =>
                            assignment.user._id.toString() === taskData.assignedTo
                        );

                    if (!isUserInProject) {
                        console.log('Assigned user not in project');
                        return res.status(400).json({
                            success: false,
                            message: 'El usuario asignado debe pertenecer al proyecto'
                        });
                    }
                }
            }

            const task = new Task(taskData);
            console.log('About to save task...');
            await task.save();
            console.log('Task saved successfully');

            await task.populate('assignedTo', 'name email role');
            await task.populate('project', 'name description status');
            await task.populate('createdBy', 'name email');

            console.log('Task populated:', task);

            res.status(201).json({
                success: true,
                data: task
            });
        } catch (error) {
            console.error('=== CREATE TASK ERROR ===');
            console.error('Error:', error);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);

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
            if (req.user.role !== 'admin' && req.user.role !== 'manager' &&
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
            const task = await Task.findById(req.params.id).populate('project');

            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: 'Task not found'
                });
            }

            // Verificar permisos
            if (req.user.role !== 'admin' && req.user.role !== 'manager' &&
                task.assignedTo?.toString() !== req.user.id &&
                task.createdBy?.toString() !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permisos para actualizar esta tarea'
                });
            }

            // Si se está cambiando el usuario asignado y la tarea pertenece a un proyecto
            if (req.body.assignedTo && task.project) {
                const project = await Project.findById(task.project._id)
                    .populate('manager', 'name email role')
                    .populate('assignedUsers.user', 'name email role');

                if (project) {
                    // Validar que el nuevo usuario asignado pertenece al proyecto
                    const isUserInProject = project.manager._id.toString() === req.body.assignedTo ||
                        project.assignedUsers.some(assignment =>
                            assignment.user._id.toString() === req.body.assignedTo
                        );

                    if (!isUserInProject) {
                        return res.status(400).json({
                            success: false,
                            message: 'El usuario asignado debe pertenecer al proyecto'
                        });
                    }
                }
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
            if (req.user.role !== 'admin' && req.user.role !== 'manager' &&
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