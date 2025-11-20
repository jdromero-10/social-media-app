import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Modal } from './Modal';
import { Button } from './Button';
import type { Area } from 'react-easy-crop';

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedImageUrl: string) => void;
  aspectRatio?: number;
  minWidth?: number;
  minHeight?: number;
}

/**
 * Componente ImageCropModal para recortar imágenes
 * Reutiliza el componente Modal global
 */
export const ImageCropModal = ({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  aspectRatio = 1,
  // minWidth y minHeight están disponibles para futuras validaciones
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  minWidth = 100,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  minHeight = 100,
}: ImageCropModalProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropChange = useCallback((crop: { x: number; y: number }) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom);
  }, []);

  const onCropAreaComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const createImage = async (url: string): Promise<HTMLImageElement> => {
    console.log('createImage called with URL:', url);
    
    // Validar que la URL no esté vacía
    if (!url || url.trim() === '') {
      throw new Error('La URL de la imagen está vacía');
    }

    // Si es una data URL (base64), cargar directamente
    if (url.startsWith('data:')) {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => {
          console.error('Error loading data URL image:', error);
          reject(new Error('Error al cargar la imagen'));
        });
        image.src = url;
      });
    }

    // Si es una blob URL, cargar directamente (ya es local)
    if (url.startsWith('blob:')) {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => {
          console.error('Error loading blob URL image:', error);
          reject(new Error('Error al cargar la imagen recortada'));
        });
        image.src = url;
      });
    }

    // Determinar si es mismo origen o cross-origin
    const isSameOrigin = (() => {
      try {
        const urlObj = new URL(url, window.location.href);
        return urlObj.origin === window.location.origin;
      } catch {
        // Si no se puede parsear, asumir que es relativa (mismo origen)
        return !url.startsWith('http://') && !url.startsWith('https://');
      }
    })();

    // Si es mismo origen, intentar cargar directamente primero (más rápido y confiable)
    if (isSameOrigin) {
      console.log('Same origin detected, trying direct load first:', url);
      return new Promise((resolve, reject) => {
        const image = new Image();
        // No usar crossOrigin para mismo origen
        image.addEventListener('load', () => {
          console.log('Image loaded successfully via direct load (same origin)');
          resolve(image);
        });
        image.addEventListener('error', (error) => {
          console.warn('Direct load failed, trying fetch:', error);
          // Si falla la carga directa, intentar con fetch
          fetch(url, {
            mode: 'cors',
            credentials: 'include',
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
              }
              return response.blob();
            })
            .then((blob) => {
              if (!blob.type.startsWith('image/')) {
                throw new Error('El archivo no es una imagen válida');
              }
              const blobUrl = URL.createObjectURL(blob);
              const fetchImage = new Image();
              fetchImage.addEventListener('load', () => {
                URL.revokeObjectURL(blobUrl);
                resolve(fetchImage);
              });
              fetchImage.addEventListener('error', () => {
                URL.revokeObjectURL(blobUrl);
                reject(new Error('Error al cargar la imagen desde el servidor'));
              });
              fetchImage.src = blobUrl;
            })
            .catch((fetchError) => {
              console.error('Both direct load and fetch failed:', fetchError);
              const errorMessage = fetchError instanceof Error 
                ? `No se pudo cargar la imagen: ${fetchError.message}. Verifica que la URL sea válida y accesible.`
                : 'No se pudo cargar la imagen. Verifica que la URL sea válida.';
              reject(new Error(errorMessage));
            });
        });
        image.src = url;
      });
    }

    // Para URLs del backend (aunque sean diferentes puertos), SIEMPRE usar fetch primero
    // para evitar problemas de "Tainted canvas"
    const isBackendUrl = url.includes('localhost:3006') || url.includes('127.0.0.1:3006') || (url.startsWith('http') && url.includes('/images/'));
    
    if (isBackendUrl && !isSameOrigin) {
      console.log('Backend URL detected, using fetch to avoid tainted canvas:', url);
      
      // SIEMPRE usar fetch para URLs del backend para evitar "Tainted canvas"
      // Esto garantiza que el canvas no esté contaminado
      try {
        // Crear un AbortController para timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout
        
        const response = await fetch(url, {
          mode: 'cors',
          credentials: 'omit',
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const blob = await response.blob();
        console.log('Blob received from backend, type:', blob.type, 'size:', blob.size);
        
        // Verificar que el blob no esté vacío
        if (blob.size === 0) {
          throw new Error('La imagen recibida está vacía');
        }
        
        if (!blob.type.startsWith('image/')) {
          // Si no tiene tipo, puede ser que el servidor no lo esté enviando correctamente
          // Intentar de todas formas si el tamaño es razonable
          if (blob.size > 100) {
            console.warn('Blob sin tipo de imagen, pero tiene tamaño. Continuando...');
          } else {
            throw new Error('El archivo no es una imagen válida');
          }
        }

        const blobUrl = URL.createObjectURL(blob);
        console.log('Blob URL created:', blobUrl);

        return new Promise((resolve, reject) => {
          const image = new Image();
          // No usar crossOrigin para blob URLs (no es necesario y puede causar problemas)
          image.addEventListener('load', () => {
            console.log('Image loaded successfully from blob URL (backend)');
            // NO revocar el blob URL aquí, se revocará después de usarlo en el canvas
            resolve(image);
          });
          image.addEventListener('error', (error) => {
            URL.revokeObjectURL(blobUrl);
            console.error('Error loading blob URL image:', error);
            reject(new Error('Error al cargar la imagen desde el blob URL'));
          });
          image.src = blobUrl;
        });
      } catch (fetchError) {
        console.error('Fetch failed for backend URL:', fetchError);
        
        // Si es un error de abort (timeout), dar mensaje específico
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          throw new Error('La carga de la imagen tardó demasiado. Verifica tu conexión o intenta con una imagen más pequeña.');
        }
        
        // Si fetch falla, intentar carga directa como último recurso (aunque puede causar tainted canvas)
        console.warn('Falling back to direct load (may cause tainted canvas):', url);
        return new Promise((resolve, reject) => {
          const image = new Image();
          image.crossOrigin = 'anonymous';
          image.addEventListener('load', () => {
            console.warn('Image loaded via direct load (may be tainted)');
            resolve(image);
          });
          image.addEventListener('error', (error) => {
            console.error('Direct load also failed:', error);
            const errorMessage = fetchError instanceof Error 
              ? `No se pudo cargar la imagen: ${fetchError.message}. Verifica que la URL sea válida y accesible. Si el problema persiste, verifica que el servidor esté funcionando.`
              : 'No se pudo cargar la imagen. Verifica que la URL sea válida y que el servidor esté accesible.';
            reject(new Error(errorMessage));
          });
          image.src = url;
        });
      }
    }

    // Si es cross-origin, usar fetch primero
    try {
      console.log('Cross-origin detected, attempting to fetch image from:', url);
      const response = await fetch(url, {
        mode: 'cors',
        credentials: 'include',
      });
      
      if (!response.ok) {
        console.error('Fetch failed with status:', response.status, response.statusText);
        throw new Error(`Failed to load image: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      console.log('Blob received, type:', blob.type, 'size:', blob.size);
      
      // Verificar que sea una imagen válida
      if (!blob.type.startsWith('image/')) {
        console.error('Invalid blob type:', blob.type);
        throw new Error('El archivo no es una imagen válida');
      }

      const blobUrl = URL.createObjectURL(blob);
      console.log('Blob URL created:', blobUrl);

      return new Promise((resolve, reject) => {
        const image = new Image();
        // No usar crossOrigin para blob URLs, no es necesario
        image.addEventListener('load', () => {
          console.log('Image loaded successfully from blob URL');
          // No revocar el blob URL aquí, se revocará después de usarlo en el canvas
          resolve(image);
        });
        image.addEventListener('error', (error) => {
          URL.revokeObjectURL(blobUrl);
          console.error('Error loading blob URL image:', error);
          reject(new Error('Error al cargar la imagen desde el servidor'));
        });
        image.src = blobUrl;
      });
    } catch (fetchError) {
      console.warn('Fetch failed, trying direct load as fallback:', fetchError);
      // Si fetch falla, intentar cargar directamente como último recurso
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.addEventListener('load', () => {
          console.log('Image loaded successfully via direct load (fallback)');
          resolve(image);
        });
        image.addEventListener('error', (error) => {
          console.error('Error loading image directly (fallback):', error, 'URL:', url);
          const errorMessage = fetchError instanceof Error 
            ? `No se pudo cargar la imagen: ${fetchError.message}. Verifica que la URL sea válida y accesible.`
            : 'No se pudo cargar la imagen. Verifica que la URL sea válida.';
          reject(new Error(errorMessage));
        });
        image.src = url;
      });
    }
  };

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area
  ): Promise<string> => {
    let blobUrlToRevoke: string | null = null;
    
    try {
      const image = await createImage(imageSrc);
      
      // Si la imagen viene de un blob URL, guardarlo para revocarlo después
      if (image.src.startsWith('blob:')) {
        blobUrlToRevoke = image.src;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No se pudo obtener el contexto 2D del canvas');
      }

      // Validar dimensiones del recorte
      if (pixelCrop.width <= 0 || pixelCrop.height <= 0) {
        throw new Error('Las dimensiones del recorte no son válidas');
      }

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      // Asegurarse de que la imagen esté completamente cargada
      if (!image.complete) {
        throw new Error('La imagen no se cargó completamente');
      }

      // Dibujar la imagen recortada en el canvas
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      // Revocar el blob URL original si existe
      if (blobUrlToRevoke) {
        URL.revokeObjectURL(blobUrlToRevoke);
      }

      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('No se pudo crear la imagen recortada'));
              return;
            }
            const url = URL.createObjectURL(blob);
            resolve(url);
          },
          'image/jpeg',
          0.9
        );
      });
    } catch (error) {
      // Asegurarse de revocar el blob URL en caso de error
      if (blobUrlToRevoke) {
        URL.revokeObjectURL(blobUrlToRevoke);
      }
      throw error;
    }
  };

  const handleApply = async () => {
    if (!croppedAreaPixels) {
      onClose();
      return;
    }

    setIsProcessing(true);
    try {
      const croppedImageUrl = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImageUrl);
      onClose();
    } catch (error) {
      console.error('Error al recortar imagen:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error desconocido al recortar la imagen';
      alert(`Error: ${errorMessage}. Por favor, intenta de nuevo.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Recortar imagen"
      size="lg"
      closeOnOverlayClick={false}
      footer={
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isProcessing}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleApply}
            isLoading={isProcessing}
            disabled={isProcessing}
          >
            Aplicar recorte
          </Button>
        </div>
      }
    >
      <div className="relative w-full" style={{ height: '400px' }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropAreaComplete}
          minZoom={0.5}
          maxZoom={3}
          cropShape="rect"
          showGrid={true}
          style={{
            containerStyle: {
              width: '100%',
              height: '100%',
              position: 'relative',
            },
          }}
        />
      </div>
      <div className="mt-4 space-y-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Zoom: {Math.round(zoom * 100)}%
          </label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <p className="text-xs text-gray-500">
          Arrastra la imagen para ajustar el recorte. Usa el zoom para acercar o alejar.
        </p>
      </div>
    </Modal>
  );
};

