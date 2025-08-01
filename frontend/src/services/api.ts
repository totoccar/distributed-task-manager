import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interfaces para TypeScript
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

// Funciones para tareas
export const taskService = {
    getAllTasks: async (): Promise<Task[]> => {
        const response = await api.get<ApiResponse<Task[]>>('/tasks');
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
