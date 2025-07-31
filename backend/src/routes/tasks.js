const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// GET /api/tasks - Obtener todas las tareas
router.get('/', taskController.getAllTasks);

// POST /api/tasks - Crear nueva tarea
router.post('/', taskController.createTask);

// GET /api/tasks/:id - Obtener tarea por ID
router.get('/:id', taskController.getTaskById);

// PUT /api/tasks/:id - Actualizar tarea
router.put('/:id', taskController.updateTask);

// DELETE /api/tasks/:id - Eliminar tarea
router.delete('/:id', taskController.deleteTask);

module.exports = router;
