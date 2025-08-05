'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { userService, projectService, taskService } from '@/services/api';
import { useRouter } from 'next/navigation';
import { 
    Users, 
    UserPlus, 
    Search, 
    Filter, 
    MoreVertical, 
    Mail, 
    Calendar,
    CheckCircle,
    Clock,
    AlertTriangle,
    Settings,
    Shield,
    User as UserIcon,
    Crown
} from 'lucide-react';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin' | 'manager';
    avatar?: string;
    isActive: boolean;
    lastLogin?: string;
    createdAt: string;
    updatedAt: string;
}

interface UserStats {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    pendingTasks: number;
    projects: number;
}

interface TeamMember extends User {
    stats?: UserStats;
}

export default function TeamPage() {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Estados para filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Verificar permisos
        if (user && user.role !== 'admin' && user.role !== 'manager') {
            router.push('/unauthorized');
            return;
        }
        
        if (user) {
            loadTeamMembers();
        }
    }, [user, router]);

    useEffect(() => {
        applyFilters();
    }, [teamMembers, searchTerm, roleFilter, statusFilter]);

    const loadTeamMembers = async () => {
        try {
            setLoading(true);
            const users = await userService.getAllUsers();
            
            // Obtener estadísticas para cada usuario
            const membersWithStats = await Promise.all(
                users.map(async (member: User) => {
                    try {
                        // Aquí podrías hacer una llamada específica para obtener estadísticas del usuario
                        // Por ahora simulamos datos básicos
                        const stats: UserStats = {
                            totalTasks: 0,
                            completedTasks: 0,
                            inProgressTasks: 0,
                            pendingTasks: 0,
                            projects: 0
                        };
                        
                        return { ...member, stats };
                    } catch (err) {
                        return { ...member, stats: undefined };
                    }
                })
            );
            
            setTeamMembers(membersWithStats);
            setError(null);
        } catch (err) {
            setError('Error loading team members');
            console.error('Error loading team members:', err);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...teamMembers];

        // Filtro por término de búsqueda
        if (searchTerm) {
            filtered = filtered.filter(member =>
                member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtro por rol
        if (roleFilter !== 'all') {
            filtered = filtered.filter(member => member.role === roleFilter);
        }

        // Filtro por estado
        if (statusFilter !== 'all') {
            if (statusFilter === 'active') {
                filtered = filtered.filter(member => member.isActive);
            } else if (statusFilter === 'inactive') {
                filtered = filtered.filter(member => !member.isActive);
            }
        }

        setFilteredMembers(filtered);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setRoleFilter('all');
        setStatusFilter('all');
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin':
                return <Shield className="h-4 w-4 text-red-600" />;
            case 'manager':
                return <Crown className="h-4 w-4 text-blue-600" />;
            default:
                return <UserIcon className="h-4 w-4 text-gray-600" />;
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'manager':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getActivityStatus = (lastLogin?: string) => {
        if (!lastLogin) return 'Never active';
        
        const lastLoginDate = new Date(lastLogin);
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) return 'Active today';
        if (diffInDays === 1) return 'Active yesterday';
        if (diffInDays <= 7) return `Active ${diffInDays} days ago`;
        if (diffInDays <= 30) return `Active ${Math.floor(diffInDays / 7)} weeks ago`;
        return `Active ${Math.floor(diffInDays / 30)} months ago`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50/30 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-blue-200 rounded w-1/4 mb-6"></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-48 bg-blue-100 rounded-lg"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50/30 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => window.location.href = '/'}
                            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
                        >
                            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
                        <div className="flex items-center">
                            <div className="bg-blue-100 p-3 rounded-xl mr-4">
                                <Users className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800">Team Management</h1>
                                <p className="text-slate-600 mt-1">Manage your team members and their roles</p>
                            </div>
                        </div>
                    </div>
                    
                    {user?.role === 'admin' && (
                        <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2">
                            <UserPlus className="h-5 w-5" />
                            Add Member
                        </button>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center">
                            <div className="bg-blue-100 p-3 rounded-xl">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Members</p>
                                <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center">
                            <div className="bg-green-100 p-3 rounded-xl">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active Members</p>
                                <p className="text-2xl font-bold text-gray-900">{teamMembers.filter(m => m.isActive).length}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center">
                            <div className="bg-purple-100 p-3 rounded-xl">
                                <Crown className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Managers</p>
                                <p className="text-2xl font-bold text-gray-900">{teamMembers.filter(m => m.role === 'manager').length}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center">
                            <div className="bg-orange-100 p-3 rounded-xl">
                                <AlertTriangle className="w-6 h-6 text-orange-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Inactive</p>
                                <p className="text-2xl font-bold text-gray-900">{teamMembers.filter(m => !m.isActive).length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            {/* Search Input */}
                            <div className="relative flex-1 max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search members..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Role Filter */}
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="all">All Roles</option>
                                <option value="admin">👑 Admin</option>
                                <option value="manager">🔵 Manager</option>
                                <option value="user">👤 User</option>
                            </select>

                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="all">All Status</option>
                                <option value="active">✅ Active</option>
                                <option value="inactive">❌ Inactive</option>
                            </select>
                        </div>

                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
                        >
                            Clear Filters
                        </button>
                    </div>

                    {/* Filter Summary */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        {searchTerm && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Search: "{searchTerm}"
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        {roleFilter !== 'all' && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Role: {roleFilter}
                                <button
                                    onClick={() => setRoleFilter('all')}
                                    className="ml-2 text-green-600 hover:text-green-800"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        {statusFilter !== 'all' && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                Status: {statusFilter}
                                <button
                                    onClick={() => setStatusFilter('all')}
                                    className="ml-2 text-orange-600 hover:text-orange-800"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <AlertTriangle className="h-5 w-5 text-red-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700 font-medium">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Team Members Grid */}
                {filteredMembers.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="bg-gray-100 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                            <Users className="w-16 h-16 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {teamMembers.length === 0 ? 'No team members yet' : 'No members match your filters'}
                        </h3>
                        <p className="text-lg text-gray-500 mb-8 max-w-md mx-auto">
                            {teamMembers.length === 0
                                ? 'Start building your team by adding members to collaborate on projects.'
                                : 'Try adjusting your search criteria or clearing the filters to see more results.'
                            }
                        </p>
                        {filteredMembers.length === 0 && teamMembers.length > 0 && (
                            <button
                                onClick={clearFilters}
                                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 inline-flex items-center space-x-2"
                            >
                                <Filter className="w-5 h-5" />
                                <span>Clear all filters</span>
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredMembers.map((member) => (
                            <div
                                key={member._id}
                                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group"
                            >
                                {/* Member Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                            {member.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                                {member.name}
                                                {getRoleIcon(member.role)}
                                            </h3>
                                            <p className="text-sm text-gray-600">{member.email}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(member.role)}`}>
                                            {member.role}
                                        </span>
                                        {user?.role === 'admin' && (
                                            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
                                                <MoreVertical className="h-4 w-4 text-gray-400" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Member Info */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Status:</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            member.isActive 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {member.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Last Login:</span>
                                        <span className="text-sm text-gray-800">
                                            {getActivityStatus(member.lastLogin)}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Member since:</span>
                                        <span className="text-sm text-gray-800">
                                            {formatDate(member.createdAt)}
                                        </span>
                                    </div>
                                </div>

                                {/* Member Stats */}
                                {member.stats && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div className="text-center">
                                                <div className="font-semibold text-blue-600">{member.stats.totalTasks}</div>
                                                <div className="text-gray-600">Tasks</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="font-semibold text-green-600">{member.stats.completedTasks}</div>
                                                <div className="text-gray-600">Completed</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="mt-4 flex gap-2">
                                    <button className="flex-1 px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        Contact
                                    </button>
                                    {user?.role === 'admin' && (
                                        <button className="px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors duration-200">
                                            <Settings className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
