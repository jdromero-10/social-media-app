import { useState, useRef } from 'react';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import type { CreatePostDto, PostType } from '../posts.types';

interface CreatePostFormProps {
  onSubmit: (data: CreatePostDto) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  initialData?: Partial<CreatePostDto>;
}

/**
 * Componente CreatePostForm para crear o editar posts
 */
export const CreatePostForm = ({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
}: CreatePostFormProps) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imageUrl || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona un archivo de imagen');
        return;
      }

      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no puede ser mayor a 5MB');
        return;
      }

      setSelectedImage(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('El título es requerido');
      return;
    }

    // Determinar tipo de post
    let type: PostType = 'text';
    if (imagePreview && (description || content)) {
      type = 'text_with_image';
    } else if (imagePreview) {
      type = 'image';
    }

    const postData: CreatePostDto = {
      title: title.trim(),
      description: description.trim() || null,
      content: content.trim() || null,
      imageUrl: imagePreview || null,
      type,
    };

    await onSubmit(postData);
    
    // Reset form si no es edición
    if (!initialData) {
      setTitle('');
      setDescription('');
      setContent('');
      setImageUrl('');
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Título */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Título <span className="text-red-500">*</span>
        </label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Escribe un título..."
          maxLength={255}
          required
          disabled={isLoading}
        />
        <p className="mt-1 text-xs text-gray-500">{title.length}/255</p>
      </div>

      {/* Descripción */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Descripción
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Escribe una descripción..."
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00dde5] focus:border-transparent resize-none"
          disabled={isLoading}
        />
      </div>

      {/* Contenido */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Contenido
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe el contenido de tu post..."
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00dde5] focus:border-transparent resize-none"
          disabled={isLoading}
        />
      </div>

      {/* Imagen */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imagen
        </label>
        
        {!imagePreview ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#00b1c0] transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              id="image-upload"
              disabled={isLoading}
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center space-y-2"
            >
              <ImageIcon className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-600">
                Haz clic para seleccionar una imagen
              </span>
              <span className="text-xs text-gray-500">
                PNG, JPG, GIF hasta 5MB
              </span>
            </label>
          </div>
        ) : (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-auto rounded-lg max-h-96 object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Eliminar imagen"
              disabled={isLoading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="flex items-center justify-end space-x-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={!title.trim() || isLoading}
        >
          {initialData ? 'Actualizar' : 'Publicar'}
        </Button>
      </div>
    </form>
  );
};

