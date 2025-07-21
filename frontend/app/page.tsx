"use client"

import Link from 'next/link';
import { useAuth } from './context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            TaskManager Pro
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Organiza tu trabajo de manera eficiente y profesional.
            Gestiona tareas, establece prioridades y mantén el control total de tus proyectos.
          </p>

          {!user ? (
            <div className="flex justify-center space-x-4">
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg"
              >
                Comenzar Gratis
              </Link>
              <Link
                href="/login"
                className="bg-white hover:bg-slate-50 text-slate-900 px-8 py-3 rounded-lg font-semibold border border-slate-300 transition-colors shadow-lg"
              >
                Iniciar Sesión
              </Link>
            </div>
          ) : (
            <div className="flex justify-center space-x-4">
              <Link
                href="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg"
              >
                Ir al Dashboard
              </Link>
              <Link
                href="/tasks"
                className="bg-white hover:bg-slate-50 text-slate-900 px-8 py-3 rounded-lg font-semibold border border-slate-300 transition-colors shadow-lg"
              >
                Ver Tareas
              </Link>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Gestión Intuitiva</h3>
            <p className="text-slate-600">
              Interfaz limpia y profesional para gestionar tus tareas de manera eficiente.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Prioridades Claras</h3>
            <p className="text-slate-600">
              Sistema de prioridades que te ayuda a enfocarte en lo más importante.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Seguimiento Completo</h3>
            <p className="text-slate-600">
              Visualiza el progreso de tus tareas y mantén el control total.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
