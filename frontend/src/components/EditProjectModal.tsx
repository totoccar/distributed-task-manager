'use client';

import { useState, useEffect } from 'react';
import { X, Settings, Users, Calendar, FileText, Trash2, AlertTriangle } from 'lucide-react';
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

interface EditProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: Project;
    availableUsers: User[];
    onSubmit: (updatedProject: Partial<Project>) => Promise<void>;
    onDelete: (projectId: string) => Promise<void>;
}

const AVAILABLE_ROLES = [
    { value: 'developer', label: 'Developer', color: 'bg-blue-100 text-blue-800' },
    { value: 'designer', label: 'Designer', color: 'bg-purple-100 text-purple-800' },
    { value: 'tester', label: 'Tester', color: 'bg-green-100 text-green-800' },
    { value: 'analyst', label: 'Analyst', color: 'bg-orange-100 text-orange-800' },
    { value: 'lead', label: 'Lead', color: 'bg-red-100 text-red-800' }
];

export default function EditProjectModal({
    isOpen,
    onClose,
    project,
    availableUsers,
    onSubmit,
    onDelete
}: EditProjectModalProps) {
    const [activeTab, setActiveTab] = useState<'edit' | 'delete'>('edit');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        deadline: ''
    });
    const [assignments, setAssignments] = useState<ProjectAssignment[]>([]);
    const [loading, setLoading] = useState(false);

    // Delete confirmation states
    const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const expectedDeleteText = `Quiero eliminar ${project?.name}`;

    // Función para normalizar texto (quitar tildes y caracteres especiales)
    const normalizeText = (text: string) => {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Quita tildes
            .replace(/[^a-z0-9\s]/g, "") // Quita caracteres especiales excepto espacios
            .trim();
    };

    useEffect(() => {
        if (project && isOpen) {
            setFormData({
                name: project.name,
                description: project.description,
                deadline: project.deadline ? project.deadline.split('T')[0] : ''
            });
            setAssignments(project.assignedUsers);
            // Reset delete form
            setDeleteConfirmationText('');
            setActiveTab('edit');
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

    const handleDelete = async () => {
        console.log('Delete confirmation text:', deleteConfirmationText);
        console.log('Expected text:', expectedDeleteText);
        console.log('Normalized input:', normalizeText(deleteConfirmationText));
        console.log('Normalized expected:', normalizeText(expectedDeleteText));
        console.log('Is valid:', normalizeText(deleteConfirmationText) === normalizeText(expectedDeleteText));

        if (normalizeText(deleteConfirmationText) !== normalizeText(expectedDeleteText)) {
            console.log('Text validation failed');
            return;
        }

        setIsDeleting(true);
        try {
            console.log('Calling onDelete with project ID:', project._id);
            await onDelete(project._id);
            onClose();
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Error al eliminar el proyecto: ' + (error as any)?.message || 'Error desconocido');
        } finally {
            setIsDeleting(false);
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

    const unassignedUsers = availableUsers.filter(user =>
        !assignments.find(a => a.user._id === user._id) &&
        user._id !== project?.manager._id
    );

    const isDeleteValid = normalizeText(deleteConfirmationText) === normalizeText(expectedDeleteText);

    if (!isOpen || !project) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform animate-in zoom-in duration-200">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="bg-slate-100 p-3 rounded-xl mr-4">
                                <Settings className="w-6 h-6 text-slate-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800">Configurar Proyecto</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex mt-4 bg-slate-100 rounded-lg p-1">
                        <button
                            onClick={() => setActiveTab('edit')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${activeTab === 'edit'
                                ? 'bg-white text-slate-800 shadow-sm'
                                : 'text-slate-600 hover:text-slate-800'
                                }`}
                        >
                            Editar Proyecto
                        </button>
                        <button
                            onClick={() => setActiveTab('delete')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${activeTab === 'delete'
                                ? 'bg-white text-slate-800 shadow-sm'
                                : 'text-slate-600 hover:text-slate-800'
                                }`}
                        >
                            Eliminar Proyecto
                        </button>
                    </div>
                </div>

                {activeTab === 'edit' ? (
                    <form onSubmit={handleSubmit} className="p-6">
                        {/* Project Info Section */}
                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <FileText className="w-5 h-5 text-slate-600 mr-2" />
                                <h3 className="text-lg font-semibold text-slate-800">Información del Proyecto</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Nombre del Proyecto *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full text-slate-700 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all duration-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Fecha Límite
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.deadline}
                                        onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                                        className="w-full text-slate-700 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Descripción
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    rows={3}
                                    className="w-full text-slate-700 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all duration-200 resize-none"
                                />
                            </div>
                        </div>

                        {/* Team Management Section */}
                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <Users className="w-5 h-5 text-slate-600 mr-2" />
                                <h3 className="text-lg font-semibold text-slate-800">Gestión del Equipo</h3>
                            </div>

                            {/* Current Manager */}
                            <div className="mb-6">
                                <h4 className="text-md font-medium text-slate-700 mb-3">Manager del Proyecto</h4>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                    <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center text-white font-medium">
                                        {project.manager.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800">{project.manager.name}</p>
                                        <p className="text-sm text-slate-600">{project.manager.email}</p>
                                    </div>
                                    <Badge className="ml-auto bg-slate-100 text-slate-800 border-slate-200">
                                        Manager
                                    </Badge>
                                </div>
                            </div>

                            {/* Assigned Users */}
                            <div className="mb-6">
                                <h4 className="text-md font-medium text-slate-700 mb-3">Miembros Asignados</h4>
                                {assignments.length > 0 ? (
                                    <div className="space-y-3">
                                        {assignments.map((assignment) => (
                                            <div key={assignment.user._id} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                                <div className="w-10 h-10 bg-slate-400 rounded-full flex items-center justify-center text-white font-medium">
                                                    {assignment.user.name.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-slate-800">{assignment.user.name}</p>
                                                    <p className="text-sm text-slate-600">{assignment.user.email}</p>
                                                </div>
                                                <select
                                                    value={assignment.role}
                                                    onChange={(e) => updateUserRole(assignment.user._id, e.target.value)}
                                                    className="px-3 py-1 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white"
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
                                    <p className="text-slate-500 text-center py-4">No hay miembros asignados al proyecto</p>
                                )}
                            </div>

                            {/* Available Users */}
                            {unassignedUsers.length > 0 && (
                                <div>
                                    <h4 className="text-md font-medium text-slate-700 mb-3">Usuarios Disponibles</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-y-auto">
                                        {unassignedUsers.map((user) => (
                                            <div key={user._id} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                                                <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-slate-800 truncate">{user.name}</p>
                                                    <p className="text-xs text-slate-600 truncate">{user.email}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => addUserToProject(user)}
                                                    className="px-3 py-1 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
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
                        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors duration-200"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="p-6">
                        {/* Delete Project Section */}
                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                                <h3 className="text-lg font-semibold text-red-800">Eliminar Proyecto</h3>
                            </div>

                            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                <div className="flex items-start gap-3 mb-4">
                                    <Trash2 className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-red-800 font-medium mb-2">
                                            ¿Estás seguro de que quieres eliminar este proyecto?
                                        </h4>
                                        <p className="text-red-700 text-sm mb-4">
                                            Esta acción no se puede deshacer. Se eliminarán:
                                        </p>
                                        <ul className="text-red-700 text-sm space-y-1 ml-4">
                                            <li>• El proyecto completo</li>
                                            <li>• Todas las tareas asociadas</li>
                                            <li>• Todos los datos relacionados</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <label className="block text-sm font-semibold text-red-800 mb-2">
                                        Para confirmar, escribe exactamente: <span className="font-mono bg-red-100 px-2 py-1 rounded">"{expectedDeleteText}"</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={deleteConfirmationText}
                                        onChange={(e) => setDeleteConfirmationText(e.target.value)}
                                        placeholder={expectedDeleteText}
                                        className="w-full text-slate-700 px-4 py-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                                    />
                                    {deleteConfirmationText && !isDeleteValid && (
                                        <p className="text-red-600 text-sm mt-2">
                                            El texto no coincide. Puedes escribir sin tildes o caracteres especiales.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Danger Zone - Delete Button */}
                        <div className="border-t-2 border-red-200 pt-6">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-red-800 font-medium">Zona de Peligro</h4>
                                        <p className="text-red-600 text-sm">Esta acción eliminará permanentemente el proyecto.</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        disabled={!isDeleteValid || isDeleting}
                                        className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isDeleting ? 'Eliminando...' : 'Eliminar Proyecto Permanentemente'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
