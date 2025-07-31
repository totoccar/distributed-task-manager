'use client';

import { useState, useEffect } from 'react';
import { taskService } from '@/services/api';

// Define the Task type according to your API response
export interface Task {
    _id: string;
    title: string;
    description?: string;
    status?: "pending" | "in-progress" | "completed";
    priority?: "medium" | "low" | "high";
    dueDate?: string;
    createdAt: string;
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);

    // Cargar tareas al montar el componente
    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            setLoading(true);
            const tasksData = await taskService.getAllTasks();
            setTasks(tasksData);
            setError(null);
        } catch (err) {
            setError('Error loading tasks');
            console.error('Error loading tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (taskData: Partial<Task>) => {
        try {
            await taskService.createTask(taskData);
            setShowCreateForm(false);
            loadTasks(); // Recargar tareas
        } catch (err) {
            setError('Error creating task');
            console.error('Error creating task:', err);
        }
    };

    interface HandleDeleteTaskProps {
        taskId: string;
    }

    const handleDeleteTask = async (taskId: string): Promise<void> => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await taskService.deleteTask(taskId);
                loadTasks(); // Recargar tareas
            } catch (err) {
                setError('Error deleting task');
                console.error('Error deleting task:', err);
            }
        }
    };

    interface StatusColorProps {
        status?: "pending" | "in-progress" | "completed";
    }

    const getStatusColor = (status: StatusColorProps['status']): string => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in-progress':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority: string | undefined) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800';
            case 'medium':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={() => window.location.href = '/'}
                                className="text-gray-600 hover:text-gray-900 mr-4"
                            >
                                ← Back
                            </button>
                            <h1 className="text-xl font-semibold text-gray-900">
                                Tasks
                            </h1>
                        </div>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                        >
                            + New Task
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span className="ml-2 text-gray-600">Loading tasks...</span>
                    </div>
                ) : (
                    <>
                        {/* Tasks Grid */}
                        {tasks.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
                                <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
                                <div className="mt-6">
                                    <button
                                        onClick={() => setShowCreateForm(true)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                                    >
                                        + Create your first task
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tasks.map((task) => (
                                    <div key={task._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900 flex-1">
                                                {task.title}
                                            </h3>
                                            <button
                                                onClick={() => handleDeleteTask(task._id)}
                                                className="text-gray-400 hover:text-red-500 ml-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>

                                        {task.description && (
                                            <p className="text-gray-600 text-sm mb-4">{task.description}</p>
                                        )}

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                                {task.status || 'pending'}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                                {task.priority || 'medium'} priority
                                            </span>
                                        </div>

                                        {task.dueDate && (
                                            <div className="text-xs text-gray-500 mb-2">
                                                Due: {new Date(task.dueDate).toLocaleDateString()}
                                            </div>
                                        )}

                                        <div className="text-xs text-gray-400">
                                            Created: {new Date(task.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Create Task Modal */}
            {showCreateForm && (
                <CreateTaskModal
                    onClose={() => setShowCreateForm(false)}
                    onSubmit={handleCreateTask}
                />
            )}
        </div>
    );
}

// Componente Modal para crear tareas
interface CreateTaskModalProps {
    onClose: () => void;
    onSubmit: (taskData: Partial<Task>) => void;
}

function CreateTaskModal({ onClose, onSubmit }: CreateTaskModalProps) {
    const [formData, setFormData] = useState<{
        title: string;
        description: string;
        status: "pending" | "in-progress" | "completed";
        priority: "low" | "medium" | "high";
        dueDate: string;
    }>({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: ''
    });

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (formData.title.trim()) {
            onSubmit(formData);
        }
    };

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg text-gray-800 font-semibold">Create New Task</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Priority
                            </label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Due Date
                        </label>
                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            Create Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}