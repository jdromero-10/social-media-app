import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  alt?: string;
  className?: string;
  objectFit?: 'cover' | 'contain'; // Opción para recortar o ajustar
}

/**
 * Componente ImageCarousel para mostrar múltiples imágenes en un carrusel
 */
export const ImageCarousel = ({
  images,
  alt = 'Post image',
  className = '',
  objectFit = 'cover', // Por defecto recorta si es necesario
}: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  // Si solo hay una imagen, no mostrar controles
  if (images.length === 1) {
    return (
      <div className={`relative w-full flex justify-center ${className}`}>
        <div 
          className="relative rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center"
          style={{ 
            width: '85%', 
            maxWidth: '600px',
            height: '450px',
            aspectRatio: '4/5'
          }}
        >
          <img
            src={images[0]}
            alt={alt}
            className={`w-full h-full ${objectFit === 'cover' ? 'object-cover' : 'object-contain'}`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className={`relative w-full flex justify-center ${className}`}>
      {/* Imagen actual */}
      <div 
        className="relative rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center"
        style={{ 
          width: '85%', 
          maxWidth: '600px',
          height: '500px',
          aspectRatio: '4/5'
        }}
      >
        <img
          src={images[currentIndex]}
          alt={`${alt} ${currentIndex + 1}`}
          className={`w-full h-full ${objectFit === 'cover' ? 'object-cover' : 'object-contain'}`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />

        {/* Botones de navegación */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Indicadores de posición */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white ${
                  index === currentIndex
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Contador de imágenes */}
      {images.length > 1 && (
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

