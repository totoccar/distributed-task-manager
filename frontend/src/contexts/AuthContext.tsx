'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
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

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, role?: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
    isAuthenticated: boolean;
    hasRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            // Verificar si el token sigue siendo válido
            verifyToken(storedToken);
        } else {
            setLoading(false);
        }
    }, []);

    const verifyToken = async (tokenToVerify: string) => {
        try {
            const response = await fetch(`${API_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${tokenToVerify}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.data);
                setToken(tokenToVerify);
            } else {
                // Token inválido, limpiar
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setToken(null);
                setUser(null);
            }
        } catch (error) {
            console.error('Error verifying token:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            const { user: userData, token: userToken } = data.data;

            setUser(userData);
            setToken(userToken);
            localStorage.setItem('token', userToken);
            localStorage.setItem('user', JSON.stringify(userData));

            router.push('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (name: string, email: string, password: string, role: string = 'user') => {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, role }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            const { user: userData, token: userToken } = data.data;

            setUser(userData);
            setToken(userToken);
            localStorage.setItem('token', userToken);
            localStorage.setItem('user', JSON.stringify(userData));

            router.push('/dashboard');
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    const hasRole = (roles: string[]): boolean => {
        return user ? roles.includes(user.role) : false;
    };

    const value = {
        user,
        token,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
        hasRole,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
