import { JSX, useState } from "react";
import { Task } from '@/services/api';

interface StatusColorProps {
    status?: "pending" | "in-progress" | "completed";
}

const getStatusColor = (status: StatusColorProps['status']): string => {
    switch (status) {
        case 'completed':
            return 'bg-green-500/20 text-green-300 border-green-500/50';
        case 'in-progress':
            return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
        default:
            return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
};

const getPriorityColor = (priority: string | undefined) => {
    switch (priority) {
        case 'high':
            return 'bg-red-500/20 text-red-300 border-red-500/50';
        case 'medium':
            return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
        default:
            return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
    }
};

interface TaskCardProps {
    task: Task;
    setTaskToDelete: (task: Task | null) => void;
}

export default function TaskCard({ task, setTaskToDelete }: TaskCardProps): JSX.Element {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        title: task.title,
        description: task.description || '',
        status: task.status || 'pending',
        priority: task.priority || 'medium'
    });

    const handleSave = async () => {
        try {
            // For now, just close the editing mode
            // The parent component will handle updates
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    const handleCancel = () => {
        setEditData({
            title: task.title,
            description: task.description || '',
            status: task.status || 'pending',
            priority: task.priority || 'medium'
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
        <div className="group bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-white/20 hover:border-white/30 transform hover:-translate-y-1">
            {isEditing ? (
                // Edit Mode
                <div className="space-y-4">
                    <input
                        type="text"
                        value={editData.title}
                        onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Task title"
                    />

                    <textarea
                        value={editData.description}
                        onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Description (optional)"
                        rows={3}
                    />

                    <div className="flex gap-2">
                        <select
                            value={editData.status}
                            onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value as any }))}
                            className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="pending" className="bg-gray-800">Pending</option>
                            <option value="in-progress" className="bg-gray-800">In Progress</option>
                            <option value="completed" className="bg-gray-800">Completed</option>
                        </select>

                        <select
                            value={editData.priority}
                            onChange={(e) => setEditData(prev => ({ ...prev, priority: e.target.value as any }))}
                            className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="low" className="bg-gray-800">Low</option>
                            <option value="medium" className="bg-gray-800">Medium</option>
                            <option value="high" className="bg-gray-800">High</option>
                        </select>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                // View Mode
                <>
                    <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-bold text-white flex-1 group-hover:text-blue-300 transition-colors duration-200">
                            {task.title}
                        </h3>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-gray-400 hover:text-blue-400 p-2 rounded-lg hover:bg-blue-500/20 transition-all duration-200"
                                title="Edit task"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setTaskToDelete(task)}
                                className="text-gray-400 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/20 transition-all duration-200"
                                title="Delete task"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {task.description && (
                        <p className="text-gray-300 text-sm mb-6 leading-relaxed">{task.description}</p>
                    )}

                    <div className="flex flex-wrap gap-2 mb-6">
                        <button
                            onClick={() => {
                                const statuses = ['pending', 'in-progress', 'completed'];
                                const currentIndex = statuses.indexOf(task.status || 'pending');
                                const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                                handleStatusChange(nextStatus);
                            }}
                            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 hover:scale-105 ${getStatusColor(task.status)}`}
                        >
                            {task.status === 'in-progress'
                                ? 'In Progress'
                                : task.status
                                    ? task.status.charAt(0).toUpperCase() + task.status.slice(1)
                                    : 'Pending'}
                        </button>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
                            {task.priority?.toUpperCase() || 'MEDIUM'} PRIORITY
                        </span>
                    </div>

                    <div className="space-y-2 text-xs">
                        {task.dueDate && (
                            <div className="flex items-center text-gray-400">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Due: {new Date(task.dueDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </div>
                        )}
                        <div className="flex items-center text-gray-400">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Created: {new Date(task.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

