"use client"

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="bg-slate-900 text-white px-6 py-4 shadow-lg">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-semibold hover:text-slate-300 transition-colors">
                    TaskManager Pro
                </Link>

                <div className="flex items-center space-x-6">
                    {user ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="hover:text-slate-300 transition-colors font-medium"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/tasks"
                                className="hover:text-slate-300 transition-colors font-medium"
                            >
                                Tareas
                            </Link>
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-slate-300">
                                    Hola, {user.name}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/login"
                                className="hover:text-slate-300 transition-colors font-medium"
                            >
                                Iniciar Sesión
                            </Link>
                            <Link
                                href="/register"
                                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Registrarse
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}