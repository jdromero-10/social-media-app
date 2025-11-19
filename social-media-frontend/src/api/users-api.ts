import { apiClient } from './apiClient';
import type { User } from '../modules/auth/auth.types';

/**
 * DTO para crear un nuevo usuario
 */
export interface CreateUserDto {
  email: string;
  password: string;
}

/**
 * DTO para actualizar el perfil de usuario
 */
export interface UpdateProfileDto {
  name?: string;
  bio?: string | null;
  imageUrl?: string | null;
}

/**
 * Servicio API para operaciones de usuarios
 */
export const usersApi = {
  /**
   * Obtiene todos los usuarios
   * @returns Lista de usuarios
   */
  getAll: async (): Promise<User[]> => {
    return apiClient.get<User[]>('/users');
  },

  /**
   * Obtiene un usuario por su ID
   * @param id - ID del usuario (UUID)
   * @returns Datos del usuario
   */
  getById: async (id: string): Promise<User> => {
    return apiClient.get<User>(`/users/${id}`);
  },

  /**
   * Crea un nuevo usuario
   * @param userData - Datos del nuevo usuario
   * @returns Usuario creado
   */
  create: async (userData: CreateUserDto): Promise<User> => {
    return apiClient.post<User>('/users', userData);
  },

  /**
   * Actualiza el perfil del usuario actual
   * @param userId - ID del usuario a actualizar
   * @param userData - Datos a actualizar
   * @returns Usuario actualizado
   */
  updateProfile: async (
    userId: string,
    userData: UpdateProfileDto,
  ): Promise<User> => {
    return apiClient.put<User>(`/users/${userId}`, userData);
  },
};

