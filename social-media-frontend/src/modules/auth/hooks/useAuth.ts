import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../../../api/auth-api';
import type { ApiError } from '../../../api/apiClient';
import type { LoginDto, RegisterDto } from '../auth.types';

/**
 * Helper para extraer el mensaje de error de manera segura
 */
function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object') {
    // Si es un ApiError
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
    // Si es un Error estándar
    if (error instanceof Error) {
      return error.message;
    }
  }
  return 'Ha ocurrido un error inesperado';
}

/**
 * Helper para convertir errores a ApiError
 */
function toApiError(error: unknown): ApiError {
  if (error && typeof error === 'object' && 'statusCode' in error) {
    return error as ApiError;
  }
  
  return {
    message: getErrorMessage(error),
    statusCode: 0,
    error: 'UnknownError',
  };
}

/**
 * Hook para manejar la autenticación (login y registro)
 * Utiliza TanStack Query mutations para manejar las peticiones
 */
export const useAuth = () => {
  const queryClient = useQueryClient();

  /**
   * Mutation para login
   */
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginDto) => {
      try {
        return await authApi.login(credentials);
      } catch (error) {
        // Asegurar que el error sea del tipo ApiError
        throw toApiError(error);
      }
    },
    onSuccess: async () => {
      // El token ahora se maneja automáticamente mediante cookies HTTP-only
      // No es necesario guardarlo manualmente
      console.log('Login exitoso, token guardado en cookie');
      
      // Invalidar queries de autenticación para forzar una nueva verificación
      // Esperar a que se complete la invalidación antes de continuar
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['auth-check'] }),
        queryClient.invalidateQueries({ queryKey: ['currentUser'] }),
      ]);
      
      // Opcional: puedes guardar los datos del usuario
      // o actualizar un store global (Zustand, Context, etc.)
    },
    onError: (error) => {
      // El error ya viene tipado desde apiClient
      console.error('Error en login:', error);
    },
  });

  /**
   * Mutation para registro
   */
  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterDto) => {
      try {
        return await authApi.register(userData);
      } catch (error) {
        // Asegurar que el error sea del tipo ApiError
        throw toApiError(error);
      }
    },
    onSuccess: async () => {
      // El token ahora se maneja automáticamente mediante cookies HTTP-only
      // No es necesario guardarlo manualmente
      console.log('Registro exitoso, token guardado en cookie');
      
      // Invalidar queries de autenticación para forzar una nueva verificación
      // Esperar a que se complete la invalidación antes de continuar
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['auth-check'] }),
        queryClient.invalidateQueries({ queryKey: ['currentUser'] }),
      ]);
      
      // Opcional: puedes guardar los datos del usuario
    },
    onError: (error) => {
      console.error('Error en registro:', error);
    },
  });

  /**
   * Mutation para logout
   */
  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        return await authApi.logout();
      } catch (error) {
        throw toApiError(error);
      }
    },
    onSuccess: () => {
      console.log('Logout exitoso');
      // Opcional: invalidar queries relacionadas con el usuario
      // queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      console.error('Error en logout:', error);
    },
  });

  /**
   * Función helper para logout
   */
  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    // Login
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error as ApiError | null,
    loginSuccess: loginMutation.isSuccess,

    // Register
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error as ApiError | null,
    registerSuccess: registerMutation.isSuccess,

    // Logout
    logout,
    logoutAsync: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
    logoutError: logoutMutation.error as ApiError | null,
    logoutSuccess: logoutMutation.isSuccess,
  };
};

