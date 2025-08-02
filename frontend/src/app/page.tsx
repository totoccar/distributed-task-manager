'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    if (isAuthenticated) {
        return null; // El useEffect manejará la redirección
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            <div className="absolute inset-0 bg-black opacity-50"></div>

            <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Hero Section */}
                    <div className="mb-12">
                        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                            Distributed
                            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Task Manager
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                            Collaborate, organize, and achieve more with our modern task management platform
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <div className="text-4xl mb-4">🚀</div>
                            <h3 className="text-xl font-bold text-white mb-2">Fast & Efficient</h3>
                            <p className="text-gray-300 text-sm">Streamlined workflows for maximum productivity</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <div className="text-4xl mb-4">👥</div>
                            <h3 className="text-xl font-bold text-white mb-2">Team Collaboration</h3>
                            <p className="text-gray-300 text-sm">Work together seamlessly with role-based access</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <div className="text-4xl mb-4">📊</div>
                            <h3 className="text-xl font-bold text-white mb-2">Analytics & Reports</h3>
                            <p className="text-gray-300 text-sm">Track progress with detailed insights</p>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/login"
                            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 text-center"
                        >
                            Sign In
                        </Link>

                        <Link
                            href="/register"
                            className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 text-center"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Demo Info */}
                    <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-4">Try Demo Accounts</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="bg-white/10 rounded-lg p-4">
                                <div className="text-blue-400 font-medium mb-1">👤 User Account</div>
                                <div className="text-gray-300">user@demo.com / password</div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-4">
                                <div className="text-purple-400 font-medium mb-1">👔 Manager Account</div>
                                <div className="text-gray-300">manager@demo.com / password</div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-4">
                                <div className="text-red-400 font-medium mb-1">⚙️ Admin Account</div>
                                <div className="text-gray-300">admin@demo.com / password</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
