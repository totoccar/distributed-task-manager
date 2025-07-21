"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks, type Task } from '../context/TaskContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Tasks() {
    const { user } = useAuth();
    const { tasks, updateTask, deleteTask } = useTasks();
    const router = useRouter();
    const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
    const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600">Cargando...</p>
                </div>
            </div>
        );
    }

    const filteredTasks = tasks.filter(task => {
        const statusMatch = filter === 'all' || task.status === filter;
        const priorityMatch = priorityFilter === 'all' || task.priority === priorityFilter;
        return statusMatch && priorityMatch;
    });

    const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
        updateTask(taskId, { status: newStatus });
    };

    const handleDelete = (taskId: string) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
            deleteTask(taskId);
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-600 bg-red-100';
            case 'medium': return 'text-yellow-600 bg-yellow-100';
            case 'low': return 'text-green-600 bg-green-100';
            default: return 'text-slate-600 bg-slate-100';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-green-600 bg-green-100';
            case 'in-progress': return 'text-blue-600 bg-blue-100';
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            default: return 'text-slate-600 bg-slate-100';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Mis Tareas</h1>
                        <p className="text-slate-600 mt-2">
                            Gestiona y organiza todas tus tareas
                        </p>
                    </div>
                    <Link
                        href="/tasks/new"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
                    >
                        Nueva Tarea
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
                    <div className="flex flex-wrap gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Estado</label>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value as any)}
                                className="border text-black/70 border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">Todos</option>
                                <option value="pending">Pendientes</option>
                                <option value="in-progress">En Progreso</option>
                                <option value="completed">Completadas</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Prioridad</label>
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value as any)}
                                className="border text-black/70 border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">Todas</option>
                                <option value="high">Alta</option>
                                <option value="medium">Media</option>
                                <option value="low">Baja</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tasks List */}
                <div>
                    {filteredTasks.length === 0 ? (
                        <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-200 text-center">
                            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <h3 className="text-lg font-medium text-slate-900 mb-2">No hay tareas</h3>
                            <p className="text-slate-600 mb-4">
                                {filter === 'all' ? 'Aún no tienes tareas creadas.' : `No hay tareas con el filtro seleccionado.`}
                            </p>
                            <Link
                                href="/tasks/new"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                            >
                                Crear Primera Tarea
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className={`relative aspect-square p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${task.priority === 'high' ? 'bg-gradient-to-br from-red-50 to-red-100 border-l-4 border-red-400' :
                                            task.priority === 'medium' ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-4 border-yellow-400' :
                                                'bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-400'
                                        }`}
                                >
                                    {/* Status Indicator */}
                                    <div className="absolute top-4 right-4">
                                        <div className={`w-3 h-3 rounded-full ${task.status === 'completed' ? 'bg-green-500' :
                                                task.status === 'in-progress' ? 'bg-blue-500' : 'bg-yellow-500'
                                            }`}></div>
                                    </div>

                                    {/* Priority Badge */}
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                                            {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-col h-full pt-8">
                                        <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2">{task.title}</h3>

                                        <p className="text-slate-700 text-sm mb-4 flex-1 line-clamp-4">{task.description}</p>

                                        {/* Status Badge */}
                                        <div className="mb-4">
                                            <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(task.status)}`}>
                                                {task.status === 'completed' ? 'Completada' :
                                                    task.status === 'in-progress' ? 'En Progreso' : 'Pendiente'}
                                            </span>
                                        </div>

                                        {/* Date Info */}
                                        <div className="text-xs text-slate-500 mb-4">
                                            {task.dueDate ? (
                                                <div>Vence: {new Date(task.dueDate).toLocaleDateString()}</div>
                                            ) : (
                                                <div>Creada: {new Date(task.createdAt).toLocaleDateString()}</div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex justify-between items-center">
                                            <select
                                                value={task.status}
                                                onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                                                className="text-xs border border-slate-300 rounded-md px-2 py-1 bg-white/80 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="pending">Pendiente</option>
                                                <option value="in-progress">En Progreso</option>
                                                <option value="completed">Completada</option>
                                            </select>

                                            <div className="flex space-x-1">
                                                <Link
                                                    href={`/tasks/${task.id}/edit`}
                                                    className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-white/80 rounded-md transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>

                                                <button
                                                    onClick={() => handleDelete(task.id)}
                                                    className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-white/80 rounded-md transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
