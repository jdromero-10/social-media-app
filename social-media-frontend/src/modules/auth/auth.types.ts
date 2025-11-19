/**
 * Tipos relacionados con la autenticación
 */

/**
 * DTO para el login (request)
 */
export interface LoginDto {
  email: string;
  password: string;
}

/**
 * DTO para el registro (request)
 */
export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  username: string;
}

/**
 * Datos básicos del usuario retornados por el backend
 */
export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  imageUrl?: string | null;
  bio?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Respuesta de autenticación (login/register)
 * El token ahora se maneja mediante cookies HTTP-only
 */
export interface AuthResponse {
  access_token?: string; // Opcional, ya que ahora se maneja con cookies
  user: User;
}

/**
 * Estado de autenticación en la aplicación
 * El token ahora se maneja mediante cookies HTTP-only
 */
export interface AuthState {
  user: User | null;
  token: string | null; // Mantenido para compatibilidad, pero no se usa
  isAuthenticated: boolean;
}
