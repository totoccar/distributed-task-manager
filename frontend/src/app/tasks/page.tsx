'use client';

import { useState, useEffect } from 'react';
import { taskService, Task } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import ConfirmDelete from './confirmDelete';
import CreateTaskModal from './components/CreateTaskModal';
import TaskCard from './components/TaskCard';

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

    // Estados para filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');
    const [showAllTasks, setShowAllTasks] = useState(false); // Solo para administradores

    const { user } = useAuth();

    // Cargar tareas al montar el componente
    useEffect(() => {
        loadTasks();
    }, []);

    // Aplicar filtros cuando cambien las tareas o los filtros
    useEffect(() => {
        applyFilters();
    }, [tasks, searchTerm, statusFilter, priorityFilter, showAllTasks, user]);

    // Recargar tareas cuando showAllTasks cambie (solo para admins)
    useEffect(() => {
        if (user?.role === 'admin') {
            loadTasks();
        }
    }, [showAllTasks, user?.role]);

    const loadTasks = async () => {
        try {
            setLoading(true);
            const showAll = user?.role === 'admin' && showAllTasks;
            const tasksData = await taskService.getAllTasks(showAll);
            setTasks(tasksData);
            setError(null);
        } catch (err) {
            setError('Error loading tasks');
            console.error('Error loading tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        if (!user) return;

        let filtered = [...tasks];

        // El filtrado por usuario ya se maneja en el backend
        // Solo aplicamos filtros adicionales aquí

        // Filtro por término de búsqueda
        if (searchTerm) {
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtro por estado
        if (statusFilter !== 'all') {
            filtered = filtered.filter(task => task.status === statusFilter);
        }

        // Filtro por prioridad
        if (priorityFilter !== 'all') {
            filtered = filtered.filter(task => task.priority === priorityFilter);
        }

        setFilteredTasks(filtered);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setPriorityFilter('all');
        setShowAllTasks(false);
    };

    const handleCreateTask = async (taskData: {
        title: string;
        description: string;
        status: "pending" | "in-progress" | "completed";
        priority: "low" | "medium" | "high";
        dueDate: string;
        assignedTo: string;
        project?: string;
    }) => {
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
        <div className="min-h-screen mt-18 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => window.location.href = '/'}
                                className="flex items-center text-slate-600 hover:text-slate-900 transition-colors duration-200 group"
                            >
                                <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div className="hidden sm:block w-px h-6 bg-slate-300"></div>
                            <div className="flex items-center">
                                <div className="bg-slate-100 p-2 rounded-lg mr-3">
                                    <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-xl font-semibold text-slate-900">Tareas</h1>
                                    <p className="text-sm text-slate-600">Administra tus tareas eficientemente</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Nueva Tarea</span>
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
                                <p className="text-sm font-medium text-gray-600">Tareas Totales</p>
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
                                <p className="text-sm font-medium text-gray-600">En progreso</p>
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
                                <p className="text-sm font-medium text-gray-600">Completada</p>
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
                                <p className="text-sm font-medium text-gray-600">Alta Prioridad</p>
                                <p className="text-2xl font-bold text-gray-900">{tasks.filter(t => t.priority === 'high').length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            {/* Search Input */}
                            <div className="relative flex-1 max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar tarea..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="all">Cualquier estado</option>
                                <option value="pending">📋 Pendiente</option>
                                <option value="in-progress">⚡ En Progreso</option>
                                <option value="completed">✅ Completada</option>
                            </select>

                            {/* Priority Filter */}
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="all">Cualquier prioridad</option>
                                <option value="low">🟢 Baja Prioridad</option>
                                <option value="medium">🟡 Media Prioridad</option>
                                <option value="high">🔴 Alta Prioridad</option>
                            </select>
                        </div>

                        <div className="flex gap-2">
                            {/* Admin Toggle - Solo para administradores */}
                            {user?.role === 'admin' && (
                                <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                                    <input
                                        type="checkbox"
                                        checked={showAllTasks}
                                        onChange={(e) => setShowAllTasks(e.target.checked)}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-blue-800">Mostrar todas las tareas</span>
                                </label>
                            )}

                            {/* Clear Filters Button */}
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    </div>

                    {/* Filter Summary */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        {searchTerm && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Search: "{searchTerm}"
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        {statusFilter !== 'all' && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Status: {statusFilter}
                                <button
                                    onClick={() => setStatusFilter('all')}
                                    className="ml-2 text-green-600 hover:text-green-800"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        {priorityFilter !== 'all' && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                Priority: {priorityFilter}
                                <button
                                    onClick={() => setPriorityFilter('all')}
                                    className="ml-2 text-orange-600 hover:text-orange-800"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        {user?.role === 'admin' && showAllTasks && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                Mostrando todas las tareas
                            </span>
                        )}
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
                        <p className="mt-4 text-lg text-gray-600 font-medium">Cargando tus tareas...</p>
                        <p className="text-sm text-gray-400">Esto debería tomar solo un momento</p>
                    </div>
                ) : (
                    <>
                        {/* Tasks Grid */}
                        {filteredTasks.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="bg-gray-100 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                                    <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    {tasks.length === 0 ? 'No tenes tareas' : 'No hay tareas con estos filtros'}
                                </h3>
                                <p className="text-lg text-gray-500 mb-8 max-w-md mx-auto">
                                    {tasks.length === 0
                                        ? (user?.role === 'admin'
                                            ? 'Empeza a ser productivo crando tu primera tarea. ¡Tú puedes hacerlo!'
                                            : 'No se te han asignado tareas aún. Vuelve más tarde o contacta a tu gerente de proyecto.')
                                        : 'Intenta ajustar tus criterios de búsqueda o limpiar los filtros para ver más resultados.'
                                    }
                                </p>
                                {tasks.length === 0 && (
                                    <button
                                        onClick={() => setShowCreateForm(true)}
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 inline-flex items-center space-x-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span>Crea tu primera tarea</span>
                                    </button>
                                )}
                                {filteredTasks.length === 0 && tasks.length > 0 && (
                                    <button
                                        onClick={clearFilters}
                                        className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 inline-flex items-center space-x-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        <span>Clear all filters</span>
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredTasks.map((task) => (
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
                    isOpen={showCreateForm}
                    onClose={() => setShowCreateForm(false)}
                    onSubmit={handleCreateTask}
                />
            )}

            {/* Delete Confirmation Modal */}
            {taskToDelete && (
                <ConfirmDelete
                    isOpen={!!taskToDelete}
                    taskTitle={taskToDelete.title}
                    onConfirm={() => handleDeleteTask(taskToDelete._id)}
                    onClose={() => setTaskToDelete(null)}
                />
            )}
        </div>
    );
}

// Componente Modal para crear tareas

