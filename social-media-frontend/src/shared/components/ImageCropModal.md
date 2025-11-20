# ImageCropModal.tsx - Documentación

## Descripción
Componente modal reutilizable para recortar imágenes antes de subirlas. Utiliza el componente `Modal` global y la librería `react-easy-crop` para proporcionar una interfaz intuitiva de recorte con zoom y arrastre. Este componente es especialmente útil cuando las imágenes son demasiado grandes (dimensiones > 2000px o tamaño > 2MB).

## Props

```typescript
interface ImageCropModalProps {
  isOpen: boolean;                    // Controla si el modal está visible
  onClose: () => void;                // Función que se ejecuta al cerrar
  imageSrc: string;                   // URL o base64 de la imagen a recortar
  onCropComplete: (croppedImageUrl: string) => void;  // Callback con la imagen recortada
  aspectRatio?: number;                // Relación de aspecto (default: 1 - cuadrado)
  minWidth?: number;                   // Ancho mínimo del recorte (default: 100)
  minHeight?: number;                  // Alto mínimo del recorte (default: 100)
}
```

## Características

### Recorte Interactivo
- **Arrastrar**: El usuario puede arrastrar la imagen para ajustar la posición del recorte
- **Zoom**: Control deslizante para acercar o alejar la imagen (50% - 300%)
- **Vista previa en tiempo real**: Muestra el área que se recortará
- **Grid visual**: Muestra una cuadrícula para ayudar en el recorte

### Procesamiento
- Convierte la imagen recortada a JPEG con calidad 90%
- Retorna una URL de blob que puede ser convertida a File
- Optimiza el tamaño de la imagen recortada

### Reutilización de Componentes Globales
- **Modal**: Utiliza el componente `Modal` global para mantener consistencia
- **Button**: Utiliza el componente `Button` global para los botones de acción

## Uso

### Ejemplo Básico

```tsx
import { ImageCropModal } from '@/shared/components/ImageCropModal';
import { useState } from 'react';

const MyComponent = () => {
  const [showCrop, setShowCrop] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  const handleCropComplete = (croppedImageUrl: string) => {
    // Convertir blob URL a File si es necesario
    fetch(croppedImageUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'cropped.jpg', { type: 'image/jpeg' });
        // Usar el archivo recortado
      });
  };

  return (
    <ImageCropModal
      isOpen={showCrop}
      onClose={() => setShowCrop(false)}
      imageSrc={imageSrc}
      onCropComplete={handleCropComplete}
    />
  );
};
```

### Ejemplo con Aspect Ratio Personalizado

```tsx
<ImageCropModal
  isOpen={showCrop}
  onClose={() => setShowCrop(false)}
  imageSrc={imageSrc}
  onCropComplete={handleCropComplete}
  aspectRatio={16/9}  // Formato widescreen
/>
```

## Integración en CreatePostForm

Este componente se integra automáticamente en `CreatePostForm` cuando:
- La imagen tiene dimensiones > 1500px (ancho o alto)
- O el tamaño del archivo > 1.5MB

También se puede usar manualmente al editar posts para recortar imágenes existentes.

El usuario puede:
1. **Recortar automáticamente**: Si la imagen es grande, se abre el modal automáticamente
2. **Recortar manualmente**: Botón de recorte disponible en la preview de la imagen

## Flujo de Trabajo

1. Usuario selecciona una imagen grande
2. El sistema detecta que es grande y abre el modal de recorte automáticamente
3. Usuario ajusta el recorte (arrastra, zoom)
4. Usuario hace clic en "Aplicar recorte"
5. La imagen recortada se procesa y se actualiza el preview
6. El usuario puede continuar con la publicación

## Dependencias

- **react-easy-crop**: Librería para el recorte interactivo
- **Modal**: Componente global reutilizado
- **Button**: Componente global reutilizado

## Notas Técnicas

### Conversión de Blob a File
El componente retorna una URL de blob. Para convertirla a File:

```tsx
fetch(croppedImageUrl)
  .then(res => res.blob())
  .then(blob => {
    const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
    // Usar el archivo
  });
```

### Calidad de Imagen
- Formato: JPEG
- Calidad: 90% (balance entre tamaño y calidad)
- Puede ajustarse modificando el parámetro en `canvas.toBlob()`

### Rendimiento
- El procesamiento se realiza en el cliente (no requiere servidor)
- Las imágenes grandes pueden tardar unos segundos en procesarse
- Se muestra un estado de carga durante el procesamiento
- Los blob URLs se gestionan correctamente para evitar fugas de memoria

### Manejo de Errores
El componente incluye manejo robusto de errores con múltiples estrategias de fallback:
- **Errores de carga**: Mensajes claros cuando la imagen no se puede cargar
- **Errores de validación**: Valida dimensiones y tipo de archivo antes de procesar
- **Errores de procesamiento**: Captura y muestra errores durante el recorte
- **Mensajes informativos**: Los errores se muestran al usuario con mensajes descriptivos que incluyen contexto adicional
- **Fallback inteligente**: 
  - Para mismo origen: Si la carga directa falla, intenta fetch como respaldo
  - Para cross-origin: Si fetch falla, intenta carga directa como último recurso
  - Esto maximiza las posibilidades de éxito en diferentes escenarios
