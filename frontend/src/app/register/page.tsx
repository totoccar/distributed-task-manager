'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Loader2, Mail, Lock, User, CheckCircle } from 'lucide-react';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        confirmEmail: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');
    const { register } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.email !== formData.confirmEmail) {
            setError('Los emails no coinciden');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            // Enviar solo name, email y password - el rol se asignará automáticamente como 'user'
            await register(formData.name, formData.email, formData.password, 'user');
            // Si el registro es exitoso, mostrar mensaje de verificación
            setSuccess(true);
            setRegisteredEmail(formData.email);
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error durante el registro');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setError('');
        setGoogleLoading(true);

        try {
            // Aquí implementarías la lógica de registro con Google
            // Por ahora solo simularemos el proceso
            console.log('Iniciando registro con Google...');
            // Redirigir a Google OAuth o usar Google SDK
            window.location.href = '/api/auth/google';
        } catch (err: any) {
            setError(err.message || 'Error al conectar con Google');
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-slate-50 to-blue-50 p-4">
            <div className="w-full max-w-md">
                <Card className="bg-white/70 backdrop-blur-xl border-white/40 shadow-xl">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 w-12 h-12 bg-gradient-to-br from-[#5a689c]/20 to-[#727fb4]/20 backdrop-blur rounded-full flex items-center justify-center">
                            <UserPlus className="w-6 h-6 text-[#5a689c]" />
                        </div>
                        <CardTitle className="text-2xl text-[#425183]">Crear Cuenta</CardTitle>
                        <CardDescription className="text-[#8995cd]">
                            Únete a nuestra plataforma de gestión de tareas
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {/* Success Message */}
                        {success ? (
                            <div className="text-center space-y-4">
                                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        ¡Cuenta creada exitosamente!
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        Se ha enviado un correo de verificación a <strong>{registeredEmail}</strong>
                                    </p>
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                                        <p className="text-yellow-800 text-sm">
                                            <strong>Importante:</strong> Revisa tu bandeja de entrada y haz clic en el enlace de verificación
                                            para activar tu cuenta antes de iniciar sesión.
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <Button
                                            onClick={() => {
                                                setSuccess(false);
                                                setFormData({
                                                    name: '',
                                                    email: '',
                                                    confirmEmail: '',
                                                    password: '',
                                                    confirmPassword: ''
                                                });
                                            }}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            Crear otra cuenta
                                        </Button>
                                        <Link href="/login">
                                            <Button className="w-full">
                                                Ir a iniciar sesión
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {error && (
                                    <div className="mb-6 p-4 bg-destructive/20 border border-destructive/50 rounded-lg">
                                        <p className="text-destructive text-sm">{error}</p>
                                    </div>
                                )}



                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-gray-700 flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Nombre Completo
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Ingresa tu nombre completo"
                                            className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#990100] focus:ring-[#990100]"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-gray-700 flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            Correo Electrónico
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="Ingresa tu correo electrónico"
                                            className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#990100] focus:ring-[#990100]"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmEmail" className="text-gray-700 flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            Confirmar Correo Electrónico
                                        </Label>
                                        <Input
                                            id="confirmEmail"
                                            name="confirmEmail"
                                            type="email"
                                            value={formData.confirmEmail}
                                            onChange={handleChange}
                                            required
                                            placeholder="Confirma tu correo electrónico"
                                            className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#990100] focus:ring-[#990100]"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-gray-700 flex items-center gap-2">
                                            <Lock className="w-4 h-4" />
                                            Contraseña
                                        </Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            placeholder="Ingresa tu contraseña"
                                            className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#990100] focus:ring-[#990100]"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword" className="text-gray-700 flex items-center gap-2">
                                            <Lock className="w-4 h-4" />
                                            Confirmar Contraseña
                                        </Label>
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            placeholder="Confirma tu contraseña"
                                            className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#990100] focus:ring-[#990100]"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full"
                                        size="lg"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creando cuenta...
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="mr-2 h-4 w-4" />
                                                Crear Cuenta
                                            </>
                                        )}
                                    </Button>
                                </form>

                                {/* Google Sign Up */}
                                <div className="mb-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full mt-2 border-gray-300 hover:bg-gray-50"
                                        onClick={handleGoogleSignUp}
                                        disabled={googleLoading}
                                    >
                                        {googleLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Conectando con Google...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                                </svg>
                                                Registrarse con Google
                                            </>
                                        )}
                                    </Button>

                                    <div className="relative mt-4">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-gray-300" />
                                        </div>

                                    </div>
                                </div>
                                <div className="mt-6 text-center">
                                    <p className="text-gray-600">
                                        ¿Ya tienes una cuenta?{' '}
                                        <Link
                                            href="/login"
                                            className="text-[#990100] hover:text-[#b90504] font-semibold transition-colors duration-200"
                                        >
                                            Iniciar sesión
                                        </Link>
                                    </p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RegisterPage;
