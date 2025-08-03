const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['planning', 'active', 'on-hold', 'completed', 'cancelled'],
        default: 'planning'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    deadline: {
        type: Date
    },
    // Manager/Owner del proyecto
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Usuarios asignados al proyecto
    assignedUsers: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['developer', 'designer', 'tester', 'analyst', 'lead'],
            default: 'developer'
        },
        assignedAt: {
            type: Date,
            default: Date.now
        }
    }],
    // Progreso del proyecto (calculado basado en tareas)
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    // Configuración del proyecto
    settings: {
        isPublic: {
            type: Boolean,
            default: false
        },
        allowSelfAssignment: {
            type: Boolean,
            default: true
        },
        requireApproval: {
            type: Boolean,
            default: false
        }
    }
}, {
    timestamps: true
});

// Índices para optimizar consultas
projectSchema.index({ manager: 1 });
projectSchema.index({ 'assignedUsers.user': 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ priority: 1 });

// Virtual para obtener las tareas del proyecto
projectSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'project'
});

// Virtual para contar tareas
projectSchema.virtual('taskCount', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'project',
    count: true
});

// Método para calcular el progreso basado en tareas
projectSchema.methods.calculateProgress = async function () {
    const Task = mongoose.model('Task');
    const tasks = await Task.find({ project: this._id });

    if (tasks.length === 0) {
        this.progress = 0;
        return 0;
    }

    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    this.progress = Math.round((completedTasks / tasks.length) * 100);

    return this.progress;
};

// Método para verificar si un usuario está asignado al proyecto
projectSchema.methods.isUserAssigned = function (userId) {
    return this.assignedUsers.some(assignment =>
        assignment.user.toString() === userId.toString()
    ) || this.manager.toString() === userId.toString();
};

// Método para agregar usuario al proyecto
projectSchema.methods.assignUser = function (userId, role = 'developer') {
    const existingAssignment = this.assignedUsers.find(assignment =>
        assignment.user.toString() === userId.toString()
    );

    if (!existingAssignment) {
        this.assignedUsers.push({
            user: userId,
            role: role,
            assignedAt: new Date()
        });
    }

    return this;
};

// Método para remover usuario del proyecto
projectSchema.methods.unassignUser = function (userId) {
    this.assignedUsers = this.assignedUsers.filter(assignment =>
        assignment.user.toString() !== userId.toString()
    );

    return this;
};

// Middleware para actualizar el progreso antes de guardar
projectSchema.pre('save', async function (next) {
    if (this.isModified('status') && this.status === 'completed') {
        this.progress = 100;
    }
    next();
});

// Configurar populate por defecto
projectSchema.pre(/^find/, function (next) {
    this.populate('manager', 'name email role')
        .populate('assignedUsers.user', 'name email role');
    next();
});

module.exports = mongoose.model('Project', projectSchema);
