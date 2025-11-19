import { Link, useLocation } from 'react-router-dom';
import { Home, User, Bell, Plus, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCreatePostModal } from '../context/CreatePostModalContext';

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
          w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
          shadow-lg lg:shadow-none
          overflow-hidden
        `}
      >
        {/* Logo Section */}
        <div className="h-16 lg:h-20 flex items-center justify-center border-b border-gray-200 px-4">
          <Link to="/home" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00b1c0] to-[#038c9b] flex items-center justify-center">
              <Home className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 hidden lg:block">
              SocialApp
            </span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${
                    active
                      ? 'bg-[#eafffd] text-[#00b1c0] font-semibold'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon
                  className={`h-5 w-5 ${active ? 'text-[#00b1c0]' : 'text-gray-500'}`}
                />
                <span className="text-base">{item.label}</span>
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
        <div className="hidden lg:block p-4 border-t border-gray-200">
          <button
            onClick={openModal}
            className="flex items-center justify-center space-x-2 w-full px-4 py-3 rounded-lg bg-[#00b1c0] text-white hover:bg-[#038c9b] transition-colors font-medium"
          >
            <Plus className="h-5 w-5" />
            <span>Crear Post</span>
          </button>
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

