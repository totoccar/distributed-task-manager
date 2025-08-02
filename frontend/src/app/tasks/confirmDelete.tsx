import { FC } from 'react';

interface ConfirmDeleteProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    taskTitle: string;
}

const ConfirmDelete: FC<ConfirmDeleteProps> = ({ isOpen, onClose, onConfirm, taskTitle }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl transform animate-in zoom-in duration-200">
                <div className="flex items-center justify-center mb-6">
                    <div className="bg-red-100 p-4 rounded-full">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Delete Task</h2>
                    <p className="text-gray-600 mb-4">
                        Are you sure you want to delete this task?
                    </p>
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <p className="font-semibold text-gray-900 text-lg">"{taskTitle}"</p>
                    </div>
                    <p className="text-sm text-red-600 font-medium">
                        This action cannot be undone
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                        Delete Task
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDelete;
