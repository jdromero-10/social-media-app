import { useState, useRef, ChangeEvent } from 'react';
import { Camera, X } from 'lucide-react';
import { Avatar } from '../../../shared/components/Avatar';
import { Button } from '../../../shared/components/Button';

interface ProfilePhotoUploaderProps {
  currentAvatar?: string;
  currentName: string;
  onFileSelect: (file: File | null) => void;
  className?: string;
}

/**
 * Componente reutilizable para la carga de foto de perfil
 * Muestra el avatar actual y permite seleccionar una nueva imagen
 * Incluye vista previa de la imagen seleccionada
 */
export const ProfilePhotoUploader = ({
  currentAvatar,
  currentName,
  onFileSelect,
  className = '',
}: ProfilePhotoUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      return;
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      onFileSelect(null);
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      onFileSelect(null);
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
    // Pasar null explícitamente para indicar que se eliminó la foto
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const displayImage = preview || currentAvatar;

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Avatar o Preview */}
      <div className="relative">
        <Avatar
          src={displayImage || undefined}
          name={currentName}
          size="lg"
          className="w-32 h-32 text-2xl"
        />
        
        {/* Overlay para indicar que es clickeable */}
        <button
          type="button"
          onClick={handleClick}
          className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/50 rounded-full transition-all duration-200 group cursor-pointer"
          aria-label="Cambiar foto de perfil"
        >
          <Camera className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      {/* Input de archivo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Seleccionar foto de perfil"
      />

      {/* Botones de acción */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClick}
        >
          <Camera className="h-4 w-4 mr-2 text-[#00b1c0]" />
          {preview ? 'Cambiar foto' : 'Seleccionar foto'}
        </Button>

        {preview && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemove}
          >
            <X className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        )}
      </div>

      {/* Información de ayuda */}
      <p className="text-xs text-gray-500 text-center max-w-xs">
        Formatos soportados: JPG, PNG, GIF. Tamaño máximo: 5MB
      </p>
    </div>
  );
};

