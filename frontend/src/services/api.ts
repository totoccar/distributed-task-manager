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
    assignedTo?: string;
    project?: string;
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
};

// Funciones para usuarios
export const userService = {
    getAllUsers: async () => {
        const response = await api.get('/auth/users');
        return response.data;
    },
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
        const params = showAll ? '?showAll=true' : '';
        const response = await api.get<ApiResponse<Task[]>>(`/tasks${params}`);
        return response.data.data;
    },

    createTask: async (taskData: Partial<Task>): Promise<Task> => {
        const response = await api.post<ApiResponse<Task>>('/tasks', taskData);
        return response.data.data;
    },

    updateTask: async (id: string, taskData: Partial<Task>): Promise<Task> => {
        const response = await api.put<ApiResponse<Task>>(`/tasks/${id}`, taskData);
        return response.data.data;
    },

    deleteTask: async (id: string): Promise<void> => {
        await api.delete(`/tasks/${id}`);
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
