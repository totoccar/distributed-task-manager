"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const hideNavbar = pathname === "/login" || pathname === "/register";
    return (
        <html lang="en">
            <head>
                <script src="https://accounts.google.com/gsi/client" async defer></script>
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <AuthProvider>
                    {/* Navbar solo si no es login o register */}
                    {!hideNavbar && <Navbar />}
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
