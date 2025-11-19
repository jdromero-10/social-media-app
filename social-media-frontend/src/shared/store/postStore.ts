import { create } from 'zustand';
import { postsApi } from '../../api/posts-api';
import { useToastStore } from './toastStore';
import type { Post, CreatePostDto, UpdatePostDto } from '../../modules/posts/posts.types';
import type { ApiError } from '../../api/apiClient';

/**
 * Estado del PostStore
 */
interface PostState {
  posts: Post[];
  isLoading: boolean;
  error: ApiError | null;
  page: number;
  limit: number;
  hasMore: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

/**
 * Acciones del PostStore
 */
interface PostActions {
  // Fetch posts
  fetchPosts: (page?: number, limit?: number, append?: boolean) => Promise<void>;
  fetchPostById: (id: string) => Promise<Post | null>;
  fetchUserPosts: (userId: string, page?: number, limit?: number) => Promise<void>;
  
  // CRUD operations
  createPost: (postData: CreatePostDto) => Promise<Post | null>;
  updatePost: (id: string, postData: UpdatePostDto) => Promise<Post | null>;
  deletePost: (id: string) => Promise<boolean>;
  
  // State management
  reset: () => void;
  setError: (error: ApiError | null) => void;
  
  // Optimistic updates
  addPost: (post: Post) => void;
  updatePostInStore: (id: string, postData: Partial<Post>) => void;
  removePostFromStore: (id: string) => void;
  toggleLike: (postId: string, userId: string) => void;
}

type PostStore = PostState & PostActions;

/**
 * Estado inicial
 */
const initialState: PostState = {
  posts: [],
  isLoading: false,
  error: null,
  page: 1,
  limit: 10,
  hasMore: true,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
};

/**
 * PostStore con Zustand
 */
export const usePostStore = create<PostStore>((set, get) => ({
  ...initialState,

  /**
   * Obtiene posts con paginación
   */
  fetchPosts: async (page = 1, limit = 10, append = false) => {
    set({ isLoading: true, error: null });

    try {
      const posts = await postsApi.getAll(page, limit);
      
      set((state) => ({
        posts: append ? [...state.posts, ...posts] : posts,
        page: posts.length > 0 ? page : state.page,
        hasMore: posts.length === limit,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      const apiError = error as ApiError;
      set({
        isLoading: false,
        error: apiError,
      });
    }
  },

  /**
   * Obtiene un post por ID
   */
  fetchPostById: async (id: string) => {
    try {
      const post = await postsApi.getById(id);
      
      // Actualizar el post en el store si existe
      set((state) => ({
        posts: state.posts.map((p) => (p.id === id ? post : p)),
      }));
      
      return post;
    } catch (error) {
      const apiError = error as ApiError;
      set({ error: apiError });
      return null;
    }
  },

  /**
   * Obtiene posts de un usuario específico
   */
  fetchUserPosts: async (userId: string, page = 1, limit = 10) => {
    set({ isLoading: true, error: null });

    try {
      const posts = await postsApi.getByUserId(userId, page, limit);
      
      set({
        posts,
        page: posts.length > 0 ? page : get().page,
        hasMore: posts.length === limit,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        isLoading: false,
        error: apiError,
      });
    }
  },

  /**
   * Crea un nuevo post
   * Muestra notificación automática de éxito o error
   */
  createPost: async (postData: CreatePostDto) => {
    set({ isCreating: true, error: null });

    try {
      const newPost = await postsApi.create(postData);
      
      set((state) => ({
        posts: [newPost, ...state.posts],
        isCreating: false,
        error: null,
      }));
      
      // Notificación de éxito
      useToastStore.getState().showToast('Publicación creada con éxito.', 'SUCCESS');
      
      return newPost;
    } catch (error) {
      const apiError = error as ApiError;
      set({
        isCreating: false,
        error: apiError,
      });
      
      // Notificación de error
      useToastStore.getState().showToast('Error al procesar la publicación. Intente de nuevo.', 'ERROR');
      
      return null;
    }
  },

  /**
   * Actualiza un post
   * Muestra notificación automática de éxito o error
   */
  updatePost: async (id: string, postData: UpdatePostDto) => {
    set({ isUpdating: true, error: null });

    try {
      const updatedPost = await postsApi.update(id, postData);
      
      set((state) => ({
        posts: state.posts.map((p) => (p.id === id ? updatedPost : p)),
        isUpdating: false,
        error: null,
      }));
      
      // Notificación de éxito
      useToastStore.getState().showToast('Publicación actualizada con éxito.', 'SUCCESS');
      
      return updatedPost;
    } catch (error) {
      const apiError = error as ApiError;
      set({
        isUpdating: false,
        error: apiError,
      });
      
      // Notificación de error
      useToastStore.getState().showToast('Error al procesar la publicación. Intente de nuevo.', 'ERROR');
      
      return null;
    }
  },

  /**
   * Elimina un post
   * Muestra notificación automática de éxito o error
   */
  deletePost: async (id: string) => {
    set({ isDeleting: true, error: null });

    try {
      await postsApi.delete(id);
      
      set((state) => ({
        posts: state.posts.filter((p) => p.id !== id),
        isDeleting: false,
        error: null,
      }));
      
      // Notificación de éxito
      useToastStore.getState().showToast('Publicación eliminada con éxito.', 'SUCCESS');
      
      return true;
    } catch (error) {
      const apiError = error as ApiError;
      set({
        isDeleting: false,
        error: apiError,
      });
      
      // Notificación de error
      useToastStore.getState().showToast('Error al procesar la publicación. Intente de nuevo.', 'ERROR');
      
      return false;
    }
  },

  /**
   * Resetea el store
   */
  reset: () => {
    set(initialState);
  },

  /**
   * Establece un error
   */
  setError: (error: ApiError | null) => {
    set({ error });
  },

  /**
   * Agrega un post al store (optimistic update)
   */
  addPost: (post: Post) => {
    set((state) => ({
      posts: [post, ...state.posts],
    }));
  },

  /**
   * Actualiza un post en el store (optimistic update)
   */
  updatePostInStore: (id: string, postData: Partial<Post>) => {
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === id ? { ...p, ...postData } : p
      ),
    }));
  },

  /**
   * Elimina un post del store (optimistic update)
   */
  removePostFromStore: (id: string) => {
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== id),
    }));
  },

  /**
   * Toggle like en un post (optimistic update)
   */
  toggleLike: (postId: string, userId: string) => {
    set((state) => ({
      posts: state.posts.map((post) => {
        if (post.id !== postId) return post;
        
        const likes = post.likes || [];
        const hasLiked = likes.some((like) => like.userId === userId);
        
        if (hasLiked) {
          // Remover like
          return {
            ...post,
            likes: likes.filter((like) => like.userId !== userId),
          };
        } else {
          // Agregar like (optimistic)
          return {
            ...post,
            likes: [
              ...likes,
              {
                id: `temp-${Date.now()}`,
                userId,
                postId,
                createdAt: new Date().toISOString(),
              },
            ],
          };
        }
      }),
    }));
  },
}));

