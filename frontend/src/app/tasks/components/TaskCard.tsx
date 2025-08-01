import { JSX } from "react";

interface StatusColorProps {
    status?: "pending" | "in-progress" | "completed";
}

const getStatusColor = (status: StatusColorProps['status']): string => {
    switch (status) {
        case 'completed':
            return 'bg-green-100 text-green-800';
        case 'in-progress':
            return 'bg-yellow-100 text-yellow-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const getPriorityColor = (priority: string | undefined) => {
    switch (priority) {
        case 'high':
            return 'bg-red-100 text-red-800';
        case 'medium':
            return 'bg-orange-100 text-orange-800';
        default:
            return 'bg-blue-100 text-blue-800';
    }
};

interface Task {
    _id: string;
    title: string;
    description?: string;
    status?: "pending" | "in-progress" | "completed";
    priority?: "high" | "medium" | "low";
    dueDate?: string;
    createdAt: string;
}

interface TaskCardProps {
    task: Task;
    setTaskToDelete: (task: Task) => void;
}

export default function TaskCard({ task, setTaskToDelete }: TaskCardProps): JSX.Element {
    return (
        <div key={task._id} className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-200/50 hover:border-blue-200/50 transform hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex-1 group-hover:text-blue-900 transition-colors duration-200">
                    {task.title}
                </h3>
                <button
                    onClick={() => setTaskToDelete(task)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 ml-2 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                    title="Delete task"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>

            {task.description && (
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">{task.description}</p>
            )}

            <div className="flex flex-wrap gap-2 mb-6">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)} shadow-sm`}>
                    {task.status === 'in-progress'
                        ? 'In Progress'
                        : task.status
                            ? task.status.charAt(0).toUpperCase() + task.status.slice(1)
                            : 'Pending'}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)} shadow-sm`}>
                    {task.priority?.toUpperCase() || 'MEDIUM'} PRIORITY
                </span>
            </div>

            <div className="space-y-2 text-xs">
                {task.dueDate && (
                    <div className="flex items-center text-gray-500">
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
        </div>
    );
}

