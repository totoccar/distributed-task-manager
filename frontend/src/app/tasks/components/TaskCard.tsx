import { JSX, useState, useEffect } from "react";
import { Task, taskService } from '@/services/api';

interface StatusColorProps {
    status?: "pending" | "in-progress" | "completed";
}

const getStatusColor = (status: StatusColorProps['status']): string => {
    switch (status) {
        case 'completed':
            return 'border-emerald-500 text-slate-700';
        case 'in-progress':
            return 'border-blue-500 text-slate-700';
        default:
            return 'border-slate-400 text-slate-700';
    }
};

const getPriorityColor = (priority: string | undefined) => {
    switch (priority) {
        case 'high':
            return 'border-red-500 text-red-700 bg-red-50';
        case 'medium':
            return 'border-amber-500 text-amber-700 bg-amber-50';
        default:
            return 'border-slate-400 text-slate-700 bg-slate-50';
    }
};

interface TaskCardProps {
    task: Task;
    setTaskToDelete: (task: Task | null) => void;
    onTaskUpdate?: (updatedTask: Task) => void;
}

export default function TaskCard({ task, setTaskToDelete, onTaskUpdate }: TaskCardProps): JSX.Element {
    const [isEditing, setIsEditing] = useState(false);
    const [currentTask, setCurrentTask] = useState<Task>(task);
    const [editData, setEditData] = useState({
        title: task.title,
        description: task.description || '',
        status: task.status || 'pending',
        priority: task.priority || 'medium'
    });

    // Actualizar cuando cambie la prop task
    useEffect(() => {
        setCurrentTask(task);
        setEditData({
            title: task.title,
            description: task.description || '',
            status: task.status || 'pending',
            priority: task.priority || 'medium'
        });
    }, [task]);

    const handleSave = async () => {
        try {
            const updatedTask = await taskService.updateTask(currentTask._id, editData);
            setCurrentTask(updatedTask);
            setIsEditing(false);
            if (onTaskUpdate) {
                onTaskUpdate(updatedTask);
            }
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    const handleCancel = () => {
        setEditData({
            title: currentTask.title,
            description: currentTask.description || '',
            status: currentTask.status || 'pending',
            priority: currentTask.priority || 'medium'
        });
        setIsEditing(false);
    };

    const handleStatusChange = (newStatus: string) => {
        if (!isEditing) {
            // For now, just log the status change
            // The parent component will handle updates
            console.log('Status change:', newStatus);
        }
    };

    return (
        <div className="group bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 p-6 hover:border-slate-300 transform hover:-translate-y-1">
            {isEditing ? (
                // Edit Mode
                <div className="space-y-4">
                    <input
                        type="text"
                        value={editData.title}
                        onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 bg-white/10 border border-gray-200 hover:border-gray-300 transition-all rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Task title"
                    />

                    <textarea
                        value={editData.description}
                        onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 bg-white/10 border border-gray-200 hover:border-gray-300 transition-all rounded-lg text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Description (optional)"
                        rows={3}
                    />

                    <div className="flex gap-2">
                        <select
                            value={editData.status}
                            onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value as any }))}
                            className="flex-1 px-3 py-2 bg-white/10 border border-gray-200 hover:border-gray-300 transition-all rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="pending" className="bg-gray-800">Pending</option>
                            <option value="in-progress" className="bg-gray-800">In Progress</option>
                            <option value="completed" className="bg-gray-800">Completed</option>
                        </select>

                        <select
                            value={editData.priority}
                            onChange={(e) => setEditData(prev => ({ ...prev, priority: e.target.value as any }))}
                            className="flex-1 px-3 py-2 bg-white/10 border border-gray-200 hover:border-gray-300 transition-all rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="low" className="bg-gray-800">Low</option>
                            <option value="medium" className="bg-gray-800">Medium</option>
                            <option value="high" className="bg-gray-800">High</option>
                        </select>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            className="flex-1 px-4 py-2 bg-green-500/80 text-white rounded-lg hover:bg-green-500 transition-colors duration-200"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                // View Mode
                <>
                    <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-900 flex-1 group-hover:text-blue-900 transition-colors duration-200">
                            {currentTask.title}
                        </h3>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-slate-400 hover:text-blue-500 p-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                                title="Edit task"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setTaskToDelete(currentTask)}
                                className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                                title="Delete task"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Separador */}
                    <div className="border-t border-slate-200 mb-4"></div>

                    {currentTask.description && (
                        <p className="text-slate-600 text-sm mb-6 leading-relaxed">{currentTask.description}</p>
                    )}

                    <div className="flex flex-wrap gap-2 mb-6">
                        <button
                            onClick={() => {
                                const statuses = ['pending', 'in-progress', 'completed'];
                                const currentIndex = statuses.indexOf(currentTask.status || 'pending');
                                const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                                handleStatusChange(nextStatus);
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-medium border-2 bg-white transition-all duration-200 hover:scale-105 ${getStatusColor(currentTask.status)}`}
                        >
                            {currentTask.status === 'in-progress'
                                ? 'In progress'
                                : currentTask.status === 'completed'
                                    ? 'Completed'
                                    : 'Pending'}
                        </button>
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium border-2 ${getPriorityColor(currentTask.priority)}`}>
                            {currentTask.priority === 'high'
                                ? 'High priority'
                                : currentTask.priority === 'medium'
                                    ? 'Medium priority'
                                    : 'Low priority'}
                        </span>
                    </div>                    <div className="space-y-2 text-xs">
                        {/* Información del usuario asignado */}
                        {currentTask.assignedTo && (
                            <div className="flex items-center text-slate-500">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Assigned to: <span className="font-medium text-slate-700 ml-1">{currentTask.assignedTo.name}</span>
                            </div>
                        )}

                        {/* Información del proyecto */}
                        {currentTask.project && (
                            <div className="flex items-center text-slate-500">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                Project: <span className="font-medium text-slate-700 ml-1">{currentTask.project.name}</span>
                            </div>
                        )}

                        {/* Información del creador */}
                        <div className="flex items-center text-slate-500">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            Created by: <span className="font-medium text-slate-700 ml-1">{currentTask.createdBy.name}</span>
                        </div>

                        {currentTask.dueDate && (
                            <div className="flex items-center text-slate-500">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Due: <span className="font-medium text-slate-700 ml-1">{new Date(currentTask.dueDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}</span>
                            </div>
                        )}
                        <div className="flex items-center text-slate-500">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Created: <span className="font-medium text-slate-700 ml-1">{new Date(currentTask.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                            })}</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

