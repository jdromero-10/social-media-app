import { useEffect, useState, useRef } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { usePostStore } from '../../shared/store/postStore';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/apiClient';
import { PostCard } from '../posts/components/PostCard';
import { CreatePostForm } from '../posts/components/CreatePostForm';
import { Modal } from '../../shared/components/Modal';
import { ConfirmModal } from '../../shared/components/ConfirmModal';
import { Button } from '../../shared/components/Button';
import { Card } from '../../shared/components/Card';
import { useCreatePostModal } from '../../shared/context/CreatePostModalContext';
import type { User } from '../auth/auth.types';
import type { Post, CreatePostDto, UpdatePostDto } from '../posts/posts.types';

/**
 * Página principal (Home/Feed) de la red social
 * Muestra el feed de publicaciones con scroll infinito
 */
export const HomePage = () => {
  const {
    posts,
    isLoading,
    error,
    page,
    limit,
    hasMore,
    isCreating,
    isUpdating,
    isDeleting,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    reset,
  } = usePostStore();

  const { openModal: openCreateModal } = useCreatePostModal();
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Obtener usuario actual
  const { data: currentUser } = useQuery<User>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      return apiClient.get<User>('/auth/me');
    },
    retry: false,
  });

  // Cargar posts iniciales
  useEffect(() => {
    reset();
    fetchPosts(1, limit);
  }, []);

  // Configurar Intersection Observer para scroll infinito
  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchPosts(page + 1, limit, true);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, page, limit]);

  // Nota: La creación de post ahora se maneja en MainLayout
  // Este handler ya no se usa aquí, pero se mantiene para compatibilidad

  // Manejar edición de post
  const handleEditPost = async (data: CreatePostDto) => {
    if (!editingPost) return;

    const updatedPost = await updatePost(editingPost.id, data as UpdatePostDto);
    if (updatedPost) {
      setIsEditModalOpen(false);
      setEditingPost(null);
    }
    // Las notificaciones se manejan automáticamente en el PostStore
  };

  // Abrir modal de confirmación para eliminar
  const handleOpenDeleteModal = (postId: string) => {
    setPostToDelete(postId);
    setIsDeleteModalOpen(true);
  };

  // Manejar eliminación de post
  const handleDeletePost = async () => {
    if (!postToDelete) return;

    const success = await deletePost(postToDelete);
    if (success) {
      setIsDeleteModalOpen(false);
      setPostToDelete(null);
    }
    // Las notificaciones se manejan automáticamente en el PostStore
  };

  // Manejar like (mockup inicial)
  const handleLike = (postId: string) => {
    // TODO: Implementar endpoint de likes
    console.log('Like en post:', postId);
  };

  // Manejar comentario (mockup inicial)
  const handleComment = (postId: string) => {
    // TODO: Implementar modal de comentarios
    console.log('Comentar en post:', postId);
  };

  // Abrir modal de edición
  const handleOpenEditModal = (post: Post) => {
    setEditingPost(post);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inicio</h1>
          <p className="text-gray-600">Tu feed de publicaciones</p>
        </div>
        <Button
          onClick={openCreateModal}
          variant="primary"
          size="md"
          className="flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Crear Post</span>
        </Button>
      </div>

      {/* Modal de Editar Post */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingPost(null);
        }}
        title="Editar Publicación"
        size="lg"
      >
        {editingPost && (
          <CreatePostForm
            onSubmit={handleEditPost}
            onCancel={() => {
              setIsEditModalOpen(false);
              setEditingPost(null);
            }}
            isLoading={isUpdating}
            initialData={{
              content: editingPost.content || undefined,
              imageUrl: editingPost.imageUrl || undefined,
            }}
          />
        )}
      </Modal>

      {/* Modal de Confirmación para Eliminar */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setPostToDelete(null);
        }}
        onConfirm={handleDeletePost}
        title="Eliminar Post"
        message="¿Estás seguro de que deseas eliminar este post? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
        closeOnOverlayClick={!isDeleting}
      />

      {/* Feed de Publicaciones */}
      <div className="space-y-4">
        {error && (
          <Card className="bg-red-50 border-red-200">
            <p className="text-red-600">
              Error al cargar los posts: {error.message}
            </p>
          </Card>
        )}

        {isLoading && posts.length === 0 ? (
          <Card>
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#00b1c0]" />
              <span className="ml-3 text-gray-600">Cargando posts...</span>
            </div>
          </Card>
        ) : posts.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No hay posts todavía</p>
              <Button
                onClick={openCreateModal}
                variant="primary"
              >
                Crear tu primer post
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={currentUser || null}
                onLike={handleLike}
                onComment={handleComment}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
              />
            ))}

            {/* Indicador de carga para scroll infinito */}
            {hasMore && (
              <div ref={loadMoreRef} className="flex justify-center py-8">
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-[#00b1c0]" />
                ) : (
                  <div className="h-1" />
                )}
              </div>
            )}

            {/* Mensaje cuando no hay más posts */}
            {!hasMore && posts.length > 0 && (
              <Card>
                <p className="text-center text-gray-500 py-4">
                  No hay más posts para mostrar
                </p>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};
