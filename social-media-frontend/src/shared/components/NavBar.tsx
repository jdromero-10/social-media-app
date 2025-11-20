import { useState, useRef, useEffect } from 'react';
import { Search, Settings, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../modules/auth/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/apiClient';
import type { User as UserType } from '../../modules/auth/auth.types';
import { Avatar } from './Avatar';
import { Input } from './Input';
import { Button } from './Button';

export const NavBar = () => {
  const navigate = useNavigate();
  const { logout, isLoggingOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Obtener datos del usuario actual
  const { data: user } = useQuery<UserType>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      return apiClient.get<UserType>('/auth/me');
    },
    retry: false,
  });

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar búsqueda
    console.log('Búsqueda:', searchQuery);
  };

  const userName = user?.name || user?.email || 'Usuario';
  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : user?.email?.[0].toUpperCase() || 'U';

  return (
    <nav className="h-16 lg:h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
      {/* Logo (Mobile) */}
      <div className="lg:hidden">
        <h1 className="text-xl font-bold text-gray-900">SocialApp</h1>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex-1 max-w-2xl mx-4 hidden md:block"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>
      </form>

      {/* User Menu */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
          aria-label="Menú de usuario"
        >
          <Avatar 
            src={apiClient.getImageUrl((user as any)?.imageUrl) || undefined} 
            name={userName} 
            size="md" 
            className="transition-all duration-200 group-hover:scale-110 group-hover:ring-2 group-hover:ring-[#00dde5] group-hover:ring-offset-2 cursor-pointer"
          />
          <span className="hidden lg:block text-sm font-medium text-gray-700">
            {userName}
          </span>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || ''}
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <button
                onClick={() => {
                  navigate('/profile');
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Mi Perfil</span>
              </button>

              <button
                onClick={() => {
                  navigate('/settings');
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span>Configuración</span>
              </button>

              <div className="border-t border-gray-200 my-1" />

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <LogOut className="h-4 w-4" />
                <span>{isLoggingOut ? 'Cerrando...' : 'Cerrar Sesión'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

