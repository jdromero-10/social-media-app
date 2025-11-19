import { apiClient } from './apiClient';
import type { LoginDto, RegisterDto, AuthResponse } from '../modules/auth/auth.types';

/**
 * Servicio API para operaciones de autenticación
 */
export const authApi = {
  /**
   * Inicia sesión con email y password
   * @param credentials - Credenciales de login (email y password)
   * @returns Respuesta con datos del usuario (el token se guarda en cookie)
   */
  login: async (credentials: LoginDto): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  /**
   * Registra un nuevo usuario
   * @param userData - Datos del nuevo usuario
   * @returns Respuesta con datos del usuario (el token se guarda en cookie)
   */
  register: async (userData: RegisterDto): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/register', userData);
  },

  /**
   * Cierra sesión del usuario
   * @returns Mensaje de confirmación
   */
  logout: async (): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>('/auth/logout');
  },

  /**
   * Valida si un campo (email o username) es único en la base de datos
   * @param field - El campo a validar ('email' o 'username')
   * @param value - El valor a verificar
   * @returns Objeto con isUnique y mensaje opcional
   */
  validateField: async (
    field: 'email' | 'username',
    value: string,
  ): Promise<{ isUnique: boolean; message?: string }> => {
    return apiClient.post<{ isUnique: boolean; message?: string }>(
      '/auth/validate',
      { field, value },
    );
  },
};

