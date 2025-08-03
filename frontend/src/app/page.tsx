'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rocket, Users, BarChart3, User, Briefcase, Settings, Loader2 } from 'lucide-react';

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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-[#990100] mx-auto mb-4" />
                    <p className="text-gray-700 text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    if (isAuthenticated) {
        return null; // El useEffect manejará la redirección
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50">
            <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Hero Section */}
                    <div className="mb-12">
                        <h1 className="text-6xl md:text-7xl font-bold text-[#425183] mb-6 leading-tight">
                            Distributed
                            <span className="block bg-gradient-to-r from-[#5a689c] to-[#727fb4] bg-clip-text text-transparent">
                                Task Manager
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-[#8995cd] mb-8 leading-relaxed">
                            Collaborate, organize, and achieve more with our modern task management platform
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <Card className="bg-white/70 backdrop-blur-xl border-white/40 hover:border-[#5a689c]/50 transition-all duration-300 shadow-lg hover:shadow-xl">
                            <CardHeader className="text-center">
                                <Rocket className="h-12 w-12 text-[#5a689c] mx-auto mb-2" />
                                <CardTitle className="text-[#425183]">Fast & Efficient</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-[#8995cd]">
                                    Streamlined workflows for maximum productivity
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/70 backdrop-blur-xl border-white/40 hover:border-[#5a689c]/50 transition-all duration-300 shadow-lg hover:shadow-xl">
                            <CardHeader className="text-center">
                                <Users className="h-12 w-12 text-[#5a689c] mx-auto mb-2" />
                                <CardTitle className="text-[#425183]">Team Collaboration</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-[#8995cd]">
                                    Work together seamlessly with role-based access
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/70 backdrop-blur-xl border-white/40 hover:border-[#5a689c]/50 transition-all duration-300 shadow-lg hover:shadow-xl">
                            <CardHeader className="text-center">
                                <BarChart3 className="h-12 w-12 text-[#5a689c] mx-auto mb-2" />
                                <CardTitle className="text-[#425183]">Analytics & Reports</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-[#8995cd]">
                                    Track progress with detailed insights
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button asChild size="lg" className="w-full sm:w-auto">
                            <Link href="/login">
                                Sign In
                            </Link>
                        </Button>

                        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                            <Link href="/register">
                                Get Started
                            </Link>
                        </Button>
                    </div>

                    {/* Demo Info */}
                    <Card className="mt-12 bg-white/70 backdrop-blur-xl border-white/40 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-[#425183]">Try Demo Accounts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="bg-gradient-to-br from-white/60 to-blue-50/60 backdrop-blur rounded-lg p-4 border border-white/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <User className="h-4 w-4 text-[#5a689c]" />
                                        <Badge variant="secondary" className="bg-[#a1ace5]/20 text-[#425183] border-[#a1ace5]/30">User Account</Badge>
                                    </div>
                                    <div className="text-[#8995cd]">user@demo.com / password</div>
                                </div>
                                <div className="bg-gradient-to-br from-white/60 to-blue-50/60 backdrop-blur rounded-lg p-4 border border-white/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Briefcase className="h-4 w-4 text-[#5a689c]" />
                                        <Badge variant="secondary" className="bg-[#8995cd]/20 text-[#425183] border-[#8995cd]/30">Manager Account</Badge>
                                    </div>
                                    <div className="text-[#8995cd]">manager@demo.com / password</div>
                                </div>
                                <div className="bg-gradient-to-br from-white/60 to-blue-50/60 backdrop-blur rounded-lg p-4 border border-white/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Settings className="h-4 w-4 text-[#5a689c]" />
                                        <Badge variant="secondary" className="bg-[#727fb4]/20 text-[#425183] border-[#727fb4]/30">Admin Account</Badge>
                                    </div>
                                    <div className="text-[#8995cd]">admin@demo.com / password</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
