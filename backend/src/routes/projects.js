const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { auth } = require('../middleware/auth');

// Aplicar middleware de autenticación a todas las rutas
router.use(auth);

// Rutas de proyectos
router.get('/', projectController.getProjects); // GET /api/projects
router.get('/:id', projectController.getProject); // GET /api/projects/:id
router.post('/', projectController.createProject); // POST /api/projects
router.put('/:id', projectController.updateProject); // PUT /api/projects/:id
router.delete('/:id', projectController.deleteProject); // DELETE /api/projects/:id

// Rutas para gestión de usuarios en proyectos
router.post('/:id/assign-user', projectController.assignUser); // POST /api/projects/:id/assign-user
router.post('/:id/unassign-user', projectController.unassignUser); // POST /api/projects/:id/unassign-user

// Rutas para estadísticas
router.get('/:id/stats', projectController.getProjectStats); // GET /api/projects/:id/stats

module.exports = router;
