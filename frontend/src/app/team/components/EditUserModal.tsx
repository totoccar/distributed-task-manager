'use client';

import { useState, useEffect } from 'react';
import { X, Shield, Crown, User as UserIcon } from 'lucide-react';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin' | 'manager';
    isActive: boolean;
}

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (userData: Partial<User>) => Promise<void>;
    user: User | null;
    currentUserRole: string;
}

export default function EditUserModal({ isOpen, onClose, onSubmit, user, currentUserRole }: EditUserModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'user' as 'user' | 'admin' | 'manager',
        isActive: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            });
            setError('');
        }
    }, [user, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await onSubmit(formData);
            onClose();
        } catch (error: any) {
            setError(error.response?.data?.message || 'Error updating user');
        } finally {
            setLoading(false);
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin':
                return <Shield className="h-4 w-4 text-red-600" />;
            case 'manager':
                return <Crown className="h-4 w-4 text-blue-700" />;
            default:
                return <UserIcon className="h-4 w-4 text-slate-600" />;
        }
    };

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-slate-900">Edit User</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5 text-slate-600" />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Role - Solo admin puede cambiar roles */}
                    {currentUserRole === 'admin' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Role
                            </label>
                            <div className="space-y-2">
                                {(['user', 'manager', 'admin'] as const).map((roleOption) => (
                                    <label key={roleOption} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="role"
                                            value={roleOption}
                                            checked={formData.role === roleOption}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <div className="flex items-center gap-2">
                                            {getRoleIcon(roleOption)}
                                            <span className="capitalize font-medium text-slate-700">{roleOption}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Status - Solo admin puede cambiar estado */}
                    {currentUserRole === 'admin' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Status
                            </label>
                            <div className="space-y-2">
                                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="active"
                                        checked={formData.isActive === true}
                                        onChange={() => setFormData({ ...formData, isActive: true })}
                                        className="text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span className="text-emerald-700 font-medium">Active</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="inactive"
                                        checked={formData.isActive === false}
                                        onChange={() => setFormData({ ...formData, isActive: false })}
                                        className="text-red-600 focus:ring-red-500"
                                    />
                                    <span className="text-red-700 font-medium">Inactive</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Update User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