- **Logging detallado**: Todos los errores se registran en la consola con información completa para debugging
- **Mensajes contextuales**: Los mensajes de error incluyen información sobre qué falló específicamente (fetch, validación, carga, etc.)
- **Detección automática**: El componente detecta automáticamente el tipo de URL y usa la estrategia más apropiada

### Manejo de CORS y Tainted Canvas
El componente maneja correctamente las imágenes desde diferentes orígenes con una estrategia inteligente:

**Tipos de URL soportados**:
- **Blob URLs**: Se detectan y cargan directamente (ya son locales, no requieren fetch)
- **Data URLs (base64)**: Se cargan directamente sin problemas
- **Mismo origen**: Detecta automáticamente si la URL es del mismo dominio
- **Cross-origin**: Maneja URLs de diferentes dominios con fetch y CORS

**Estrategia de carga inteligente**:

1. **Para mismo origen** (mismo dominio y puerto):
   - **Primero**: Intenta carga directa sin `crossOrigin` (más rápido y confiable)
   - **Si falla**: Usa fetch como respaldo
   - **Ventaja**: Evita problemas innecesarios con fetch cuando no es necesario

2. **Para URLs del backend** (ej: `http://localhost:3006/images/posts/uuid.jpg`):
   - Detecta automáticamente URLs del backend (contiene `localhost:3006`, `127.0.0.1:3006` o `/images/`)
   - **Estrategia principal**: SIEMPRE usa fetch primero para evitar "Tainted canvas"
     - Carga la imagen mediante `fetch()` como blob con timeout de 10 segundos
     - Valida que el blob no esté vacío y sea una imagen válida
     - Crea un blob URL local
     - Carga la imagen desde el blob URL
     - **Ventaja**: Garantiza que el canvas no esté "tainted" y permite usar `canvas.toBlob()`
   - **Timeout**: El fetch tiene un timeout de 10 segundos para evitar que se quede colgado
   - **Validaciones**:
     - Verifica que el blob no esté vacío
     - Verifica que el tipo sea imagen (con fallback si no tiene tipo pero tiene tamaño)
   - **Fallback**: Si fetch falla, intenta carga directa (aunque puede causar tainted canvas)
   - **Mensajes de error específicos**: Diferencia entre timeout, errores de red, y otros errores
   - **Logging detallado**: Cada paso se registra en la consola para debugging
   - **Importante**: Esta estrategia previene el error "Tainted canvases may not be exported"

3. **Para cross-origin** (ej: `https://otro-dominio.com/imagen.jpg`):
   - **Primero**: Usa fetch con CORS (necesario para evitar "Tainted canvas")
   - **Si falla**: Intenta carga directa como último recurso
   - **Ventaja**: Maneja correctamente las restricciones de CORS

**Solución al error "Tainted canvas"**:
- **Para URLs del backend**: SIEMPRE se usa `fetch()` primero para cargar como blob
  - Esto garantiza que el canvas no esté "tainted"
  - Permite usar `canvas.toBlob()` sin problemas
  - El blob URL se mantiene hasta después de usarlo en el canvas
- **Para imágenes cross-origin**: Se cargan mediante `fetch()` como blob
- Se crea una URL local (blob URL) que no tiene restricciones de CORS
- El blob URL se mantiene hasta después de usarlo en el canvas (no se revoca prematuramente)
- Esto permite usar `canvas.toBlob()` sin problemas de seguridad
- El blob URL se limpia automáticamente después de procesar la imagen en el canvas
- No se usa `crossOrigin` para blob URLs (no es necesario y puede causar problemas)
- **Crítico**: Cargar imágenes del backend mediante fetch previene completamente el error "Tainted canvases may not be exported"

**Validaciones implementadas**:
- Verifica que la URL no esté vacía antes de intentar cargarla
- Verifica que el blob sea una imagen válida antes de procesarlo
- Valida que la imagen esté completamente cargada antes de usarla en el canvas
- Valida que las dimensiones del recorte sean válidas (> 0)
- Manejo robusto de errores con mensajes informativos
- Múltiples intentos con diferentes estrategias para maximizar éxito

**Logging y Diagnóstico**:
- El componente incluye logging detallado para facilitar el diagnóstico de problemas
- Registra si detecta mismo origen o cross-origin
- Registra la URL que se intenta cargar
- Registra qué estrategia de carga se está usando (directa o fetch)
- Registra el estado de la respuesta fetch (status, statusText) cuando aplica
- Registra el tipo y tamaño del blob recibido
- Registra errores específicos con contexto completo
- Los logs se pueden ver en la consola del navegador (F12) para debugging
- Facilita identificar si el problema es de red, CORS, o formato de imagen

## Accesibilidad

- El modal hereda las características de accesibilidad del componente `Modal` global
- Los controles son accesibles por teclado
- El zoom se puede controlar con el teclado (usando el input range)

## Mejoras Futuras

1. **Múltiples formatos**: Permitir seleccionar formato de salida (JPEG, PNG, WebP)
2. **Ajustes de calidad**: Permitir al usuario ajustar la calidad de compresión
3. **Filtros**: Agregar filtros básicos antes del recorte
4. **Rotación**: Permitir rotar la imagen antes del recorte
5. **Proporciones predefinidas**: Botones rápidos para proporciones comunes (1:1, 16:9, 4:3)

