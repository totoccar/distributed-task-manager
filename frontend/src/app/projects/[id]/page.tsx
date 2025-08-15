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
    PlayCircle,
    Trash2,
    MoreHorizontal
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { projectService, taskService, Task, userService } from '@/services/api';
import CreateTaskModal from '@/app/tasks/components/CreateTaskModal';
import ConfirmModal from '@/components/ConfirmModal';
import EditProjectModal from '@/components/EditProjectModal';

interface ProjectTask {
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
    project?: string;
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
    tasks: ProjectTask[];
    createdAt: string;
    updatedAt: string;
}

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
    const [editingTask, setEditingTask] = useState<ProjectTask | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<ProjectTask | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [availableUsers, setAvailableUsers] = useState<any[]>([]);
    const { user, token } = useAuth();

    useEffect(() => {
        if (params.id) {
            fetchProject();
            fetchAvailableUsers();
        }
    }, [params.id]);

    const fetchAvailableUsers = async () => {
        try {
            const users = await userService.getAllUsers();
            setAvailableUsers(users);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchProject = async () => {
        try {
            const data = await projectService.getProject(params.id as string);
            setProject(data);
        } catch (error) {
            console.error('Error:', error);
            router.push('/projects');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (taskData: Partial<Task>) => {
        try {
            // Preparar los datos de la tarea para enviar al backend
            const taskForBackend = {
                title: taskData.title,
                description: taskData.description,
                status: taskData.status,
                priority: taskData.priority,
                dueDate: taskData.dueDate,
                project: params.id as string,
                assignedTo: taskData.assignedTo || undefined // Solo incluir si se seleccionó un usuario
            };

            await taskService.createTask(taskForBackend);
            // Refrescar los datos del proyecto para mostrar la nueva tarea
            await fetchProject();
            setShowCreateTaskModal(false);
        } catch (error) {
            console.error('Error creating task:', error);
            throw error; // Permitir que el modal maneje el error
        }
    };

    const handleEditTask = async (taskData: Partial<Task>) => {
        if (!editingTask) return;

        try {
            const taskForBackend = {
                title: taskData.title,
                description: taskData.description,
                status: taskData.status,
                priority: taskData.priority,
                dueDate: taskData.dueDate,
                assignedTo: taskData.assignedTo || undefined // Solo incluir si se seleccionó un usuario
            };

            await taskService.updateTask(editingTask._id, taskForBackend);
            await fetchProject();
            setEditingTask(null);
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        try {
            await taskService.deleteTask(taskId);
            await fetchProject();
            setTaskToDelete(null);
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Error al eliminar la tarea');
        }
    };

    const convertTaskForModal = (task: ProjectTask): Partial<Task> => {
        return {
            _id: task._id,
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate,
            assignedTo: task.assignedTo?._id, // Convertir objeto a ID
            project: task.project,
            createdAt: task.createdAt,
            updatedAt: task.createdAt // Usar createdAt como fallback
        };
    };

    const confirmDeleteTask = (task: ProjectTask) => {
        setTaskToDelete(task);
    };

    const handleUpdateProject = async (updatedData: any) => {
        try {
            await projectService.updateProject(params.id as string, updatedData);
            await fetchProject(); // Refrescar los datos
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating project:', error);
            throw error;
        }
    };

    const handleDeleteProject = async (projectId: string) => {
        try {
            console.log('Attempting to delete project with ID:', projectId);
            const result = await projectService.deleteProject(projectId);
            console.log('Delete result:', result);
            router.push('/projects'); // Redirigir a la lista de proyectos
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Error al eliminar el proyecto: ' + (error as any)?.response?.data?.message || (error as any)?.message || 'Error desconocido');
            throw error;
        }
    };

    // Obtener usuarios que pertenecen al proyecto (manager + usuarios asignados)
    const getProjectUsers = () => {
        if (!project) return [];

        const projectUsers = [];

        // Agregar el manager
        projectUsers.push({
            _id: project.manager._id,
            name: project.manager.name,
            email: project.manager.email
        });

        // Agregar usuarios asignados
        project.assignedUsers.forEach(assignment => {
            projectUsers.push({
                _id: assignment.user._id,
                name: assignment.user.name,
                email: assignment.user.email
            });
        });

        return projectUsers;
    }; const handleToggleTaskStatus = async (task: ProjectTask) => {
        let newStatus: 'pending' | 'in-progress' | 'completed';

        switch (task.status) {
            case 'pending':
                newStatus = 'in-progress';
                break;
            case 'in-progress':
                newStatus = 'completed';
                break;
            case 'completed':
                newStatus = 'pending';
                break;
            default:
                newStatus = 'pending';
        }

        try {
            await taskService.updateTask(task._id, { status: newStatus });
            await fetchProject();
        } catch (error) {
            console.error('Error updating task status:', error);
            alert('Error al actualizar el estado de la tarea');
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
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => window.location.href = '/projects'}
                            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
                        >
                            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="hidden sm:block w-px mr-8 h-6 bg-gray-300"></div>

                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-slate-800">{project.name}</h1>
                        <p className="text-slate-600 mt-1">{project.description}</p>
                    </div>
                    {isProjectManager && (
                        <Button
                            variant="outline"
                            className="border-slate-200 text-slate-600"
                            onClick={() => setShowEditModal(true)}
                        >
                            <Settings className="h-4 w-4 mr-2" />
                            Configurar
                        </Button>
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
                                        onClick={() => setShowCreateTaskModal(true)}
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
                                                className="flex items-center gap-4 p-4 bg-white/50 rounded-lg border border-blue-100 hover:shadow-md transition-shadow group"
                                            >
                                                <button
                                                    onClick={() => handleToggleTaskStatus(task)}
                                                    className="flex-shrink-0 hover:scale-110 transition-transform"
                                                >
                                                    {getTaskStatusIcon(task.status)}
                                                </button>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-slate-800 truncate">{task.title}</h4>
                                                    <p className="text-sm text-slate-600 truncate">{task.description}</p>
                                                    {task.dueDate && (
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            Vence: {formatDate(task.dueDate)}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="text-right">
                                                        <div className="flex gap-1 mb-1">
                                                            <Badge className={getPriorityColor(task.priority)} variant="outline">
                                                                {task.priority}
                                                            </Badge>
                                                            <Badge className={getStatusColor(task.status)} variant="outline">
                                                                {task.status}
                                                            </Badge>
                                                        </div>
                                                        {task.assignedTo && (
                                                            <p className="text-xs text-slate-500">
                                                                {task.assignedTo.name}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => setEditingTask(task)}
                                                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                            title="Editar tarea"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => confirmDeleteTask(task)}
                                                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                            title="Eliminar tarea"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
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
                                            onClick={() => setShowCreateTaskModal(true)}
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

                {/* Create/Edit Task Modal */}
                {(showCreateTaskModal || editingTask) && (
                    <CreateTaskModal
                        isOpen={showCreateTaskModal || !!editingTask}
                        onClose={() => {
                            setShowCreateTaskModal(false);
                            setEditingTask(null);
                        }}
                        onSubmit={editingTask ? handleEditTask : handleCreateTask}
                        initialData={editingTask ? convertTaskForModal(editingTask) : undefined}
                        title={editingTask ? 'Editar Tarea' : 'Crear Nueva Tarea'}
                        availableUsers={getProjectUsers()}
                    />
                )}

                {/* Delete Task Confirmation Modal */}
                <ConfirmModal
                    isOpen={!!taskToDelete}
                    onClose={() => setTaskToDelete(null)}
                    onConfirm={() => taskToDelete && handleDeleteTask(taskToDelete._id)}
                    title="Eliminar Tarea"
                    message={`¿Estás seguro de que quieres eliminar la tarea "${taskToDelete?.title}"? Esta acción no se puede deshacer.`}
                    confirmText="Eliminar"
                    cancelText="Cancelar"
                    type="danger"
                />

                {/* Edit Project Modal */}
                {showEditModal && project && (
                    <EditProjectModal
                        isOpen={showEditModal}
                        onClose={() => setShowEditModal(false)}
                        project={project}
                        availableUsers={availableUsers}
                        onSubmit={handleUpdateProject}
                        onDelete={handleDeleteProject}
                    />
                )}
            </div>
        </div>
    );
}
