'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Loader2, Mail, Lock, User, Shield, Briefcase, Settings } from 'lucide-react';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleRoleChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            role: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await register(formData.name, formData.email, formData.password, formData.role);
        } catch (err: any) {
            setError(err.message || 'An error occurred during registration');
        } finally {
            setLoading(false);
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
                        <CardTitle className="text-2xl text-[#425183]">Create Account</CardTitle>
                        <CardDescription className="text-[#8995cd]">
                            Join our task management platform
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {error && (
                            <div className="mb-6 p-4 bg-destructive/20 border border-destructive/50 rounded-lg">
                                <p className="text-destructive text-sm">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-gray-700 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your full name"
                                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#990100] focus:ring-[#990100]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-700 flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your email"
                                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#990100] focus:ring-[#990100]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-700 flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    Role
                                </Label>
                                <Select value={formData.role} onValueChange={handleRoleChange}>
                                    <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-[#990100] focus:ring-[#990100]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-gray-200">
                                        <SelectItem value="user" className="text-gray-900 focus:bg-[#990100]/10">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                Developer
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="manager" className="text-gray-900 focus:bg-[#990100]/10">
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="w-4 h-4" />
                                                Manager
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="admin" className="text-gray-900 focus:bg-[#990100]/10">
                                            <div className="flex items-center gap-2">
                                                <Settings className="w-4 h-4" />
                                                Admin
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-700 flex items-center gap-2">
                                    <Lock className="w-4 h-4" />
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your password"
                                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#990100] focus:ring-[#990100]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-gray-700 flex items-center gap-2">
                                    <Lock className="w-4 h-4" />
                                    Confirm Password
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    placeholder="Confirm your password"
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
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Create Account
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <Link
                                    href="/login"
                                    className="text-[#990100] hover:text-[#b90504] font-semibold transition-colors duration-200"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>

                        {/* Role Descriptions */}
                        <Card className="mt-6 bg-gray-50/50 border-gray-200">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm text-gray-900">Role Permissions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <User className="w-3 h-3 text-[#990100]" />
                                        <Badge variant="secondary" className="bg-[#dc2626]/10 text-[#dc2626] text-xs border-[#dc2626]/20">Developer</Badge>
                                    </div>
                                    <span className="text-gray-600">View and manage own tasks</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="w-3 h-3 text-[#990100]" />
                                        <Badge variant="secondary" className="bg-[#b90504]/10 text-[#b90504] text-xs border-[#b90504]/20">Manager</Badge>
                                    </div>
                                    <span className="text-gray-600">Assign tasks to team members</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <Settings className="w-3 h-3 text-[#990100]" />
                                        <Badge variant="secondary" className="bg-[#990100]/10 text-[#990100] text-xs border-[#990100]/20">Admin</Badge>
                                    </div>
                                    <span className="text-gray-600">Full system access</span>
                                </div>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RegisterPage;
