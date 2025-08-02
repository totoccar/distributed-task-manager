'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

const DashboardPage = () => {
    const { user, logout, hasRole } = useAuth();

    const roleBasedMenuItems = [
        // Items para todos los usuarios autenticados
        {
            title: 'My Tasks',
            description: 'View and manage your assigned tasks',
            href: '/tasks',
            icon: '📋',
            roles: ['user', 'manager', 'admin'],
            color: 'from-blue-500 to-blue-600'
        },
        {
            title: 'Projects',
            description: 'Browse all projects',
            href: '/projects',
            icon: '📁',
            roles: ['user', 'manager', 'admin'],
            color: 'from-green-500 to-green-600'
        },
        // Items solo para managers y admins
        {
            title: 'Team Management',
            description: 'Manage team members and assignments',
            href: '/team',
            icon: '👥',
            roles: ['manager', 'admin'],
            color: 'from-purple-500 to-purple-600'
        },
        {
            title: 'Analytics',
            description: 'View performance metrics and reports',
            href: '/analytics',
            icon: '📊',
            roles: ['manager', 'admin'],
            color: 'from-orange-500 to-orange-600'
        },
        // Items solo para admins
        {
            title: 'User Management',
            description: 'Manage users, roles and permissions',
            href: '/admin/users',
            icon: '⚙️',
            roles: ['admin'],
            color: 'from-red-500 to-red-600'
        },
        {
            title: 'System Settings',
            description: 'Configure system-wide settings',
            href: '/admin/settings',
            icon: '🔧',
            roles: ['admin'],
            color: 'from-gray-500 to-gray-600'
        }
    ];

    const availableMenuItems = roleBasedMenuItems.filter(item =>
        hasRole(item.roles)
    );

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
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
                {/* Header */}
                <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <div className="flex items-center space-x-4">
                                <h1 className="text-2xl font-bold text-white">Task Manager</h1>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user?.role || 'user')}`}>
                                    {user?.role?.toUpperCase()}
                                </span>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <p className="text-white font-medium">{user?.name}</p>
                                    <p className="text-gray-300 text-sm">{user?.email}</p>
                                </div>

                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>

                                <button
                                    onClick={logout}
                                    className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg border border-red-500/50 hover:bg-red-500/30 transition-all duration-200"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Welcome Section */}
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Welcome back, {user?.name?.split(' ')[0]}! 👋
                        </h2>
                        <p className="text-gray-300 text-lg">
                            What would you like to work on today?
                        </p>
                    </div>

                    {/* Menu Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {availableMenuItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className="group block"
                            >
                                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                                    <div className="flex items-center mb-4">
                                        <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center text-2xl mr-4`}>
                                            {item.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-200">
                                            {item.title}
                                        </h3>
                                    </div>
                                    <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-200">
                                        {item.description}
                                    </p>
                                    <div className="mt-4 flex items-center text-blue-400 group-hover:text-blue-300 transition-colors duration-200">
                                        <span className="text-sm font-medium">Access now</span>
                                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
                            <div className="text-3xl font-bold text-blue-400 mb-2">12</div>
                            <div className="text-gray-300">Active Tasks</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
                            <div className="text-3xl font-bold text-green-400 mb-2">5</div>
                            <div className="text-gray-300">Completed Today</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
                            <div className="text-3xl font-bold text-purple-400 mb-2">3</div>
                            <div className="text-gray-300">Projects</div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default DashboardPage;
