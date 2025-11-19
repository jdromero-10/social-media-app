import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface CreatePostModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const CreatePostModalContext = createContext<CreatePostModalContextType | undefined>(undefined);

interface CreatePostModalProviderProps {
  children: ReactNode;
}

export const CreatePostModalProvider = ({ children }: CreatePostModalProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <CreatePostModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </CreatePostModalContext.Provider>
  );
};

export const useCreatePostModal = () => {
  const context = useContext(CreatePostModalContext);
  if (context === undefined) {
    throw new Error('useCreatePostModal must be used within a CreatePostModalProvider');
  }
  return context;
};

