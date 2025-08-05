const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

// Obtener todos los proyectos (con filtros según el rol del usuario)
exports.getProjects = async (req, res) => {
    try {
        let query = {};

        // Si no es admin, solo mostrar proyectos donde el usuario está involucrado
        if (req.user.role !== 'admin') {
            query = {
                $or: [
                    { manager: req.user.id },
                    { 'assignedUsers.user': req.user.id },
                    { 'settings.isPublic': true }
                ]
            };
        }

        const projects = await Project.find(query)
            .populate('manager', 'name email role')
            .populate('assignedUsers.user', 'name email role')
            .sort({ createdAt: -1 });

        // Calcular progreso para cada proyecto
        for (let project of projects) {
            await project.calculateProgress();
            await project.save();
        }

        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Error al obtener proyectos' });
    }
};

// Obtener un proyecto específico con sus tareas
exports.getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('manager', 'name email role')
            .populate('assignedUsers.user', 'name email role');

        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }

        // Verificar permisos
        console.log('🔍 Verificando permisos para proyecto:', req.params.id);
        console.log('👤 Usuario:', {
            id: req.user.id,
            _id: req.user._id,
            role: req.user.role,
            name: req.user.name
        });
        console.log('📝 Proyecto:', {
            id: project._id.toString(),
            manager: project.manager._id ? project.manager._id.toString() : project.manager.toString(),
            isPublic: project.settings?.isPublic,
            assignedUsers: project.assignedUsers.map(u => ({
                userId: u.user._id.toString(),
                role: u.role
            }))
        });

        const isManager = project.manager._id ?
            project.manager._id.toString() === req.user.id || project.manager._id.toString() === req.user._id :
            project.manager.toString() === req.user.id || project.manager.toString() === req.user._id;

        const isAssigned = project.assignedUsers.some(assignment =>
            assignment.user._id.toString() === req.user.id || assignment.user._id.toString() === req.user._id
        );

        console.log('🔐 Verificaciones:', {
            isAdmin: req.user.role === 'admin',
            isManager,
            isAssigned,
            isPublic: project.settings?.isPublic || false
        });

        if (req.user.role !== 'admin' && !isManager && !isAssigned && !project.settings?.isPublic) {
            console.log('❌ Acceso denegado');
            return res.status(403).json({ message: 'No tienes permisos para ver este proyecto' });
        }

        console.log('✅ Acceso permitido');

        // Obtener las tareas del proyecto
        const tasks = await Task.find({ project: project._id })
            .populate('assignedTo', 'name email role')
            .sort({ createdAt: -1 });

        // Calcular progreso
        await project.calculateProgress();
        await project.save();

        res.json({
            ...project.toObject(),
            tasks
        });
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ message: 'Error al obtener el proyecto' });
    }
};

// Crear un nuevo proyecto
exports.createProject = async (req, res) => {
    try {
        const {
            name,
            description,
            status,
            priority,
            startDate,
            endDate,
            deadline,
            assignedUsers,
            settings
        } = req.body;

        // Validar que el usuario tenga permisos para crear proyectos
        if (req.user.role === 'user') {
            return res.status(403).json({ message: 'No tienes permisos para crear proyectos' });
        }

        const project = new Project({
            name,
            description,
            status,
            priority,
            startDate,
            endDate,
            deadline,
            manager: req.user.id,
            assignedUsers: assignedUsers || [],
            settings: settings || {}
        });

        await project.save();
        await project.populate('manager', 'name email role');
        await project.populate('assignedUsers.user', 'name email role');

        res.status(201).json(project);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Error al crear el proyecto' });
    }
};

