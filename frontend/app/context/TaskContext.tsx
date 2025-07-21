"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Task {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate: string | null;
    createdAt: string;
    updatedAt: string;
}

interface TaskContextType {
    tasks: Task[];
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    getTasksByStatus: (status: Task['status']) => Task[];
    getTasksByPriority: (priority: Task['priority']) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        // Cargar tareas del localStorage
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            setTasks(JSON.parse(savedTasks));
        } else {
            // Tareas de ejemplo
            const exampleTasks: Task[] = [
                {
                    id: '1',
                    title: 'Revisar documentación del proyecto',
                    description: 'Leer y revisar toda la documentación técnica del nuevo proyecto',
                    status: 'pending',
                    priority: 'high',
                    dueDate: '2025-07-25',
                    createdAt: '2025-07-20T10:00:00Z',
                    updatedAt: '2025-07-20T10:00:00Z'
                },
                {
                    id: '2',
                    title: 'Implementar autenticación',
                    description: 'Desarrollar el sistema de login y registro de usuarios',
                    status: 'in-progress',
                    priority: 'high',
                    dueDate: '2025-07-22',
                    createdAt: '2025-07-20T11:00:00Z',
                    updatedAt: '2025-07-20T11:00:00Z'
                },
                {
                    id: '3',
                    title: 'Diseñar base de datos',
                    description: 'Crear el esquema de la base de datos para el sistema',
                    status: 'completed',
                    priority: 'medium',
                    dueDate: '2025-07-21',
                    createdAt: '2025-07-19T14:00:00Z',
                    updatedAt: '2025-07-20T09:00:00Z'
                }
            ];
            setTasks(exampleTasks);
            localStorage.setItem('tasks', JSON.stringify(exampleTasks));
        }
    }, []);

    const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newTask: Task = {
            ...taskData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const updatedTasks = [...tasks, newTask];
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };

    const updateTask = (id: string, updates: Partial<Task>) => {
        const updatedTasks = tasks.map(task =>
            task.id === id
                ? { ...task, ...updates, updatedAt: new Date().toISOString() }
                : task
        );
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };

    const deleteTask = (id: string) => {
        const updatedTasks = tasks.filter(task => task.id !== id);
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };

    const getTasksByStatus = (status: Task['status']) => {
        return tasks.filter(task => task.status === status);
    };

    const getTasksByPriority = (priority: Task['priority']) => {
        return tasks.filter(task => task.priority === priority);
    };

    return (
        <TaskContext.Provider value={{
            tasks,
            addTask,
            updateTask,
            deleteTask,
            getTasksByStatus,
            getTasksByPriority
        }}>
            {children}
        </TaskContext.Provider>
    );
}

export function useTasks() {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
}
