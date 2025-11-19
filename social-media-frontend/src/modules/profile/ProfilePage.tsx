import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Mail, User as UserIcon, AtSign, Calendar } from 'lucide-react';
import { apiClient } from '../../api/apiClient';
import type { User } from '../auth/auth.types';
import { Card } from '../../shared/components/Card';
import { Avatar } from '../../shared/components/Avatar';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';

/**
 * Página de perfil del usuario
 */
export const ProfilePage = () => {
  const navigate = useNavigate();
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      return apiClient.get<User>('/auth/me');
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00b1c0] mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  const userName = user?.username || user?.email || 'Usuario';
  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
        <p className="text-gray-600">Gestiona tu información personal</p>
      </div>

      {/* Profile Header Card */}
      <Card>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="relative">
            <Avatar
              src={(user as any)?.imageUrl || undefined}
              name={userName}
              size="lg"
              className="mx-auto sm:mx-0 transition-all duration-200 hover:scale-105 cursor-pointer w-32 h-32 text-2xl"
            />
            <div className="absolute -bottom-1 -right-1 bg-[#00b1c0] rounded-full p-1.5 border-2 border-white shadow-md">
              <UserIcon className="h-3 w-3 text-white" />
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-gray-900">
              {user?.username || 'Usuario'}
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
              <div className="flex items-center justify-center sm:justify-start text-gray-600">
                <Mail className="h-4 w-4 mr-1.5" />
                <span className="text-sm">{user?.email}</span>
              </div>
              {user?.username && (
                <div className="flex items-center justify-center sm:justify-start text-gray-500">
                  <AtSign className="h-4 w-4 mr-1.5" />
                  <span className="text-sm">{user.username}</span>
                </div>
              )}
            </div>
            {formattedDate && (
              <div className="flex items-center justify-center sm:justify-start text-gray-500 mt-2">
                <Calendar className="h-4 w-4 mr-1.5" />
                <span className="text-xs">
                  Miembro desde {formattedDate}
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Información Personal */}
      <Card title="Información Personal">
        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={user?.email || ''}
            disabled
            className="bg-gray-50"
          />
          {user?.name && (
            <Input
              label="Nombre completo"
              type="text"
              value={user.name}
              disabled
              className="bg-gray-50"
            />
          )}
          {user?.username && (
            <Input
              label="Username"
              type="text"
              value={user.username}
              disabled
              className="bg-gray-50"
            />
          )}
        </div>
      </Card>

      {/* Acciones */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate('/profile/edit')}
          >
            <UserIcon className="h-4 w-4 mr-2" />
            Editar Perfil
          </Button>
          <Button variant="outline" className="flex-1">
            Cambiar Contraseña
          </Button>
        </div>
      </Card>
    </div>
  );
};

