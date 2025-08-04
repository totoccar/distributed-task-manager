const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

// Obtener estadísticas del dashboard
const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        // Obtener fecha de hoy para tareas completadas hoy
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        let stats = {};

        if (userRole === 'admin') {
            // Estadísticas para admin (todo el sistema)
            const [activeTasks, completedToday, totalProjects] = await Promise.all([
                Task.countDocuments({ status: { $in: ['pending', 'in-progress'] } }),
                Task.countDocuments({
                    status: 'completed',
                    updatedAt: { $gte: today, $lt: tomorrow }
                }),
                Project.countDocuments()
            ]);

            stats = {
                activeTasks,
                completedToday,
                totalProjects
            };
        } else if (userRole === 'manager') {
            // Estadísticas para manager (proyectos que maneja + sus tareas)
            const managedProjects = await Project.find({ manager: userId }).select('_id');
            const managedProjectIds = managedProjects.map(p => p._id);

            const [activeTasks, completedToday, totalProjects] = await Promise.all([
                Task.countDocuments({
                    $or: [
                        { assignedTo: userId, status: { $in: ['pending', 'in-progress'] } },
                        { project: { $in: managedProjectIds }, status: { $in: ['pending', 'in-progress'] } }
                    ]
                }),
                Task.countDocuments({
                    $or: [
                        { assignedTo: userId, status: 'completed', updatedAt: { $gte: today, $lt: tomorrow } },
                        { project: { $in: managedProjectIds }, status: 'completed', updatedAt: { $gte: today, $lt: tomorrow } }
                    ]
                }),
                Project.countDocuments({
                    $or: [
                        { manager: userId },
                        { 'assignedUsers.user': userId }
                    ]
                })
            ]);

            stats = {
                activeTasks,
                completedToday,
                totalProjects
            };
        } else {
            // Estadísticas para usuario regular (solo sus tareas y proyectos asignados)
            const [activeTasks, completedToday, totalProjects] = await Promise.all([
                Task.countDocuments({
                    assignedTo: userId,
                    status: { $in: ['pending', 'in-progress'] }
                }),
                Task.countDocuments({
                    assignedTo: userId,
                    status: 'completed',
                    updatedAt: { $gte: today, $lt: tomorrow }
                }),
                Project.countDocuments({ 'assignedUsers.user': userId })
            ]);

            stats = {
                activeTasks,
                completedToday,
                totalProjects
            };
        }

        res.json(stats);
    } catch (error) {
        console.error('Error getting dashboard stats:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Obtener tareas recientes para el usuario
const getRecentTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        let query = {};

        if (userRole === 'admin') {
            // Admin puede ver las tareas más recientes del sistema
            query = {};
        } else if (userRole === 'manager') {
            // Manager puede ver tareas de sus proyectos y las asignadas a él
            const managedProjects = await Project.find({ manager: userId }).select('_id');
            const managedProjectIds = managedProjects.map(p => p._id);

            query = {
                $or: [
                    { assignedTo: userId },
                    { project: { $in: managedProjectIds } }
                ]
            };
        } else {
            // Usuario regular solo ve sus tareas asignadas
            query = { assignedTo: userId };
        }

        const tasks = await Task.find(query)
            .populate('assignedTo', 'name email')
            .populate('project', 'name')
            .sort({ updatedAt: -1 })
            .limit(5);

        res.json(tasks);
    } catch (error) {
        console.error('Error getting recent tasks:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = {
    getDashboardStats,
    getRecentTasks
};
