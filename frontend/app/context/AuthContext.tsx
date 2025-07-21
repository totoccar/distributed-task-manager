"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simular verificación de sesión guardada
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true);

        // Simular API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulación simple de autenticación
        if (email && password.length >= 6) {
            const mockUser: User = {
                id: '1',
                name: email.split('@')[0],
                email: email
            };
            setUser(mockUser);
            localStorage.setItem('user', JSON.stringify(mockUser));
            setIsLoading(false);
            return true;
        }

        setIsLoading(false);
        return false;
    };

    const register = async (name: string, email: string, password: string): Promise<boolean> => {
        setIsLoading(true);

        // Simular API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulación simple de registro
        if (name && email && password.length >= 6) {
            const mockUser: User = {
                id: '1',
                name: name,
                email: email
            };
            setUser(mockUser);
            localStorage.setItem('user', JSON.stringify(mockUser));
            setIsLoading(false);
            return true;
        }

        setIsLoading(false);
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
