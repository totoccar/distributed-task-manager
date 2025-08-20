'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { userService } from '@/services/api';
import EditUserModal from '@/app/team/components/EditUserModal';
import DeleteUserModal from '@/app/team/components/DeleteUserModal';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin' | 'manager';
    isActive: boolean;
    lastLogin?: string;
    createdAt: string;
}

const AdminUsersPage = () => {
    const { token, user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError('');
            try {
                const users = await userService.getAllUsers();
                setUsers(users);
            } catch (err) {
                setError('No se pudieron cargar los usuarios.');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Filtrar y ordenar usuarios
    const filteredUsers = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));
    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (!sortBy) return 0;
        let valA, valB;
        switch (sortBy) {
            case "role":
                valA = a.role;
                valB = b.role;
                break;
            case "estado":
                valA = a.isActive ? 1 : 0;
                valB = b.isActive ? 1 : 0;
                break;
            case "ultimo":
                valA = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
                valB = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
                break;
            default:
                return 0;
        }
        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });


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

    const handleEditUser = async (userId: string, userData: Partial<User>) => {
        try {
            await userService.updateUser(userId, userData);
            setEditingUser(null);
            setError('');
            setLoading(true);
            const users = await userService.getAllUsers();
            setUsers(users);
        } catch (err) {
            setError('No se pudo editar el usuario.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            await userService.deleteUser(userId);
            setDeletingUser(null);
            setError('');
            setLoading(true);
            const users = await userService.getAllUsers();
            setUsers(users);
        } catch (err) {
            setError('No se pudo eliminar el usuario.');
        } finally {
            setLoading(false);
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-primary text-primary-foreground border border-primary shadow-sm';
            case 'manager':
                return 'bg-secondary text-secondary-foreground border border-secondary shadow-sm';
            default:
                return 'bg-accent text-accent-foreground border border-accent shadow-sm';
        }
    };

    // Navbar con menú desplegable
    const [menuOpen, setMenuOpen] = useState(false);
    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    };

    return (
        <ProtectedRoute requiredRoles={['admin']}>
            <div className="pt-20 min-h-screen bg-background text-foreground font-sans">
                {/* Botón volver para atrás solicitado */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4 mt-2">
                    <button
                        onClick={() => window.location.href = '/'}
                        className="flex items-center text-slate-600 hover:text-slate-900 transition-colors duration-200 group"
                    >
                        <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold text-slate-700">Administrar Usuarios</h1>
                </div>

                {/* Barra de búsqueda */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar por nombre..."
                        className="w-full py-3 px-6 text-base bg-white border border-slate-200 focus:border-primary focus:ring-primary rounded-full outline-none transition-all placeholder:text-slate-400"
                        style={{ borderRadius: "100px" }}
                    />
                </div>

                {/* Contenido principal */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {error && (
                        <div className="mb-6 p-4 bg-destructive/20 border border-destructive/50 rounded-lg">
                            <p className="text-destructive">{error}</p>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="bg-card/80 backdrop-blur rounded-2xl border border-border overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted/60">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer select-none" onClick={() => { }}>
                                                Usuario
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer select-none" onClick={() => {
                                                setSortBy("role");
                                                setSortOrder(sortBy === "role" && sortOrder === "asc" ? "desc" : "asc");
                                            }}>
                                                Rol
                                                {sortBy === "role" && (
                                                    <span className="ml-1">{sortOrder === "asc" ? "▲" : "▼"}</span>
                                                )}
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer select-none" onClick={() => {
                                                setSortBy("estado");
                                                setSortOrder(sortBy === "estado" && sortOrder === "asc" ? "desc" : "asc");
                                            }}>
                                                Estado
                                                {sortBy === "estado" && (
                                                    <span className="ml-1">{sortOrder === "asc" ? "▲" : "▼"}</span>
                                                )}
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer select-none" onClick={() => {
                                                setSortBy("ultimo");
                                                setSortOrder(sortBy === "ultimo" && sortOrder === "asc" ? "desc" : "asc");
                                            }}>
                                                Último acceso
                                                {sortBy === "ultimo" && (
                                                    <span className="ml-1">{sortOrder === "asc" ? "▲" : "▼"}</span>
                                                )}
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {sortedUsers.map((user) => (
                                            <tr key={user._id} className="hover:bg-muted/40 transition-colors duration-200">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-4">
                                                            <span className="text-primary-foreground font-bold">
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <div className="text-card-foreground font-medium">{user.name}</div>
                                                            <div className="text-muted-foreground text-sm">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center justify-center min-w-[90px] max-w-[120px] h-8 px-4 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}
                                                        style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.02em' }}>
                                                        {user.role === 'admin' ? 'Administrador' : user.role === 'manager' ? 'Encargado' : 'Usuario'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${user.isActive
                                                        ? 'bg-green-100 text-green-700 border-green-300'
                                                        : 'bg-destructive text-white border-destructive'
                                                        }`}
                                                        style={{ fontFamily: 'var(--font-sans)' }}>
                                                        {user.isActive ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-muted-foreground text-sm">
                                                    {user.lastLogin
                                                        ? new Date(user.lastLogin).toLocaleDateString()
                                                        : 'Nunca'
                                                    }
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                                                    <button
                                                        onClick={() => setEditingUser(user)}
                                                        className="px-3 py-1 bg-secondary text-secondary-foreground rounded-lg text-xs font-medium hover:bg-secondary/90 transition-all"
                                                        style={{ fontFamily: 'var(--font-sans)' }}
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => setDeletingUser(user)}
                                                        className="px-3 py-1 bg-destructive/80 text-white rounded-lg text-xs font-medium hover:bg-destructive/90 transition-all"
                                                        style={{ fontFamily: 'var(--font-sans)' }}
                                                    >
                                                        Eliminar
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

            {/* Modales CRUD */}
            {editingUser && (
                <EditUserModal
                    isOpen={!!editingUser}
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onSubmit={async (userData) => {
                        if (editingUser) {
                            await handleEditUser(editingUser._id, userData);
                        }
                    }}
                    currentUserRole={currentUser?.role || ''}
                />
            )}
            {deletingUser && (
                <DeleteUserModal
                    isOpen={!!deletingUser}
                    onClose={() => setDeletingUser(null)}
                    onConfirm={() => handleDeleteUser(deletingUser._id)}
                    userName={deletingUser.name}
                />
            )}
        </ProtectedRoute>
    );
};

export default AdminUsersPage;
