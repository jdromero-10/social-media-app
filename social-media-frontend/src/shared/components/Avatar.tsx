import { forwardRef, HTMLAttributes } from 'react';

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  fallback?: string;
}

/**
 * Componente Avatar reutilizable para mostrar imágenes de perfil de usuario
 */
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt = 'Avatar',
      name,
      size = 'md',
      fallback,
      className = '',
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
    };

    const getInitials = (name: string): string => {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    };

    // Función para obtener un color aleatorio basado en el nombre
    const getAvatarColor = (name: string): string => {
      // Colores disponibles: cyan, rojo, verde, naranja
      const colors = [
        'from-[#00b1c0] to-[#038c9b]', // Cyan (color principal)
        'from-red-500 to-red-600',     // Rojo
        'from-green-500 to-green-600', // Verde
        'from-orange-500 to-orange-600', // Naranja
      ];

      // Generar un índice determinístico basado en el nombre
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      const index = Math.abs(hash) % colors.length;
      return colors[index];
    };

    const displayFallback = fallback || (name ? getInitials(name) : '?');
    const avatarColor = name ? getAvatarColor(name) : 'from-[#00b1c0] to-[#038c9b]';

    return (
      <div
        ref={ref}
        className={`
          ${sizeClasses[size]}
          rounded-full bg-gradient-to-br ${avatarColor}
          flex items-center justify-center
          text-white font-semibold
          overflow-hidden
          flex-shrink-0
          ${className}
        `}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Si la imagen falla al cargar, mostrar fallback
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `<span>${displayFallback}</span>`;
              }
            }}
          />
        ) : (
          <span>{displayFallback}</span>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

