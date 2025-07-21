"use client"

import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
    const { user } = useAuth();
    const { tasks, getTasksByStatus, getTasksByPriority } = useTasks();
    const router = useRouter();

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

    const pendingTasks = getTasksByStatus('pending');
    const inProgressTasks = getTasksByStatus('in-progress');
    const completedTasks = getTasksByStatus('completed');
    const highPriorityTasks = getTasksByPriority('high');

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Bienvenido, {user.name}
                    </h1>
                    <p className="text-slate-600 mt-2">
                        Aquí tienes un resumen de tus tareas y proyectos
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-600">Pendientes</p>
                                <p className="text-2xl font-bold text-slate-900">{pendingTasks.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-600">En Progreso</p>
                                <p className="text-2xl font-bold text-slate-900">{inProgressTasks.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-600">Completadas</p>
                                <p className="text-2xl font-bold text-slate-900">{completedTasks.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-600">Alta Prioridad</p>
                                <p className="text-2xl font-bold text-slate-900">{highPriorityTasks.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Tasks */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-slate-900">
                                    Tareas Recientes
                                </h3>
                                <Link
                                    href="/tasks"
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    Ver todas
                                </Link>
                            </div>
                        </div>
                        <div className="p-6">
                            {tasks.slice(0, 6).length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {tasks.slice(0, 6).map((task) => (
                                        <div
                                            key={task.id}
                                            className={`relative p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 aspect-square ${task.priority === 'high' ? 'bg-gradient-to-br from-red-50 to-red-100 border-l-4 border-red-400' :
                                                    task.priority === 'medium' ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-4 border-yellow-400' :
                                                        'bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-400'
                                                }`}
                                        >
                                            {/* Status dot */}
                                            <div className="absolute top-3 right-3">
                                                <div className={`w-2 h-2 rounded-full ${task.status === 'completed' ? 'bg-green-500' :
                                                        task.status === 'in-progress' ? 'bg-blue-500' : 'bg-yellow-500'
                                                    }`}></div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex flex-col h-full">
                                                <h4 className="text-sm font-semibold text-slate-900 mb-2 line-clamp-2">{task.title}</h4>
                                                <p className="text-xs text-slate-600 mb-3 flex-1 line-clamp-4">{task.description}</p>

                                                <div className="flex items-center justify-between text-xs">
                                                    <span className={`px-2 py-1 rounded-full font-medium ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                            task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {task.status === 'completed' ? 'Completada' :
                                                            task.status === 'in-progress' ? 'En progreso' : 'Pendiente'}
                                                    </span>
                                                    <span className="text-slate-500">
                                                        {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-500 text-center py-8">
                                    No tienes tareas aún. ¡Crea tu primera tarea!
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                        <div className="p-6 border-b border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-900">
                                Acciones Rápidas
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <Link
                                href="/tasks/new"
                                className="block w-full p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                            >
                                <div className="flex items-center">
                                    <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <div>
                                        <p className="font-medium text-blue-900">Nueva Tarea</p>
                                        <p className="text-sm text-blue-600">Crear una nueva tarea</p>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                href="/tasks"
                                className="block w-full p-4 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                            >
                                <div className="flex items-center">
                                    <svg className="w-6 h-6 text-slate-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                    <div>
                                        <p className="font-medium text-slate-900">Ver Todas las Tareas</p>
                                        <p className="text-sm text-slate-600">Gestionar todas tus tareas</p>
                                    </div>
                                </div>
                            </Link>

                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center">
                                    <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2 2z" />
                                    </svg>
                                    <div>
                                        <p className="font-medium text-green-900">Progreso del Día</p>
                                        <p className="text-sm text-green-600">
                                            {completedTasks.length} de {tasks.length} tareas completadas
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
