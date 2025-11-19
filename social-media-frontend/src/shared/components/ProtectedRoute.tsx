import { Navigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/apiClient';
import type { User } from '../../modules/auth/auth.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Componente que protege rutas requiriendo autenticación
 * Verifica si el usuario está autenticado antes de mostrar el contenido
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();

  // Verificar autenticación usando el endpoint /auth/me
  const { data: user, isLoading, isError } = useQuery<User | null>({
    queryKey: ['auth-check'],
    queryFn: async () => {
      try {
        return await apiClient.get<User>('/auth/me');
      } catch (error: unknown) {
        // Si hay un error 401, el usuario no está autenticado
        if (
          error &&
          typeof error === 'object' &&
          'statusCode' in error &&
          (error as { statusCode: number }).statusCode === 401
        ) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
    staleTime: 0, // No usar caché, siempre verificar
    gcTime: 0, // No mantener en caché
  });

  // Mostrar loading mientras se verifica
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si hay error o no hay usuario, redirigir a login
  if (isError || !user) {
    // Guardar la ubicación actual para redirigir después del login
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Usuario autenticado, mostrar contenido
  return <>{children}</>;
};

