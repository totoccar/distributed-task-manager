"use client";

import { useState, useEffect } from 'react';
import { healthCheck, HealthStatus } from '@/services/api';

export default function Home() {
    const [apiStatus, setApiStatus] = useState<HealthStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAPI = async () => {
            const status = await healthCheck();
            setApiStatus(status);
            setLoading(false);
        };

        checkAPI();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <h1 className="text-xl font-semibold text-gray-900">
                        Task Manager
                    </h1>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">
                    Distributed Task Manager
                </h1>

                {/* Estado de la API */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl text-gray-800 font-semibold mb-4">Backend Status</h2>
                    {loading ? (
                        <div className="flex items-center text-gray-600">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                            Checking API connection...
                        </div>
                    ) : apiStatus ? (
                        <div className="text-green-600">
                            <p className="flex items-center">
                                <span className="text-green-500 mr-2">✅</span>
                                {apiStatus.message}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                Database: {apiStatus.database}
                            </p>
                        </div>
                    ) : (
                        <div className="text-red-600">
                            <p className="flex items-center">
                                <span className="text-red-500 mr-2">❌</span>
                                Backend connection failed
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Make sure your Node.js backend is running on port 3000
                            </p>
                        </div>
                    )}
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 flex flex-col justify-between h-full">
                        <div>
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-lg text-gray-600 font-semibold ml-3">Tasks</h3>
                            </div>
                            <p className="text-gray-600 mb-4">Create, manage and track your tasks</p>
                        </div>
                        <div className="mt-auto">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors w-full disabled:bg-gray-300 disabled:cursor-not-allowed"
                                disabled={!apiStatus}
                                onClick={() => window.location.href = '/tasks'}
                            >
                                View Tasks
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 flex flex-col justify-between h-full">
                        <div>
                            <div className="flex items-center mb-4">
                                <div className="bg-green-100 p-2 rounded-lg">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <h3 className="text-lg text-gray-600 font-semibold ml-3">Projects</h3>
                            </div>
                            <p className="text-gray-600 mb-4">Organize tasks by projects</p>
                        </div>
                        <div className="mt-auto">
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors w-full disabled:bg-gray-300 disabled:cursor-not-allowed"
                                disabled={!apiStatus}
                            >
                                View Projects
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 flex flex-col justify-between h-full">
                        <div>
                            <div className="flex items-center mb-4">
                                <div className="bg-purple-100 p-2 rounded-lg">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg text-gray-600 font-semibold ml-3">Team</h3>
                            </div>
                            <p className="text-gray-600 mb-4">Manage team members and assignments</p>
                        </div>
                        <div className="mt-auto">
                            <button
                                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors w-full disabled:bg-gray-300 disabled:cursor-not-allowed"
                                disabled={!apiStatus}
                            >
                                View Team
                            </button>
                        </div>
                    </div>
                </div>

                {/* Architecture Info */}
                <div className="mt-8 bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Architecture</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="border-l-4 border-blue-500 pl-4">
                            <h3 className="font-semibold text-blue-600">Frontend</h3>
                            <p className="text-gray-600">Next.js with React</p>
                        </div>
                        <div className="border-l-4 border-green-500 pl-4">
                            <h3 className="font-semibold text-green-600">Backend</h3>
                            <p className="text-gray-600">Node.js + Express</p>
                        </div>
                        <div className="border-l-4 border-purple-500 pl-4">
                            <h3 className="font-semibold text-purple-600">Database</h3>
                            <p className="text-gray-600">MongoDB</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
