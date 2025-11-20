/**
 * Tipos relacionados con Posts
 */

import type { User } from '../auth/auth.types';

/**
 * Tipo de post
 */
export enum PostType {
  TEXT = 'text',
  IMAGE = 'image',
  TEXT_WITH_IMAGE = 'text_with_image',
}

/**
 * Like de un post
 */
export interface Like {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
  user?: User;
}

/**
 * Comentario de un post
 */
export interface Comment {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
  author?: User;
}

/**
 * Post completo con todas sus relaciones
 */
export interface Post {
  id: string;
  title: string | null;
  description: string | null;
  content: string | null;
  imageUrl: string | null;
  type: PostType;
  authorId: string;
  author: User;
  likes?: Like[];
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO para crear un post
 */
export interface CreatePostDto {
  title?: string | null;
  description?: string | null;
  content?: string | null;
  imageUrl?: string | null;
  type?: PostType;
}

/**
 * DTO para actualizar un post
 */
export interface UpdatePostDto {
  title?: string;
  description?: string | null;
  content?: string | null;
  imageUrl?: string | null;
  type?: PostType;
}

