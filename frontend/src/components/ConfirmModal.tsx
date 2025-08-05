'use client';

import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    type = 'danger'
}: ConfirmModalProps) {
    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'danger':
                return {
                    iconColor: 'text-red-600',
                    iconBg: 'bg-red-100',
                    confirmButton: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                };
            case 'warning':
                return {
                    iconColor: 'text-yellow-600',
                    iconBg: 'bg-yellow-100',
                    confirmButton: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700'
                };
            case 'info':
                return {
                    iconColor: 'text-blue-600',
                    iconBg: 'bg-blue-100',
                    confirmButton: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                };
            default:
                return {
                    iconColor: 'text-red-600',
                    iconBg: 'bg-red-100',
                    confirmButton: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                };
        }
    };

    const styles = getTypeStyles();

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl transform animate-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <div className={`${styles.iconBg} p-3 rounded-xl mr-4`}>
                            <AlertTriangle className={`w-6 h-6 ${styles.iconColor}`} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="mb-8">
                    <p className="text-gray-600 leading-relaxed">{message}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`flex-1 px-6 py-3 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${styles.confirmButton}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
