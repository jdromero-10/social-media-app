import { useState, useRef, useEffect } from 'react';
import { X, Image as ImageIcon, Loader2, Crop } from 'lucide-react';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { ImageCropModal } from '../../../shared/components/ImageCropModal';
import { apiClient } from '../../../api/apiClient';
import { useToast } from '../../../shared/hooks/useToast';
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
  const { showError } = useToast();
  const [content, setContent] = useState(initialData?.content || '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imageUrl || null
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convertir URL relativa a completa cuando se inicializa con initialData
  useEffect(() => {
    if (initialData?.imageUrl) {
      const fullImageUrl = apiClient.getImageUrl(initialData.imageUrl);
      if (fullImageUrl) {
        setImagePreview(fullImageUrl);
        setImageUrl(initialData.imageUrl); // Mantener la URL relativa para el submit
      }
    }
  }, [initialData?.imageUrl]);

  const checkImageSize = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          resolve({ width: img.width, height: img.height });
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        showError('Por favor, selecciona un archivo de imagen');
        return;
      }

      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError('La imagen no puede ser mayor a 5MB');
        return;
      }

      // Verificar dimensiones de la imagen
      try {
        const dimensions = await checkImageSize(file);
        // Umbrales más sensibles: >1500px o >1.5MB para ofrecer recorte
        const isLarge = dimensions.width > 1500 || dimensions.height > 1500 || file.size > 1.5 * 1024 * 1024;
        
        // Crear preview
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageDataUrl = reader.result as string;
          
          if (isLarge) {
            // Si la imagen es grande, abrir modal de recorte automáticamente
            setImageToCrop(imageDataUrl);
            setShowCropModal(true);
          } else {
            // Si es pequeña, usar directamente
            setSelectedImage(file);
            setImagePreview(imageDataUrl);
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        showError('Error al procesar la imagen');
        console.error(error);
      }
    }
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    // Convertir la URL del blob a File
    fetch(croppedImageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
        setSelectedImage(file);
        setImagePreview(croppedImageUrl);
        setImageToCrop(null);
      })
      .catch((error) => {
        console.error('Error al procesar imagen recortada:', error);
        showError('Error al procesar la imagen recortada');
      });
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setImageToCrop(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    // Si es edición, establecer imageUrl a null para indicar que se debe eliminar
    // Si no es edición, establecer a string vacío
    setImageUrl(initialData ? null : '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que haya contenido o imagen
    if (!content.trim() && !selectedImage && !imagePreview) {
      showError('Escribe algo o agrega una imagen para publicar');
      return;
    }

    // Si hay una imagen nueva seleccionada, subirla primero
    let finalImageUrl: string | null = imageUrl || null;
    
    if (selectedImage) {
      // Subir nueva imagen (tanto para posts nuevos como para ediciones con imagen nueva)
      setIsUploadingImage(true);
      try {
        const uploadResponse = await apiClient.uploadFile<{ imageUrl: string }>(
          '/upload/post-image',
          selectedImage,
          'image',
        );
        finalImageUrl = uploadResponse.imageUrl;
        setImageUrl(finalImageUrl);
      } catch (uploadError) {
        const apiError = uploadError as { message?: string };
        showError(
          apiError.message || 'Error al subir la imagen. Intente de nuevo.'
        );
        setIsUploadingImage(false);
        return;
      } finally {
        setIsUploadingImage(false);
      }
    } else if (imagePreview && !selectedImage && !initialData) {
      // Si hay preview pero no es un archivo nuevo y no es edición, usar el preview (puede ser base64)
      finalImageUrl = imagePreview;
    } else if (initialData) {
      // Si es edición:
      // - Si imageUrl es null, significa que se eliminó la imagen (enviar null)
      // - Si imageUrl tiene valor, mantener la URL existente
      // - Si no hay imageUrl pero hay imagePreview, mantener el preview (no debería pasar)
      finalImageUrl = imageUrl !== undefined ? imageUrl : (imagePreview || null);
    }

    // Determinar tipo de post
    let type: PostType = 'text';
    if (finalImageUrl && content.trim()) {
      type = 'text_with_image';
    } else if (finalImageUrl) {
      type = 'image';
    }

    const postData: CreatePostDto = {
      title: null,
      description: null,
      content: content.trim() || null,
      imageUrl: finalImageUrl || null,
      type,
    };

    await onSubmit(postData);
    
    // Reset form si no es edición
    if (!initialData) {
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
      {/* Contenido */}
      <div>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="¿Qué estás pensando?"
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00dde5] focus:border-transparent resize-none text-base"
          disabled={isLoading || isUploadingImage}
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
              className="w-full h-auto rounded-lg max-h-80 object-cover"
              style={{ maxWidth: '100%' }}
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  if (imagePreview) {
                    // Asegurarse de que la URL esté completa si es relativa
                    let imageToCropUrl = imagePreview;
                    
                    // Si es una URL relativa, convertirla a completa
                    if (imagePreview.startsWith('/images/')) {
                      const fullUrl = apiClient.getImageUrl(imagePreview);
                      if (fullUrl) {
                        imageToCropUrl = fullUrl;
                      } else {
                        console.error('No se pudo construir URL completa para:', imagePreview);
                        showError('Error al preparar la imagen para recortar. La URL no es válida.');
                        return;
                      }
                    }
                    
                    // Validar que la URL sea válida
                    if (!imageToCropUrl || imageToCropUrl.trim() === '') {
                      console.error('URL de imagen vacía');
                      showError('Error: La URL de la imagen está vacía.');
                      return;
                    }
                    
                    console.log('Opening crop modal with image:', imageToCropUrl);
                    setImageToCrop(imageToCropUrl);
                    setShowCropModal(true);
                  }
                }}
                className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Recortar imagen"
                disabled={isLoading}
                title="Recortar imagen"
              >
                <Crop className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Eliminar imagen"
                disabled={isLoading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
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
          isLoading={isLoading || isUploadingImage}
          disabled={(!content.trim() && !selectedImage && !imagePreview) || isLoading || isUploadingImage}
        >
          {isUploadingImage
            ? 'Subiendo imagen...'
            : initialData
            ? 'Actualizar'
            : 'Publicar'}
        </Button>
      </div>

      {/* Modal de recorte */}
      {imageToCrop && (
        <ImageCropModal
          isOpen={showCropModal}
          onClose={handleCropCancel}
          imageSrc={imageToCrop}
          onCropComplete={handleCropComplete}
          aspectRatio={1}
        />
      )}
    </form>
  );
};

