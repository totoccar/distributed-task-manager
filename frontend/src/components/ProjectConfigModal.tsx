'use client';

import { useState, useEffect } from 'react';
import { X, Settings, Users, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface User {
    _id: string;
    name: string;
    email: string;
}

interface ProjectAssignment {
    user: User;
    role: string;
}

interface Project {
    _id: string;
    name: string;
    description: string;
    deadline?: string;
    assignedUsers: ProjectAssignment[];
    manager: User;
}

interface ProjectConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: Project;
    availableUsers: User[];
    onSubmit: (updatedProject: Partial<Project>) => Promise<void>;
}

const AVAILABLE_ROLES = [
    { value: 'developer', label: 'Developer', color: 'bg-blue-100 text-blue-800' },
    { value: 'designer', label: 'Designer', color: 'bg-purple-100 text-purple-800' },
    { value: 'tester', label: 'Tester', color: 'bg-green-100 text-green-800' },
    { value: 'analyst', label: 'Analyst', color: 'bg-orange-100 text-orange-800' },
    { value: 'lead', label: 'Lead', color: 'bg-red-100 text-red-800' }
];

export default function ProjectConfigModal({
    isOpen,
    onClose,
    project,
    availableUsers,
    onSubmit
}: ProjectConfigModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        deadline: ''
    });
    const [assignments, setAssignments] = useState<ProjectAssignment[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (project && isOpen) {
            setFormData({
                name: project.name,
                description: project.description,
                deadline: project.deadline ? project.deadline.split('T')[0] : ''
            });
            setAssignments(project.assignedUsers);
        }
    }, [project, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await onSubmit({
                name: formData.name,
                description: formData.description,
                deadline: formData.deadline,
                assignedUsers: assignments
            });
            onClose();
        } catch (error) {
            console.error('Error updating project:', error);
        } finally {
            setLoading(false);
        }
    };

    const addUserToProject = (user: User) => {
        if (!assignments.find(a => a.user._id === user._id)) {
            setAssignments([...assignments, {
                user,
                role: 'developer'
            }]);
        }
    };

    const removeUserFromProject = (userId: string) => {
        setAssignments(assignments.filter(a => a.user._id !== userId));
    };

    const updateUserRole = (userId: string, newRole: string) => {
        setAssignments(assignments.map(a =>
            a.user._id === userId ? { ...a, role: newRole } : a
        ));
    };

    const getRoleColor = (role: string) => {
        const roleConfig = AVAILABLE_ROLES.find(r => r.value === role);
        return roleConfig?.color || 'bg-gray-100 text-gray-800';
    };

    const unassignedUsers = availableUsers.filter(user =>
        !assignments.find(a => a.user._id === user._id) &&
        user._id !== project.manager._id
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform animate-in zoom-in duration-200">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="bg-blue-100 p-3 rounded-xl mr-4">
                                <Settings className="w-6 h-6 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Configurar Proyecto</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {/* Project Info Section */}
                    <div className="mb-8">
                        <div className="flex items-center mb-4">
                            <FileText className="w-5 h-5 text-blue-600 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-900">Información del Proyecto</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Nombre del Proyecto *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full text-gray-700 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Fecha Límite
                                </label>
                                <input
                                    type="date"
                                    value={formData.deadline}
                                    onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                                    className="w-full text-gray-700 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Descripción
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={3}
                                className="w-full text-gray-700 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                            />
                        </div>
                    </div>

                    {/* Team Management Section */}
                    <div className="mb-8">
                        <div className="flex items-center mb-4">
                            <Users className="w-5 h-5 text-blue-600 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-900">Gestión del Equipo</h3>
                        </div>

                        {/* Current Manager */}
                        <div className="mb-6">
                            <h4 className="text-md font-medium text-gray-700 mb-3">Manager del Proyecto</h4>
                            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                                    {project.manager.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{project.manager.name}</p>
                                    <p className="text-sm text-gray-600">{project.manager.email}</p>
                                </div>
                                <Badge className="ml-auto bg-blue-100 text-blue-800 border-blue-200">
                                    Manager
                                </Badge>
                            </div>
                        </div>

                        {/* Assigned Users */}
                        <div className="mb-6">
                            <h4 className="text-md font-medium text-gray-700 mb-3">Miembros Asignados</h4>
                            {assignments.length > 0 ? (
                                <div className="space-y-3">
                                    {assignments.map((assignment) => (
                                        <div key={assignment.user._id} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                            <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-medium">
                                                {assignment.user.name.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{assignment.user.name}</p>
                                                <p className="text-sm text-gray-600">{assignment.user.email}</p>
                                            </div>
                                            <select
                                                value={assignment.role}
                                                onChange={(e) => updateUserRole(assignment.user._id, e.target.value)}
                                                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                {AVAILABLE_ROLES.map(role => (
                                                    <option key={role.value} value={role.value}>
                                                        {role.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                type="button"
                                                onClick={() => removeUserFromProject(assignment.user._id)}
                                                className="px-3 py-1 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-4">No hay miembros asignados al proyecto</p>
                            )}
                        </div>

                        {/* Available Users */}
                        {unassignedUsers.length > 0 && (
                            <div>
                                <h4 className="text-md font-medium text-gray-700 mb-3">Usuarios Disponibles</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-y-auto">
                                    {unassignedUsers.map((user) => (
                                        <div key={user._id} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 truncate">{user.name}</p>
                                                <p className="text-xs text-gray-600 truncate">{user.email}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => addUserToProject(user)}
                                                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                            >
                                                Agregar
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
