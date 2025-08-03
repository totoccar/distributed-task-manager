'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    CheckSquare,
    FolderOpen,
    Users,
    BarChart3,
    Settings,
    Wrench,
    ArrowRight,
    LogOut,
    User,
    Calendar,
    Target
} from 'lucide-react';

const DashboardPage = () => {
    const { user, logout, hasRole } = useAuth();

    const roleBasedMenuItems = [
        // Items para todos los usuarios autenticados
        {
            title: 'My Tasks',
            description: 'View and manage your assigned tasks',
            href: '/tasks',
            icon: CheckSquare,
            roles: ['user', 'manager', 'admin'],
            color: 'bg-gradient-to-br from-[#5a689c]/20 to-[#727fb4]/20 hover:from-[#5a689c]/30 hover:to-[#727fb4]/30'
        },
        {
            title: 'Projects',
            description: 'Browse all projects',
            href: '/projects',
            icon: FolderOpen,
            roles: ['user', 'manager', 'admin'],
            color: 'bg-gradient-to-br from-[#727fb4]/20 to-[#8995cd]/20 hover:from-[#727fb4]/30 hover:to-[#8995cd]/30'
        },
        // Items solo para managers y admins
        {
            title: 'Team Management',
            description: 'Manage team members and assignments',
            href: '/team',
            icon: Users,
            roles: ['manager', 'admin'],
            color: 'bg-gradient-to-br from-[#8995cd]/20 to-[#a1ace5]/20 hover:from-[#8995cd]/30 hover:to-[#a1ace5]/30'
        },
        {
            title: 'Analytics',
            description: 'View performance metrics and reports',
            href: '/analytics',
            icon: BarChart3,
            roles: ['manager', 'admin'],
            color: 'bg-gradient-to-br from-[#a1ace5]/20 to-[#5a689c]/20 hover:from-[#a1ace5]/30 hover:to-[#5a689c]/30'
        },
        // Items solo para admins
        {
            title: 'User Management',
            description: 'Manage users, roles and permissions',
            href: '/admin/users',
            icon: Settings,
            roles: ['admin'],
            color: 'bg-gradient-to-br from-[#5a689c]/20 to-[#425183]/20 hover:from-[#5a689c]/30 hover:to-[#425183]/30'
        },
        {
            title: 'System Settings',
            description: 'Configure system-wide settings',
            href: '/admin/settings',
            icon: Wrench,
            roles: ['admin'],
            color: 'bg-gradient-to-br from-[#727fb4]/20 to-[#5a689c]/20 hover:from-[#727fb4]/30 hover:to-[#5a689c]/30'
        }
    ];

    const availableMenuItems = roleBasedMenuItems.filter(item =>
        hasRole(item.roles)
    );

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-[#5a689c]/20 text-[#425183] border-[#5a689c]/40';
            case 'manager':
                return 'bg-[#727fb4]/20 text-[#425183] border-[#727fb4]/40';
            default:
                return 'bg-[#8995cd]/20 text-[#425183] border-[#8995cd]/40';
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50">
                {/* Header */}
                <div className="bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <div className="flex items-center space-x-4">
                                <h1 className="text-2xl font-bold text-[#425183]">Task Manager</h1>
                                <Badge className={`text-xs font-medium border ${getRoleBadgeColor(user?.role || 'user')}`}>
                                    {user?.role?.toUpperCase()}
                                </Badge>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <p className="text-[#425183] font-medium">{user?.name}</p>
                                    <p className="text-[#8995cd] text-sm">{user?.email}</p>
                                </div>

                                <div className="w-10 h-10 bg-gradient-to-r from-[#5a689c] to-[#727fb4] rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>

                                <Button
                                    onClick={logout}
                                    variant="outline"
                                    size="sm"
                                    className="border-destructive/50 text-destructive hover:bg-destructive/10"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Welcome Section */}
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-[#425183] mb-4">
                            Welcome back, {user?.name?.split(' ')[0]}!
                        </h2>
                        <p className="text-[#8995cd] text-lg">
                            What would you like to work on today?
                        </p>
                    </div>

                    {/* Menu Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                        {availableMenuItems.map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                                <Link
                                    key={index}
                                    href={item.href}
                                    className="group block"
                                >
                                    <Card className="bg-white/70 backdrop-blur-xl border-white/40 hover:bg-white/80 hover:border-[#5a689c]/50 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center mb-2">
                                                <div className={`w-12 h-12 ${item.color} backdrop-blur rounded-xl flex items-center justify-center mr-4 transition-all duration-300`}>
                                                    <IconComponent className="w-6 h-6 text-[#5a689c]" />
                                                </div>
                                                <CardTitle className="text-xl text-[#425183] group-hover:text-[#5a689c] transition-colors duration-200">
                                                    {item.title}
                                                </CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription className="text-[#8995cd] group-hover:text-[#727fb4] transition-colors duration-200 mb-4">
                                                {item.description}
                                            </CardDescription>
                                            <div className="flex items-center text-[#5a689c] group-hover:text-[#727fb4] transition-colors duration-200">
                                                <span className="text-sm font-medium">Access now</span>
                                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="bg-white/70 backdrop-blur-xl border-white/40 shadow-lg">
                            <CardContent className="text-center p-6">
                                <div className="flex items-center justify-center mb-3">
                                    <CheckSquare className="w-8 h-8 text-[#5a689c] mr-2" />
                                    <div className="text-3xl font-bold text-[#425183]">12</div>
                                </div>
                                <div className="text-[#8995cd]">Active Tasks</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/70 backdrop-blur-xl border-white/40 shadow-lg">
                            <CardContent className="text-center p-6">
                                <div className="flex items-center justify-center mb-3">
                                    <Calendar className="w-8 h-8 text-[#727fb4] mr-2" />
                                    <div className="text-3xl font-bold text-[#425183]">5</div>
                                </div>
                                <div className="text-[#8995cd]">Completed Today</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/70 backdrop-blur-xl border-white/40 shadow-lg">
                            <CardContent className="text-center p-6">
                                <div className="flex items-center justify-center mb-3">
                                    <Target className="w-8 h-8 text-[#8995cd] mr-2" />
                                    <div className="text-3xl font-bold text-[#425183]">3</div>
                                </div>
                                <div className="text-[#8995cd]">Projects</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default DashboardPage;
