'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRoles?: string[];
    redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRoles = [],
    redirectTo = '/login'
}) => {
    const { user, loading, isAuthenticated, hasRole } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                router.push(redirectTo);
                return;
            }

            if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
                router.push('/unauthorized');
                return;
            }
        }
    }, [loading, isAuthenticated, user, router, requiredRoles, hasRole, redirectTo]);

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

    if (!isAuthenticated) {
        return null; // El useEffect manejará la redirección
    }

    if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
        return null; // El useEffect manejará la redirección
    }

    return <>{children}</>;
};

export default ProtectedRoute;
