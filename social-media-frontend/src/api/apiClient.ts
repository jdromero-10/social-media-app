/**
 * URL base del backend
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3006';

/**
 * Tipos de respuesta de la API
 */
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/**
 * Clase para manejar peticiones HTTP al backend
 */
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Obtiene los headers por defecto para las peticiones
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    return headers;
  }

  /**
   * Maneja la respuesta de la API
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
      let error: ApiError;

      try {
        if (isJson) {
          const errorData = await response.json();
          error = {
            message: errorData.message || this.getDefaultErrorMessage(response.status),
            statusCode: response.status,
            error: errorData.error,
          };
        } else {
          error = {
            message: this.getDefaultErrorMessage(response.status),
            statusCode: response.status,
            error: response.statusText,
          };
        }
      } catch {
        // Si no se puede parsear el error, usar mensaje por defecto
        error = {
          message: this.getDefaultErrorMessage(response.status),
          statusCode: response.status,
          error: 'ParseError',
        };
      }

      throw error;
    }

    if (isJson) {
      return await response.json();
    }

    return {} as T;
  }

  /**
   * Obtiene un mensaje de error por defecto según el código de estado
   */
  private getDefaultErrorMessage(statusCode: number): string {
    switch (statusCode) {
      case 400:
        return 'Solicitud inválida. Por favor, verifica los datos enviados.';
      case 401:
        return 'Credenciales inválidas. Verifica tu email y contraseña.';
      case 403:
        return 'No tienes permisos para realizar esta acción.';
      case 404:
        return 'Recurso no encontrado.';
      case 409:
        return 'El correo electrónico ya está en uso.';
      case 422:
        return 'Los datos proporcionados no son válidos.';
      case 500:
        return 'Error interno del servidor. Por favor, intenta más tarde.';
      case 503:
        return 'Servicio no disponible. Por favor, intenta más tarde.';
      default:
        return `Error ${statusCode}: Ha ocurrido un error inesperado.`;
    }
  }

  /**
   * Maneja errores de red y otros errores inesperados
   */
  private handleNetworkError(error: unknown): ApiError {
    // Si es un error de tipo ApiError, lo retornamos tal cual
    if (error && typeof error === 'object' && 'statusCode' in error) {
      return error as ApiError;
    }

    // Si es un error de red (fetch falló)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
        statusCode: 0,
        error: 'NetworkError',
      };
    }

    // Si es un error desconocido
    return {
      message: error instanceof Error ? error.message : 'Ha ocurrido un error inesperado',
      statusCode: 0,
      error: 'UnknownError',
    };
  }

  /**
   * Realiza una petición GET
   */
  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include', // Incluir cookies en la petición
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      throw this.handleNetworkError(error);
    }
  }

  /**
   * Realiza una petición POST
   */
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
        credentials: 'include', // Incluir cookies en la petición
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      throw this.handleNetworkError(error);
    }
  }

  /**
   * Realiza una petición PUT
   */
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
        credentials: 'include', // Incluir cookies en la petición
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      throw this.handleNetworkError(error);
    }
  }

  /**
   * Realiza una petición PATCH
   */
  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
        credentials: 'include', // Incluir cookies en la petición
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      throw this.handleNetworkError(error);
    }
  }

  /**
   * Realiza una petición DELETE
   */
  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        credentials: 'include', // Incluir cookies en la petición
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      throw this.handleNetworkError(error);
    }
  }
}

/**
 * Instancia única del cliente API
 */
export const apiClient = new ApiClient(API_BASE_URL);

