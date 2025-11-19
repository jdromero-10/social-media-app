import { Outlet } from 'react-router-dom';
import { SideBar } from './SideBar';
import { NavBar } from './NavBar';
import { CreatePostModalProvider, useCreatePostModal } from '../context/CreatePostModalContext';
import { Modal } from './Modal';
import { CreatePostForm } from '../../modules/posts/components/CreatePostForm';
import { usePostStore } from '../store/postStore';
import { ToastProvider } from './ToastProvider';
import type { CreatePostDto } from '../../modules/posts/posts.types';

/**
 * Componente interno que usa el contexto del modal
 */
const MainLayoutContent = () => {
  const { isOpen, closeModal } = useCreatePostModal();
  const { createPost, isCreating } = usePostStore();

  const handleCreatePost = async (data: CreatePostDto) => {
    const newPost = await createPost(data);
    if (newPost) {
      closeModal();
    }
    // Las notificaciones se manejan automáticamente en el PostStore
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Layout Grid */}
        <div className="flex">
          {/* Sidebar */}
          <SideBar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col lg:ml-64">
            {/* Navbar */}
            <NavBar />

            {/* Content Outlet */}
            <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Modal de Crear Post Global */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Crear Nueva Publicación"
        size="lg"
      >
        <CreatePostForm
          onSubmit={handleCreatePost}
          onCancel={closeModal}
          isLoading={isCreating}
        />
      </Modal>

      {/* Sistema de Notificaciones Global */}
      <ToastProvider />
    </>
  );
};

/**
 * Layout principal de la aplicación para rutas autenticadas
 * Incluye SideBar, NavBar y área de contenido principal
 * También proporciona el contexto del modal de crear post
 */
export const MainLayout = () => {
  return (
    <CreatePostModalProvider>
      <MainLayoutContent />
    </CreatePostModalProvider>
  );
};

