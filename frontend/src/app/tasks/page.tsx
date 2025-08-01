'use client';

import { useState, useEffect } from 'react';
import { taskService } from '@/services/api';
import ConfirmDelete from './confirmDelete';
import CreateTaskModal from './components/CreateTaskModal';
import TaskCard from './components/TaskCard';

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
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

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
        try {
            await taskService.deleteTask(taskId);
            setTaskToDelete(null); // Cerrar el modal
            loadTasks(); // Recargar tareas
        } catch (err) {
            setError('Error deleting task');
            console.error('Error deleting task:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => window.location.href = '/'}
                                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
                            >
                                <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>

                            </button>
                            <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
                            <div className="flex items-center">
                                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">Tasks</h1>
                                    <p className="text-sm text-gray-500">Manage your tasks efficiently</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>New Task</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
                        <div className="flex items-center">
                            <div className="bg-blue-100 p-3 rounded-xl">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 0 012 2" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                                <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
                        <div className="flex items-center">
                            <div className="bg-yellow-100 p-3 rounded-xl">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">In Progress</p>
                                <p className="text-2xl font-bold text-gray-900">{tasks.filter(t => t.status === 'in-progress').length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
                        <div className="flex items-center">
                            <div className="bg-green-100 p-3 rounded-xl">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-gray-900">{tasks.filter(t => t.status === 'completed').length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
                        <div className="flex items-center">
                            <div className="bg-red-100 p-3 rounded-xl">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.866-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">High Priority</p>
                                <p className="text-2xl font-bold text-gray-900">{tasks.filter(t => t.priority === 'high').length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700 font-medium">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
                        </div>
                        <p className="mt-4 text-lg text-gray-600 font-medium">Loading your tasks...</p>
                        <p className="text-sm text-gray-400">This should only take a moment</p>
                    </div>
                ) : (
                    <>
                        {/* Tasks Grid */}
                        {tasks.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="bg-gray-100 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                                    <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">No tasks yet</h3>
                                <p className="text-lg text-gray-500 mb-8 max-w-md mx-auto">
                                    Start being productive by creating your first task. You've got this!
                                </p>
                                <button
                                    onClick={() => setShowCreateForm(true)}
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 inline-flex items-center space-x-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span>Create your first task</span>
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {tasks.map((task) => (
                                    <TaskCard key={task._id} task={task} setTaskToDelete={setTaskToDelete} />
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

            {/* Delete Confirmation Modal */}
            {taskToDelete && (
                <ConfirmDelete
                    taskName={taskToDelete.title}
                    taskId={taskToDelete._id}
                    onDelete={handleDeleteTask}
                    onClose={() => setTaskToDelete(null)}
                />
            )}
        </div>
    );
}

// Componente Modal para crear tareas

