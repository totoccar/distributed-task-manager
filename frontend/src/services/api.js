import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Funciones para tareas
export const taskService = {
    getAllTasks: async () => {
        const response = await api.get('/tasks');
        return response.data.data;
    },

    createTask: async (taskData) => {
        const response = await api.post('/tasks', taskData);
        return response.data.data;
    },

    updateTask: async (id, taskData) => {
        const response = await api.put(`/tasks/${id}`, taskData);
        return response.data.data;
    },

    deleteTask: async (id) => {
        await api.delete(`/tasks/${id}`);
    },
};

// Verificar conexión con la API
export const healthCheck = async () => {
    try {
        const response = await api.get('/health');
        return response.data;
    } catch (error) {
        console.error('API Health Check failed:', error);
        return null;
    }
};

export default api;