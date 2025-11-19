import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/apiClient';
import { usersApi } from '../../api/users-api';
import type { User } from '../auth/auth.types';
import { Card } from '../../shared/components/Card';
import { Input } from '../../shared/components/Input';
import { Button } from '../../shared/components/Button';
import { Form } from '../../shared/components/Form';
import { ProfilePhotoUploader } from './components/ProfilePhotoUploader';
import { useToast } from '../../shared/hooks/useToast';
import type { UpdateProfileDto } from '../../api/users-api';

/**
 * Esquema de validación para el formulario de edición de perfil
 */
const profileEditSchema = yup.object({
  name: yup
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .required('El nombre es requerido'),
  bio: yup
    .string()
    .max(500, 'La biografía no puede exceder 500 caracteres')
    .nullable(),
});

/**
 * Página de edición de perfil del usuario
 * Permite modificar datos personales y la foto de perfil
 */
export const ProfileEditPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos del usuario actual
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      return apiClient.get<User>('/auth/me');
    },
    retry: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<UpdateProfileDto>({
    resolver: yupResolver(profileEditSchema),
    defaultValues: {
      name: '',
      bio: '',
    },
  });

  // Pre-llenar formulario cuando se cargan los datos
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        bio: (user as any).bio || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: UpdateProfileDto) => {
    setIsSubmitting(true);

    try {
      // Si hay una imagen seleccionada, convertirla a base64
      let imageUrl = (user as any)?.imageUrl || null;
      
      if (selectedFile) {
        // Convertir la imagen a base64 para guardarla temporalmente
        // NOTA: En producción, esto debería subirse a un servicio de almacenamiento (S3, Cloudinary, etc.)
        imageUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result as string;
            resolve(base64String);
          };
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile);
        });
      } else if (selectedFile === null && (user as any)?.imageUrl) {
        // Si se eliminó la foto (selectedFile es null explícitamente)
        imageUrl = null;
      }

      // Actualizar perfil con los datos
      if (!user?.id) {
        throw new Error('Usuario no encontrado');
      }

      const updatedUser = await usersApi.updateProfile(user.id, {
        ...data,
        imageUrl: imageUrl,
      });

      // Invalidar queries para refrescar datos
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });

      // Mostrar notificación de éxito
      showSuccess('Perfil actualizado con éxito.');

      // Navegar a la vista de perfil
      navigate('/profile');
    } catch (error) {
      const apiError = error as { message?: string };
      showError(
        apiError.message || 'Error al actualizar el perfil. Intente de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

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

  const userName = user?.name || user?.username || user?.email || 'Usuario';
  const currentBio = watch('bio') || (user as any)?.bio || '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Editar Perfil
        </h1>
        <p className="text-gray-600">
          Actualiza tu información personal y foto de perfil
        </p>
      </div>

      {/* Formulario de Edición */}
      <Card>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* Sección de Foto de Perfil */}
          <div className="flex flex-col items-center py-6 border-b border-gray-200">
            <ProfilePhotoUploader
              currentAvatar={(user as any)?.imageUrl}
              currentName={userName}
              onFileSelect={handleFileSelect}
            />
          </div>

          {/* Campos del Formulario */}
          <div className="space-y-5 pt-6">
            <Input
              label="Nombre completo"
              type="text"
              placeholder="Tu nombre completo"
              {...register('name')}
              error={errors.name?.message}
            />

            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Biografía
              </label>
              <textarea
                id="bio"
                {...register('bio')}
                placeholder="Cuéntanos sobre ti..."
                rows={4}
                maxLength={500}
                className={`w-full px-4 py-2.5 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 bg-white text-gray-900 placeholder:text-gray-400 resize-none ${
                  errors.bio
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-[#00dde5] focus:border-[#00b1c0] hover:border-gray-400'
                }`}
              />
              <div className="flex items-center justify-between mt-1.5">
                {errors.bio && (
                  <p className="text-sm text-red-600 font-medium" role="alert">
                    {errors.bio.message}
                  </p>
                )}
                <p className="text-xs text-gray-500 ml-auto">
                  {currentBio.length}/500 caracteres
                </p>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              isLoading={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

