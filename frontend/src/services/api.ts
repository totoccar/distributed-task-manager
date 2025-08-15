import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas de error (token expirado)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expirado o inválido
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);// Interfaces para TypeScript
export interface Task {
    _id: string;
    title: string;
    description?: string;
    status: 'pending' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    assignedTo?: {
        _id: string;
        name: string;
        email: string;
        role: string;
    };
    project?: {
        _id: string;
        name: string;
        description?: string;
        status: string;
    };
    createdBy: {
        _id: string;
        name: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface HealthStatus {
    status: string;
    message: string;
    database?: string;
}

// Funciones para proyectos
export const projectService = {
    getAllProjects: async () => {
        const response = await api.get('/projects');
        return response.data;
    },

    createProject: async (projectData: any) => {
        const response = await api.post('/projects', projectData);
        return response.data;
    },

    getProject: async (id: string) => {
        const response = await api.get(`/projects/${id}`);
        return response.data;
    },

    updateProject: async (id: string, projectData: any) => {
        const response = await api.put(`/projects/${id}`, projectData);
        return response.data;
    },

    deleteProject: async (id: string) => {
        const response = await api.delete(`/projects/${id}`);
        return response.data;
    },
};

// Funciones para usuarios
export const userService = {
    getAllUsers: async () => {
        const response = await api.get('/auth/users');
        return response.data.data || response.data; // Maneja ambos formatos de respuesta
    },

    updateUser: async (id: string, userData: any) => {
        const response = await api.put(`/auth/users/${id}`, userData);
        return response.data;
    },

    deleteUser: async (id: string) => {
        const response = await api.delete(`/auth/users/${id}`);
        return response.data;
    }
};

// Funciones para dashboard
export const dashboardService = {
    getStats: async () => {
        const response = await api.get('/dashboard/stats');
        return response.data;
    },

    getRecentTasks: async () => {
        const response = await api.get('/dashboard/recent-tasks');
        return response.data;
    },
};

// Funciones para tareas
export const taskService = {
    getAllTasks: async (showAll?: boolean): Promise<Task[]> => {
        try {
            const params = showAll ? '?showAll=true' : '';
            const response = await api.get(`/tasks${params}`);
            return response.data.data || response.data;
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    },

    createTask: async (taskData: {
        title: string;
        description?: string;
        status?: 'pending' | 'in-progress' | 'completed';
        priority?: 'low' | 'medium' | 'high';
        dueDate?: string;
        assignedTo?: string;
        project?: string;
    }): Promise<Task> => {
        try {
            // Validaciones del frontend
            if (!taskData.title || taskData.title.trim().length === 0) {
                throw new Error('Title is required');
            }

            if (taskData.title.length > 100) {
                throw new Error('Title cannot exceed 100 characters');
            }

            if (taskData.description && taskData.description.length > 500) {
                throw new Error('Description cannot exceed 500 characters');
            }

            // Limpiar y preparar los datos
            const cleanTaskData: any = {
                title: taskData.title.trim(),
                description: taskData.description?.trim() || '',
                status: taskData.status || 'pending',
                priority: taskData.priority || 'medium'
            };

            // Solo agregar campos opcionales si tienen valor
            if (taskData.dueDate && taskData.dueDate.trim() !== '') {
                cleanTaskData.dueDate = taskData.dueDate;
            }

            if (taskData.assignedTo && taskData.assignedTo.trim() !== '') {
                cleanTaskData.assignedTo = taskData.assignedTo;
            }

            if (taskData.project && taskData.project.trim() !== '') {
                cleanTaskData.project = taskData.project;
            }

            console.log('Creating task with cleaned data:', cleanTaskData);
            const response = await api.post('/tasks', cleanTaskData);
            console.log('Task created successfully:', response.data);
            return response.data.data || response.data;
        } catch (error: any) {
            console.error('Error creating task:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);

            // Propagar el error con más información
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    },

    updateTask: async (id: string, taskData: Partial<Task>): Promise<Task> => {
        try {
            const response = await api.put(`/tasks/${id}`, taskData);
            return response.data.data || response.data;
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    },

    deleteTask: async (id: string): Promise<void> => {
        try {
            await api.delete(`/tasks/${id}`);
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    },
};

// Verificar conexión con la API
export const healthCheck = async (): Promise<HealthStatus | null> => {
    try {
        const response = await api.get<HealthStatus>('/health');
        return response.data;
    } catch (error) {
        console.error('API Health Check failed:', error);
        return null;
    }
};

export default api;
