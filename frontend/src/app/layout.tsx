"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";
import Head from "next/head";
import Script from "next/script";

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
    const hideNavbar = pathname === "/login" || pathname === "/register" || pathname === "/";
    return (
        <html lang="es">
            <head>
                <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <AuthProvider>
                    {!hideNavbar && <Navbar />}
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
