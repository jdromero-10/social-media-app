import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface SidebarContextType {
  isVisible: boolean;
  toggleSidebar: () => void;
  hideSidebar: () => void;
  showSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleSidebar = () => setIsVisible((prev) => !prev);
  const hideSidebar = () => setIsVisible(false);
  const showSidebar = () => setIsVisible(true);

  return (
    <SidebarContext.Provider value={{ isVisible, toggleSidebar, hideSidebar, showSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

