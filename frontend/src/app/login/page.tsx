'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogIn, Loader2, Mail, Lock, User, Briefcase, Settings } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
        } catch (err: any) {
            setError(err.message || 'An error occurred during login');
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
                            <LogIn className="w-6 h-6 text-[#5a689c]" />
                        </div>
                        <CardTitle className="text-2xl text-[#425183]">Welcome Back</CardTitle>
                        <CardDescription className="text-[#8995cd]">
                            Sign in to your account
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
                                <Label htmlFor="email" className="text-[#425183] flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Enter your email"
                                    className="bg-white/60 backdrop-blur border-white/50 text-[#425183] placeholder-[#8995cd] focus:border-[#5a689c] focus:ring-[#5a689c]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-[#425183] flex items-center gap-2">
                                    <Lock className="w-4 h-4" />
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Enter your password"
                                    className="bg-white/60 backdrop-blur border-white/50 text-[#425183] placeholder-[#8995cd] focus:border-[#5a689c] focus:ring-[#5a689c]"
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
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Sign In
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-[#8995cd]">
                                Don't have an account?{' '}
                                <Link
                                    href="/register"
                                    className="text-[#5a689c] hover:text-[#727fb4] font-semibold transition-colors duration-200"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>

                        {/* Demo Users */}
                        <Card className="mt-6 bg-gradient-to-br from-white/40 to-blue-50/40 backdrop-blur border-white/30">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm text-[#425183]">Demo Users</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <Settings className="w-3 h-3 text-[#5a689c]" />
                                        <Badge variant="secondary" className="bg-[#5a689c]/20 text-[#425183] text-xs border-[#5a689c]/30">Admin</Badge>
                                    </div>
                                    <span className="text-[#8995cd]">admin@demo.com / password</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="w-3 h-3 text-[#5a689c]" />
                                        <Badge variant="secondary" className="bg-[#727fb4]/20 text-[#425183] text-xs border-[#727fb4]/30">Manager</Badge>
                                    </div>
                                    <span className="text-[#8995cd]">manager@demo.com / password</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <User className="w-3 h-3 text-[#5a689c]" />
                                        <Badge variant="secondary" className="bg-[#8995cd]/20 text-[#425183] text-xs border-[#8995cd]/30">User</Badge>
                                    </div>
                                    <span className="text-[#8995cd]">user@demo.com / password</span>
                                </div>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default LoginPage;
