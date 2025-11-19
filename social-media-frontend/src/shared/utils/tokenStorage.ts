/**
 * Utilidades para manejar el almacenamiento de tokens JWT
 */

const TOKEN_KEY = 'auth_token';

/**
 * Guarda el token JWT en localStorage
 */
export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Obtiene el token JWT de localStorage
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Elimina el token JWT de localStorage
 */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Verifica si existe un token guardado
 */
export const hasToken = (): boolean => {
  return getToken() !== null;
};
