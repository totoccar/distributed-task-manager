'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Calendar,
    Users,
    BarChart3,
    Clock,
    Plus,
    Edit,
    Settings,
    CheckCircle,
    Circle,
    PlayCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    assignedTo?: {
        _id: string;
        name: string;
        email: string;
    };
    createdBy: {
        _id: string;
        name: string;
        email: string;
    };
    createdAt: string;
}

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
    tasks: Task[];
    createdAt: string;
    updatedAt: string;
}

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const { user, token } = useAuth();

    useEffect(() => {
        if (params.id) {
            fetchProject();
        }
    }, [params.id]);

    const fetchProject = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/projects/${params.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setProject(data);
            } else {
                console.error('Error fetching project');
                router.push('/projects');
            }
        } catch (error) {
            console.error('Error:', error);
            router.push('/projects');
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

    const getTaskStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'in-progress':
                return <PlayCircle className="h-4 w-4 text-blue-600" />;
            default:
                return <Circle className="h-4 w-4 text-gray-400" />;
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'No definido';
        return new Date(dateString).toLocaleDateString('es-ES');
    };

    const isProjectManager = project?.manager._id === user?._id || user?.role === 'admin';

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50/30 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-blue-200 rounded w-1/4 mb-6"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 h-96 bg-blue-100 rounded-lg"></div>
                            <div className="h-96 bg-blue-100 rounded-lg"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50/30 p-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-2xl font-bold text-slate-800 mb-4">Proyecto no encontrado</h1>
                    <Button onClick={() => router.push('/projects')}>
                        Volver a Proyectos
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50/30 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/projects')}
                        className="text-slate-600 hover:text-slate-800"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-slate-800">{project.name}</h1>
                        <p className="text-slate-600 mt-1">{project.description}</p>
                    </div>
                    {isProjectManager && (
                        <div className="flex gap-2">
                            <Button variant="outline" className="border-blue-200 text-blue-700">
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                            </Button>
                            <Button variant="outline" className="border-slate-200 text-slate-600">
                                <Settings className="h-4 w-4 mr-2" />
                                Configurar
                            </Button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Project Stats */}
                        <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-blue-600" />
                                    Estadísticas del Proyecto
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-700">{project.tasks?.length || 0}</div>
                                        <div className="text-sm text-slate-600">Total Tareas</div>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-lg">
                                        <div className="text-2xl font-bold text-green-700">
                                            {project.tasks?.filter(t => t.status === 'completed').length || 0}
                                        </div>
                                        <div className="text-sm text-slate-600">Completadas</div>
                                    </div>
                                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                                        <div className="text-2xl font-bold text-orange-700">
                                            {project.tasks?.filter(t => t.status === 'in-progress').length || 0}
                                        </div>
                                        <div className="text-sm text-slate-600">En Progreso</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className="text-2xl font-bold text-gray-700">
                                            {project.tasks?.filter(t => t.status === 'pending').length || 0}
                                        </div>
                                        <div className="text-sm text-slate-600">Pendientes</div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-6">
                                    <div className="flex justify-between text-sm text-slate-600 mb-2">
                                        <span>Progreso General</span>
                                        <span>{Math.round(project.progress)}%</span>
                                    </div>
                                    <div className="w-full bg-blue-100 rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-blue-600 to-blue-700 h-3 rounded-full transition-all duration-500"
                                            style={{ width: `${project.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tasks */}
                        <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>Tareas del Proyecto</CardTitle>
                                    <Button
                                        onClick={() => router.push(`/tasks?project=${project._id}`)}
                                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Nueva Tarea
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {project.tasks && project.tasks.length > 0 ? (
                                    <div className="space-y-3">
                                        {project.tasks.map((task) => (
                                            <div
                                                key={task._id}
                                                className="flex items-center gap-4 p-4 bg-white/50 rounded-lg border border-blue-100 hover:shadow-md transition-shadow cursor-pointer"
                                                onClick={() => router.push(`/tasks/${task._id}`)}
                                            >
                                                {getTaskStatusIcon(task.status)}
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-slate-800">{task.title}</h4>
                                                    <p className="text-sm text-slate-600 truncate">{task.description}</p>
                                                </div>
                                                <div className="text-right">
                                                    <Badge className={getPriorityColor(task.priority)} variant="outline">
                                                        {task.priority}
                                                    </Badge>
                                                    {task.assignedTo && (
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {task.assignedTo.name}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                                            <BarChart3 className="h-8 w-8 text-blue-600" />
                                        </div>
                                        <h3 className="text-lg font-medium text-slate-800 mb-2">
                                            No hay tareas aún
                                        </h3>
                                        <p className="text-slate-600 mb-4">
                                            Comienza agregando la primera tarea a este proyecto
                                        </p>
                                        <Button
                                            onClick={() => router.push(`/tasks?project=${project._id}`)}
                                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Crear Primera Tarea
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Project Info */}
                        <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
                            <CardHeader>
                                <CardTitle>Información del Proyecto</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Estado:</span>
                                    <Badge className={getStatusColor(project.status)}>
                                        {project.status}
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Prioridad:</span>
                                    <Badge className={getPriorityColor(project.priority)}>
                                        {project.priority}
                                    </Badge>
                                </div>
                                <hr className="border-blue-100" />
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm text-slate-600">
                                        <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                                        <span>Inicio: {formatDate(project.startDate)}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-slate-600">
                                        <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                                        <span>Fin: {formatDate(project.endDate)}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-slate-600">
                                        <Clock className="h-4 w-4 mr-2 text-blue-600" />
                                        <span>Deadline: {formatDate(project.deadline)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Team Members */}
                        <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-blue-600" />
                                    Equipo del Proyecto
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {/* Manager */}
                                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                            {project.manager.name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-800">{project.manager.name}</p>
                                            <p className="text-xs text-slate-600">Manager</p>
                                        </div>
                                    </div>

                                    {/* Team Members */}
                                    {project.assignedUsers.map((assignment) => (
                                        <div key={assignment.user._id} className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                                            <div className="w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                {assignment.user.name.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-slate-800">{assignment.user.name}</p>
                                                <p className="text-xs text-slate-600 capitalize">{assignment.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