// Actualizar un proyecto
exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }

        // Verificar permisos (solo manager o admin pueden actualizar)
        if (req.user.role !== 'admin' && project.manager.toString() !== req.user.id) {
            return res.status(403).json({ message: 'No tienes permisos para actualizar este proyecto' });
        }

        const {
            name,
            description,
            status,
            priority,
            startDate,
            endDate,
            deadline,
            settings,
            assignedUsers
        } = req.body;

        // Actualizar campos permitidos
        if (name !== undefined) project.name = name;
        if (description !== undefined) project.description = description;
        if (status !== undefined) project.status = status;
        if (priority !== undefined) project.priority = priority;
        if (startDate !== undefined) project.startDate = startDate;
        if (endDate !== undefined) project.endDate = endDate;
        if (deadline !== undefined) project.deadline = deadline;
        if (settings !== undefined) project.settings = { ...project.settings, ...settings };

        // Actualizar usuarios asignados si se proporcionan
        if (assignedUsers !== undefined) {
            project.assignedUsers = assignedUsers;
        }

        await project.save();
        await project.populate('manager', 'name email role');
        await project.populate('assignedUsers.user', 'name email role');

        res.json(project);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Error al actualizar el proyecto' });
    }
};

// Eliminar un proyecto
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }

        // Solo admin o manager pueden eliminar
        if (req.user.role !== 'admin' && project.manager.toString() !== req.user.id) {
            return res.status(403).json({ message: 'No tienes permisos para eliminar este proyecto' });
        }

        // Verificar si hay tareas asociadas
        const taskCount = await Task.countDocuments({ project: project._id });
        if (taskCount > 0) {
            return res.status(400).json({
                message: 'No se puede eliminar el proyecto porque tiene tareas asociadas'
            });
        }

        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Proyecto eliminado correctamente' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Error al eliminar el proyecto' });
    }
};

// Asignar usuario a un proyecto
exports.assignUser = async (req, res) => {
    try {
        const { userId, role } = req.body;
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }

        // Verificar permisos
        if (req.user.role !== 'admin' && project.manager.toString() !== req.user.id) {
            return res.status(403).json({ message: 'No tienes permisos para asignar usuarios' });
        }

        // Verificar que el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Asignar usuario
        project.assignUser(userId, role);
        await project.save();
        await project.populate('assignedUsers.user', 'name email role');

        res.json(project);
    } catch (error) {
        console.error('Error assigning user:', error);
        res.status(500).json({ message: 'Error al asignar usuario' });
    }
};

// Desasignar usuario de un proyecto
exports.unassignUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }

        // Verificar permisos
        if (req.user.role !== 'admin' && project.manager.toString() !== req.user.id) {
            return res.status(403).json({ message: 'No tienes permisos para desasignar usuarios' });
        }

        // No permitir desasignar al manager
        if (project.manager.toString() === userId) {
            return res.status(400).json({ message: 'No se puede desasignar al manager del proyecto' });
        }

        // Desasignar usuario
        project.unassignUser(userId);
        await project.save();
        await project.populate('assignedUsers.user', 'name email role');

        res.json(project);
    } catch (error) {
        console.error('Error unassigning user:', error);
        res.status(500).json({ message: 'Error al desasignar usuario' });
    }
};

// Obtener estadísticas del proyecto
exports.getProjectStats = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }

        // Verificar permisos
        if (req.user.role !== 'admin' && !project.isUserAssigned(req.user.id) && !project.settings.isPublic) {
            return res.status(403).json({ message: 'No tienes permisos para ver las estadísticas' });
        }

        const tasks = await Task.find({ project: project._id });

        const stats = {
            totalTasks: tasks.length,
            completedTasks: tasks.filter(task => task.status === 'completed').length,
            inProgress: tasks.filter(task => task.status === 'in-progress').length,
            pending: tasks.filter(task => task.status === 'pending').length,
            overdueTasks: tasks.filter(task =>
                task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'
            ).length,
            tasksByPriority: {
                high: tasks.filter(task => task.priority === 'high').length,
                medium: tasks.filter(task => task.priority === 'medium').length,
                low: tasks.filter(task => task.priority === 'low').length
            },
            progress: project.progress
        };

        res.json(stats);
    } catch (error) {
        console.error('Error fetching project stats:', error);
        res.status(500).json({ message: 'Error al obtener estadísticas' });
    }
};
