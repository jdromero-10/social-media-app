import { Link, useLocation } from 'react-router-dom';
import { Home, User, Bell, Plus, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useCreatePostModal } from '../context/CreatePostModalContext';
import { useSidebar } from '../context/SidebarContext';
import { Button } from './Button';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { path: '/home', label: 'Home', icon: Home },
  { path: '/profile', label: 'Perfil', icon: User },
  { path: '/notifications', label: 'Notificaciones', icon: Bell },
];

export const SideBar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openModal } = useCreatePostModal();
  const { isVisible, toggleSidebar } = useSidebar();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md hover:bg-gray-50 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-gray-700" />
        ) : (
          <Menu className="h-6 w-6 text-gray-700" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40
          bg-white border-r border-gray-200
          transform transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isVisible ? 'w-64' : 'w-0 lg:w-16'}
          flex flex-col
          shadow-lg lg:shadow-none
          overflow-hidden
        `}
      >
        {/* Logo Section */}
        <div className={`h-16 lg:h-20 flex items-center border-b border-gray-200 transition-all duration-300 ${isVisible ? 'justify-between px-4' : 'justify-center px-0'}`}>
          {isVisible ? (
            <>
              <Link to="/home" className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00b1c0] to-[#038c9b] flex items-center justify-center flex-shrink-0">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 hidden lg:block">
                  SocialApp
                </span>
              </Link>
              {/* Botón para ocultar sidebar (solo desktop) */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSidebar}
                className="hidden lg:flex items-center justify-center p-2 min-w-[2rem] h-8 flex-shrink-0"
                aria-label="Ocultar sidebar"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="w-full flex flex-col items-center space-y-2">
              <Link to="/home" className="flex items-center justify-center" title="Home">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00b1c0] to-[#038c9b] flex items-center justify-center flex-shrink-0">
                  <Home className="h-6 w-6 text-white" />
                </div>
              </Link>
              {/* Botón para mostrar sidebar (solo desktop) */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSidebar}
                className="hidden lg:flex items-center justify-center p-1.5 w-8 h-8 flex-shrink-0"
                aria-label="Mostrar sidebar"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className={`flex-1 py-6 space-y-2 overflow-hidden transition-all duration-300 ${isVisible ? 'px-4' : 'px-2'}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center rounded-lg
                  transition-all duration-200
                  ${isVisible ? 'space-x-3 px-4' : 'justify-center px-2'}
                  py-3
                  ${
                    active
                      ? 'bg-[#eafffd] text-[#00b1c0] font-semibold'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
                title={!isVisible ? item.label : undefined}
              >
                <Icon
                  className={`h-5 w-5 flex-shrink-0 ${active ? 'text-[#00b1c0]' : 'text-gray-500'}`}
                />
                <span className={`text-base transition-all duration-200 ${isVisible ? 'opacity-100 ml-0' : 'opacity-0 w-0 overflow-hidden'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Create Post Button (Mobile) */}
          <div className="lg:hidden pt-4 border-t border-gray-200 mt-4">
            <button
              onClick={() => {
                openModal();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-[#00b1c0] text-white hover:bg-[#038c9b] transition-colors w-full"
            >
              <Plus className="h-5 w-5" />
              <span className="text-base font-medium">Crear Post</span>
            </button>
          </div>
        </nav>

        {/* Bottom Section (Desktop) */}
        <div className={`hidden lg:block border-t border-gray-200 transition-all duration-300 ${isVisible ? 'p-4' : 'px-2 py-2'}`}>
          {isVisible ? (
            <Button
              onClick={openModal}
              variant="primary"
              fullWidth
              className="flex items-center justify-center space-x-2"
            >
              <Plus className="h-5 w-5 flex-shrink-0" />
              <span>Crear Post</span>
            </Button>
          ) : (
            <Button
              onClick={openModal}
              variant="primary"
              className="w-full flex items-center justify-center p-2"
              title="Crear Post"
            >
              <Plus className="h-5 w-5 flex-shrink-0" />
            </Button>
          )}
        </div>
      </aside>

      {/* Bottom Navigation (Mobile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex flex-col items-center justify-center flex-1 h-full
                  transition-colors duration-200
                  ${
                    active
                      ? 'text-[#00b1c0]'
                      : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                <Icon className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

