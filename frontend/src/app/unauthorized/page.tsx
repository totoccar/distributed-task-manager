'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

const UnauthorizedPage = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-purple-900 to-indigo-900">
            <div className="absolute inset-0 bg-black opacity-50"></div>

            <div className="relative z-10 w-full max-w-lg text-center">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
                    <div className="mb-8">
                        <div className="mx-auto w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>

                        <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>
                        <p className="text-gray-300 text-lg mb-2">
                            You don't have permission to access this page
                        </p>

                        {user && (
                            <div className="bg-white/5 rounded-lg p-4 mt-6">
                                <p className="text-gray-300 text-sm">
                                    Current user: <span className="text-white font-semibold">{user.name}</span>
                                </p>
                                <p className="text-gray-300 text-sm">
                                    Role: <span className="text-blue-400 font-semibold capitalize">{user.role}</span>
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <Link
                            href="/dashboard"
                            className="block w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200"
                        >
                            Go to Dashboard
                        </Link>

                        <button
                            onClick={logout}
                            className="block w-full py-3 px-4 bg-white/10 text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
                        >
                            Logout
                        </button>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-gray-400 text-sm">
                            If you believe this is an error, please contact your administrator.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
