import { apiClient } from './apiClient';
import type {
  Post,
  CreatePostDto,
  UpdatePostDto,
} from '../modules/posts/posts.types';

/**
 * Servicio API para operaciones de posts
 */
export const postsApi = {
  /**
   * Obtiene todos los posts con paginación opcional
   * @param page - Número de página (opcional)
   * @param limit - Límite de posts por página (opcional)
   * @returns Array de posts
   */
  getAll: async (page?: number, limit?: number): Promise<Post[]> => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const queryString = params.toString();
    const endpoint = `/posts${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get<Post[]>(endpoint);
  },

  /**
   * Obtiene un post por su ID
   * @param id - UUID del post
   * @returns Post con todas sus relaciones
   */
  getById: async (id: string): Promise<Post> => {
    return apiClient.get<Post>(`/posts/${id}`);
  },

  /**
   * Obtiene todos los posts de un usuario específico
   * @param userId - UUID del usuario
   * @param page - Número de página (opcional)
   * @param limit - Límite de posts por página (opcional)
   * @returns Array de posts del usuario
   */
  getByUserId: async (
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<Post[]> => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const queryString = params.toString();
    const endpoint = `/posts/user/${userId}${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get<Post[]>(endpoint);
  },

  /**
   * Crea un nuevo post
   * @param postData - Datos del post a crear
   * @returns Post creado
   */
  create: async (postData: CreatePostDto): Promise<Post> => {
    // Usar FormData para soportar envío de archivos
    const formData = new FormData();
    formData.append('title', postData.title);
    
    if (postData.description) {
      formData.append('description', postData.description);
    }
    if (postData.content) {
      formData.append('content', postData.content);
    }
    if (postData.imageUrl) {
      formData.append('imageUrl', postData.imageUrl);
    }
    if (postData.type) {
      formData.append('type', postData.type);
    }

    // Usar fetch directamente para FormData (no usar JSON.stringify)
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3006';
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      credentials: 'include',
      // No establecer Content-Type, el navegador lo hará automáticamente con el boundary
      body: formData,
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      const isJson = contentType?.includes('application/json');
      
      let error;
      if (isJson) {
        error = await response.json();
      } else {
        error = {
          message: 'Error al crear el post',
          statusCode: response.status,
        };
      }
      
      throw {
        message: error.message || 'Error al crear el post',
        statusCode: response.status,
        error: error.error,
      };
    }

    return response.json();
  },

  /**
   * Actualiza un post existente
   * @param id - UUID del post a actualizar
   * @param postData - Datos a actualizar
   * @returns Post actualizado
   */
  update: async (id: string, postData: UpdatePostDto): Promise<Post> => {
    return apiClient.put<Post>(`/posts/${id}`, postData);
  },

  /**
   * Elimina un post
   * @param id - UUID del post a eliminar
   * @returns Mensaje de confirmación
   */
  delete: async (id: string): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>(`/posts/${id}`);
  },
};

