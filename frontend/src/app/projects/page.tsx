'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Users, BarChart3, Clock } from 'lucide-react';
import CreateProjectModal from './components/CreateProjectModal';
import { useAuth } from '@/contexts/AuthContext';
import { projectService } from '@/services/api';

interface Project {
    _id: string;
    name: string;
    description: string;
    status: 'planning' | 'active' | 'on-hold' | 'completed';
    priority: 'low' | 'medium' | 'high';
    progress: number;
    startDate?: string;
    endDate?: string;
    deadline?: string;
    manager: {
        _id: string;
        name: string;
        email: string;
    };
    assignedUsers: Array<{
        user: {
            _id: string;
            name: string;
            email: string;
        };
        role: string;
    }>;
    createdAt: string;
    updatedAt: string;
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { user, token } = useAuth();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const data = await projectService.getAllProjects();
            setProjects(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'planning':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'active':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'on-hold':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'completed':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'medium':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'low':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'No definido';
        return new Date(dateString).toLocaleDateString('es-ES');
    };

    const canCreateProject = user?.role === 'admin' || user?.role === 'manager';

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50/30 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-blue-200 rounded w-1/4 mb-6"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-64 bg-blue-100 rounded-lg"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50/30 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">Proyectos</h1>
                        <p className="text-slate-600">
                            Gestiona y supervisa todos tus proyectos
                        </p>
                    </div>
                    {canCreateProject && (
                        <Button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Nuevo Proyecto
                        </Button>
                    )}
                </div>

                {/* Projects Grid */}
                {projects.length === 0 ? (
                    <Card className="border-2 border-dashed border-blue-200 bg-white/60 backdrop-blur-sm">
                        <CardContent className="p-12 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                                <BarChart3 className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">
                                No hay proyectos aún
                            </h3>
                            <p className="text-slate-600 mb-6 max-w-md mx-auto">
                                Comienza creando tu primer proyecto para organizar y gestionar tus tareas de manera eficiente.
                            </p>
                            {canCreateProject && (
                                <Button
                                    onClick={() => setShowCreateModal(true)}
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Crear mi primer proyecto
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <Card
                                key={project._id}
                                className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                                onClick={() => window.location.href = `/projects/${project._id}`}
                            >
                                <CardHeader className="pb-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <CardTitle className="text-lg font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                                            {project.name}
                                        </CardTitle>
                                        <div className="flex gap-2">
                                            <Badge className={getPriorityColor(project.priority)}>
                                                {project.priority}
                                            </Badge>
                                            <Badge className={getStatusColor(project.status)}>
                                                {project.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardDescription className="text-slate-600">
                                        {project.description || 'Sin descripción'}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="pt-0">
                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm text-slate-600 mb-1">
                                            <span>Progreso</span>
                                            <span>{project.progress}%</span>
                                        </div>
                                        <div className="w-full bg-blue-100 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${project.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Project Info */}
                                    <div className="space-y-3">
                                        <div className="flex items-center text-sm text-slate-600">
                                            <Users className="h-4 w-4 mr-2 text-blue-600" />
                                            <span>Manager: {project.manager.name}</span>
                                        </div>

                                        <div className="flex items-center text-sm text-slate-600">
                                            <Users className="h-4 w-4 mr-2 text-blue-600" />
                                            <span>{project.assignedUsers.length} miembros</span>
                                        </div>

                                        {project.deadline && (
                                            <div className="flex items-center text-sm text-slate-600">
                                                <Clock className="h-4 w-4 mr-2 text-blue-600" />
                                                <span>Deadline: {formatDate(project.deadline)}</span>
                                            </div>
                                        )}

                                        {project.startDate && (
                                            <div className="flex items-center text-sm text-slate-600">
                                                <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                                                <span>Inicio: {formatDate(project.startDate)}</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Create Project Modal */}
                {showCreateModal && (
                    <CreateProjectModal
                        isOpen={showCreateModal}
                        onClose={() => setShowCreateModal(false)}
                        onProjectCreated={() => {
                            fetchProjects();
                            setShowCreateModal(false);
                        }}
                    />
                )}
            </div>
        </div>
    );
}
