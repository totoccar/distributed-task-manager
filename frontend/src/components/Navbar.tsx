"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, FolderKanban, ListChecks, LogOut } from "lucide-react";

export default function Navbar() {
    const { user } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const handleLogout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
    };
    // Función para obtener iniciales del usuario
    const getInitials = (name: string | undefined) => {
        if (!name) return "U";
        const parts = name.trim().split(" ");
        if (parts.length === 1) return parts[0][0].toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    return (
        <nav className="fixed top-0 left-0 w-full bg-card/90 backdrop-blur border-b border-border z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-xl font-bold text-primary hover:text-primary transition-colors">TaskManager</Link>
                    <span className="hidden sm:inline px-3 py-1 rounded-full text-xs font-medium border bg-destructive/20 text-destructive border-destructive/50">SOLO ADMIN</span>
                </div>
                <div className="relative">
                    <button
                        className="flex items-center gap-2 px-4 py-2 text-card-foreground rounded-lg font-medium transition-all"
                        onClick={() => setMenuOpen((open) => !open)}
                    >
                        <div className="w-8 h-8 rounded-full bg-primary hover:bg-primary/80 transition-all flex items-center justify-center text-primary-foreground text-base" style={{ fontFamily: 'var(--font-sans)', fontWeight: 500 }}>
                            {getInitials(user?.name)}
                        </div>
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-10">
                            <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                                <span className="font-medium">Hola, {user?.name?.split(" ")[0] || "Usuario"}!</span>
                            </div>
                            <ul className="py-2">
                                <li>
                                    <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-card-foreground hover:bg-muted/40 transition-colors">
                                        <LayoutDashboard className="w-4 h-4 text-primary" />
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/projects" className="flex items-center gap-2 px-4 py-2 text-sm text-card-foreground hover:bg-muted/40 transition-colors">
                                        <FolderKanban className="w-4 h-4 text-primary" />
                                        Proyectos
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/tasks" className="flex items-center gap-2 px-4 py-2 text-sm text-card-foreground hover:bg-muted/40 transition-colors">
                                        <ListChecks className="w-4 h-4 text-primary" />
                                        Tareas
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors">
                                        <LogOut className="w-4 h-4 text-destructive" />
                                        Cerrar sesión
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
