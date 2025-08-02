import { useState } from "react";
import { Task } from '@/services/api';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (taskData: Partial<Task>) => Promise<void>;
}

export default function CreateTaskModal({ isOpen, onClose, onSubmit }: CreateTaskModalProps) {
    const [formData, setFormData] = useState<{
        title: string;
        description: string;
        status: "pending" | "in-progress" | "completed";
        priority: "low" | "medium" | "high";
        dueDate: string;
    }>({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: ''
    });

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (formData.title.trim()) {
            await onSubmit(formData);
        }
    };

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl transform animate-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-3 rounded-xl mr-4">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Create New Task</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Task Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full text-gray-700 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter a descriptive title for your task..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full text-gray-700 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                            placeholder="Add some details about this task..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full text-gray-700 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            >
                                <option value="pending">📋 Pending</option>
                                <option value="in-progress">⚡ In Progress</option>
                                <option value="completed">✅ Completed</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Priority
                            </label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full text-gray-700 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            >
                                <option value="low">🟢 Low Priority</option>
                                <option value="medium">🟡 Medium Priority</option>
                                <option value="high">🔴 High Priority</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Due Date
                        </label>
                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            className="w-full text-gray-700 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                        >
                            Create Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}