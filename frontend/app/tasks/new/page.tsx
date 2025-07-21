"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewTask() {
    const { user } = useAuth();
    const { addTask } = useTasks();
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending' as const,
        priority: 'medium' as const,
        dueDate: ''
    });

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert('Por favor, ingresa un título para la tarea');
            return;
        }

        addTask({
            title: formData.title.trim(),
            description: formData.description.trim(),
            status: formData.status,
            priority: formData.priority,
            dueDate: formData.dueDate || null
        });

        router.push('/tasks');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-3xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <Link
                            href="/tasks"
                            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h1 className="text-3xl font-bold text-slate-900">Nueva Tarea</h1>
                    </div>
                    <p className="text-slate-600">
                        Crea una nueva tarea y mantén tu trabajo organizado
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block  text-sm font-medium text-slate-700 mb-2">
                                Título de la tarea *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full text-black/50 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Ej: Revisar documentación del proyecto"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                                Descripción
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full text-black/50 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                placeholder="Describe los detalles de la tarea..."
                            />
                        </div>

                        {/* Priority and Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="priority" className="block text-sm font-medium text-slate-700 mb-2">
                                    Prioridad
                                </label>
                                <select
                                    id="priority"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="w-full text-black/50 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="low">Baja</option>
                                    <option value="medium">Media</option>
                                    <option value="high">Alta</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-2">
                                    Estado inicial
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full text-black/50 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="pending">Pendiente</option>
                                    <option value="in-progress">En Progreso</option>
                                </select>
                            </div>
                        </div>

                        {/* Due Date */}
                        <div>
                            <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700 mb-2">
                                Fecha de vencimiento (opcional)
                            </label>
                            <input
                                type="date"
                                id="dueDate"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                className="w-full text-black/50 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
                            <Link
                                href="/tasks"
                                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Crear Tarea
                            </button>
                        </div>
                    </form>
                </div>

                {/* Tips */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Consejos para crear tareas efectivas</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Usa títulos claros y específicos</li>
                        <li>• Establece prioridades para organizarte mejor</li>
                        <li>• Agrega fechas de vencimiento para tareas importantes</li>
                        <li>• Incluye detalles relevantes en la descripción</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
