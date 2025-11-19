import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/hooks/useAuth';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/apiClient';
import type { User } from '../auth/auth.types';

/**
 * Página principal del dashboard después del login
 */
export const DashboardPage = () => {
  const navigate = useNavigate();
  const { logout, isLoggingOut } = useAuth();

  // Obtener datos del usuario actual
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      return apiClient.get<User>('/auth/me');
    },
    retry: false,
  });

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600 text-lg">
              Bienvenido a tu panel de control
            </p>
          </div>
          <Button
            onClick={handleLogout}
            isLoading={isLoggingOut}
            variant="outline"
            className="whitespace-nowrap"
          >
            Cerrar Sesión
          </Button>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card de bienvenida */}
          <Card className="md:col-span-2 lg:col-span-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">¡Bienvenido de nuevo!</h2>
                {user ? (
                  <div className="space-y-1">
                    <p className="text-[#eafffd]">
                      <span className="font-semibold text-white">Email:</span> {user.email}
                    </p>
                    {user.name && (
                      <p className="text-[#eafffd]">
                        <span className="font-semibold text-white">Nombre:</span> {user.name}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-blue-100">
                    Sesión iniciada correctamente. Aquí puedes agregar más funcionalidades.
                  </p>
                )}
              </div>
              <div className="hidden sm:block">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Card>

          {/* Placeholder para futuras funcionalidades */}
          <Card className="hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#eafffd] flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-[#00b1c0]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Posts</h3>
            </div>
            <p className="text-gray-600">
              Aquí se mostrarán tus publicaciones y contenido compartido
            </p>
          </Card>

          <Card className="hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Notificaciones</h3>
            </div>
            <p className="text-gray-600">
              Mantente al día con tus notificaciones y actualizaciones
            </p>
          </Card>

          <Card className="hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Perfil</h3>
            </div>
            <p className="text-gray-600">
              Gestiona tu información personal y configuración de cuenta
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

