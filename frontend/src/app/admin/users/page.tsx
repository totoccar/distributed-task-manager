'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    lastLogin?: string;
    createdAt: string;
}

const AdminUsersPage = () => {
    const { token, user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_URL}/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data.data || []);
            } else {
                setError('Failed to fetch users');
            }
        } catch (err) {
            setError('Error fetching users');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleUserStatus = async (userId: string, isActive: boolean) => {
        try {
            const response = await fetch(`${API_URL}/admin/users/${userId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isActive: !isActive }),
            });

            if (response.ok) {
                setUsers(users.map(user =>
                    user._id === userId ? { ...user, isActive: !isActive } : user
                ));
            } else {
                setError('Failed to update user status');
            }
        } catch (err) {
            setError('Error updating user status');
            console.error('Error:', err);
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-red-500/20 text-red-300 border-red-500/50';
            case 'manager':
                return 'bg-purple-500/20 text-purple-300 border-purple-500/50';
            default:
                return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
        }
    };

    return (
        <ProtectedRoute requiredRoles={['admin']}>
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
                {/* Header */}
                <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/dashboard"
                                    className="text-gray-300 hover:text-white transition-colors duration-200"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </Link>
                                <h1 className="text-2xl font-bold text-white">User Management</h1>
                                <span className="px-3 py-1 rounded-full text-xs font-medium border bg-red-500/20 text-red-300 border-red-500/50">
                                    ADMIN ONLY
                                </span>
                            </div>

                            <div className="text-right">
                                <p className="text-white font-medium">{currentUser?.name}</p>
                                <p className="text-gray-300 text-sm">Administrator</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-white mb-4">System Users</h2>
                        <p className="text-gray-300">Manage user accounts, roles, and permissions</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                            <p className="text-red-200">{error}</p>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                        </div>
                    ) : (
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-white/5">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Last Login
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        {users.map((user) => (
                                            <tr key={user._id} className="hover:bg-white/5 transition-colors duration-200">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                                                            <span className="text-white font-bold">
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <div className="text-white font-medium">{user.name}</div>
                                                            <div className="text-gray-300 text-sm">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                                                        {user.role.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${user.isActive
                                                            ? 'bg-green-500/20 text-green-300 border-green-500/50'
                                                            : 'bg-red-500/20 text-red-300 border-red-500/50'
                                                        }`}>
                                                        {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-300 text-sm">
                                                    {user.lastLogin
                                                        ? new Date(user.lastLogin).toLocaleDateString()
                                                        : 'Never'
                                                    }
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        onClick={() => toggleUserStatus(user._id, user.isActive)}
                                                        disabled={user._id === currentUser?._id}
                                                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${user._id === currentUser?._id
                                                                ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                                                                : user.isActive
                                                                    ? 'bg-red-500/20 text-red-300 border border-red-500/50 hover:bg-red-500/30'
                                                                    : 'bg-green-500/20 text-green-300 border border-green-500/50 hover:bg-green-500/30'
                                                            }`}
                                                    >
                                                        {user._id === currentUser?._id
                                                            ? 'You'
                                                            : user.isActive
                                                                ? 'Deactivate'
                                                                : 'Activate'
                                                        }
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default AdminUsersPage;
