import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Avatar } from '../../../shared/components/Avatar';
import { Card } from '../../../shared/components/Card';
import { ImageCarousel } from './ImageCarousel';
import { apiClient } from '../../../api/apiClient';
import type { Post } from '../posts.types';
import type { User } from '../../auth/auth.types';

interface PostCardProps {
  post: Post;
  currentUser: User | null;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: string) => void;
  className?: string;
}

/**
 * Componente PostCard que representa una publicación individual
 */
export const PostCard = ({
  post,
  currentUser,
  onLike,
  onComment,
  onEdit,
  onDelete,
  className = '',
}: PostCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const isOwner = currentUser?.id === post.authorId;
  const hasLiked = post.likes?.some((like) => like.userId === currentUser?.id) || false;
  const likesCount = post.likes?.length || 0;
  const commentsCount = post.comments?.length || 0;

  // Preparar imágenes para el carrusel (construir URLs completas)
  const images = post.imageUrl ? [apiClient.getImageUrl(post.imageUrl) || post.imageUrl] : [];

  const handleLike = () => {
    if (onLike) {
      onLike(post.id);
    }
  };

  const handleComment = () => {
    if (onComment) {
      onComment(post.id);
    }
  };

  const handleEdit = () => {
    setIsMenuOpen(false);
    if (onEdit) {
      onEdit(post);
    }
  };

  const handleDelete = () => {
    setIsMenuOpen(false);
    if (onDelete) {
      onDelete(post.id);
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours} h`;
    if (days < 7) return `Hace ${days} d`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  return (
    <Card className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar
            name={post.author.name || post.author.email}
            size="md"
            src={post.author.name ? undefined : undefined}
          />
          <div>
            <p className="font-semibold text-gray-900">
              {post.author.name || post.author.email}
            </p>
            <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        {/* Menú de opciones (solo para el dueño) */}
        {isOwner && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#00dde5]"
              aria-label="Opciones del post"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={handleEdit}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Eliminar</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contenido */}
      {post.content && (
        <div className="mb-4">
          <p className="text-gray-900 whitespace-pre-wrap text-base leading-relaxed">{post.content}</p>
        </div>
      )}

      {/* Imágenes */}
      {images.length > 0 && (
        <div className="mb-4">
          <ImageCarousel images={images} alt={post.content || 'Imagen del post'} />
        </div>
      )}

      {/* Footer de Interacción */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          {/* Botón Like */}
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00dde5] ${
              hasLiked
                ? 'text-red-600 bg-red-50 hover:bg-red-100'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            aria-label={hasLiked ? 'Quitar like' : 'Dar like'}
          >
            <Heart className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
            <span className="font-medium">{likesCount}</span>
          </button>

          {/* Botón Comentar */}
          <button
            onClick={handleComment}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#00dde5]"
            aria-label="Comentar"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">{commentsCount}</span>
          </button>
        </div>
      </div>
    </Card>
  );
};

