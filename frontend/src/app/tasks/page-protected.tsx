'use client';

import React, { useState, useEffect } from 'react';
import { taskService, Task } from '@/services/api';
import CreateTaskModal from './components/CreateTaskModal';
import TaskCard from './components/TaskCard';
import ConfirmDelete from './confirmDelete';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

const TasksPage = () => {
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const fetchedTasks = await taskService.getAllTasks();
            setTasks(fetchedTasks);
            setError(null);
        } catch (err) {
            console.error('Error fetching tasks:', err);
            setError('Failed to load tasks. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (taskData: Partial<Task>) => {
        try {
            const newTask = await taskService.createTask(taskData);
            setTasks(prev => [newTask, ...prev]);
            setIsCreateModalOpen(false);
        } catch (err) {
            console.error('Error creating task:', err);
            setError('Failed to create task. Please try again.');
        }
    };

    const handleUpdateTask = async (id: string, taskData: Partial<Task>) => {
        try {
            const updatedTask = await taskService.updateTask(id, taskData);
            setTasks(prev => prev.map(task =>
                task._id === id ? updatedTask : task
            ));
        } catch (err) {
            console.error('Error updating task:', err);
            setError('Failed to update task. Please try again.');
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        try {
            await taskService.deleteTask(taskId);
            setTasks(prev => prev.filter(task => task._id !== taskId));
            setTaskToDelete(null);
        } catch (err) {
            console.error('Error deleting task:', err);
            setError('Failed to delete task. Please try again.');
        }
    };

    const confirmDelete = (task: Task) => {
        setTaskToDelete(task);
    };

    const cancelDelete = () => {
        setTaskToDelete(null);
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    const getTaskStats = () => {
        const total = tasks.length;
        const completed = tasks.filter(task => task.status === 'completed').length;
        const inProgress = tasks.filter(task => task.status === 'in-progress').length;
        const pending = tasks.filter(task => task.status === 'pending').length;

        return { total, completed, inProgress, pending };
    };

    const stats = getTaskStats();

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                        <p className="text-white text-lg">Loading tasks...</p>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
                {/* Header */}
                <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <div className="flex items-center space-x-4">
                                <a
                                    href="/dashboard"
                                    className="text-gray-300 hover:text-white transition-colors duration-200"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </a>
                                <h1 className="text-2xl font-bold text-white">My Tasks</h1>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <p className="text-white font-medium">{user?.name}</p>
                                    <p className="text-gray-300 text-sm capitalize">{user?.role}</p>
                                </div>

                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>

                                <button
                                    onClick={logout}
                                    className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg border border-red-500/50 hover:bg-red-500/30 transition-all duration-200"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Error Alert */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                            <p className="text-red-200">{error}</p>
                        </div>
                    )}

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-300 text-sm">Total Tasks</p>
                                    <p className="text-3xl font-bold text-white">{stats.total}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                    📋
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-300 text-sm">In Progress</p>
                                    <p className="text-3xl font-bold text-yellow-400">{stats.inProgress}</p>
                                </div>
                                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                                    ⏳
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-300 text-sm">Completed</p>
                                    <p className="text-3xl font-bold text-green-400">{stats.completed}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                                    ✅
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-300 text-sm">Pending</p>
                                    <p className="text-3xl font-bold text-red-400">{stats.pending}</p>
                                </div>
                                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                                    ⭕
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Create Button */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                            <div className="flex flex-col md:flex-row gap-4 flex-1">
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />

                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all" className="bg-gray-800">All Status</option>
                                    <option value="pending" className="bg-gray-800">Pending</option>
                                    <option value="in-progress" className="bg-gray-800">In Progress</option>
                                    <option value="completed" className="bg-gray-800">Completed</option>
                                </select>

                                <select
                                    value={priorityFilter}
                                    onChange={(e) => setPriorityFilter(e.target.value)}
                                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all" className="bg-gray-800">All Priority</option>
                                    <option value="low" className="bg-gray-800">Low</option>
                                    <option value="medium" className="bg-gray-800">Medium</option>
                                    <option value="high" className="bg-gray-800">High</option>
                                </select>
                            </div>

                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 whitespace-nowrap"
                            >
                                + Create Task
                            </button>
                        </div>
                    </div>

                    {/* Tasks Grid */}
                    {filteredTasks.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center">
                                <span className="text-4xl">📝</span>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
                            </h3>
                            <p className="text-gray-300 mb-6">
                                {tasks.length === 0
                                    ? 'Create your first task to get started!'
                                    : 'Try adjusting your search or filter criteria.'
                                }
                            </p>
                            {tasks.length === 0 && (
                                <button
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                                >
                                    Create Your First Task
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTasks.map((task) => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    setTaskToDelete={setTaskToDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Modals */}
                <CreateTaskModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSubmit={handleCreateTask}
                />

                <ConfirmDelete
                    isOpen={!!taskToDelete}
                    onClose={cancelDelete}
                    onConfirm={() => taskToDelete && handleDeleteTask(taskToDelete._id)}
                    taskTitle={taskToDelete?.title || ''}
                />
            </div>
        </ProtectedRoute>
    );
};

export default TasksPage;
