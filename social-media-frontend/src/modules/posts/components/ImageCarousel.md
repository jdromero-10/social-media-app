# ImageCarousel.tsx - Documentación

## Descripción
Componente reutilizable para mostrar múltiples imágenes en un carrusel. Incluye navegación con flechas, indicadores de posición y contador de imágenes.

## Props

```typescript
interface ImageCarouselProps {
  images: string[];                    // Array de URLs de imágenes
  alt?: string;                        // Texto alternativo para las imágenes
  className?: string;                  // Clases CSS adicionales
  objectFit?: 'cover' | 'contain';     // Modo de ajuste de imagen (default: 'cover')
}
```

## Características

### Navegación
- **Flechas**: Botones izquierda/derecha para navegar
- **Indicadores**: Puntos en la parte inferior que muestran la posición actual
- **Clic en indicadores**: Permite saltar a una imagen específica

### Contador
- Muestra "X / Y" en la esquina superior derecha
- Solo visible si hay más de una imagen

### Casos Especiales
- **Sin imágenes**: Retorna `null` (no renderiza nada)
- **Una sola imagen**: Muestra la imagen sin controles de navegación
- **Múltiples imágenes**: Muestra carrusel completo con todos los controles

## Uso

```tsx
import { ImageCarousel } from '../posts/components/ImageCarousel';

// Múltiples imágenes
<ImageCarousel 
  images={['/img1.jpg', '/img2.jpg', '/img3.jpg']}
  alt="Fotos del post"
/>

// Una sola imagen
<ImageCarousel 
  images={['/img1.jpg']}
  alt="Foto del post"
/>

// Con ajuste sin recortar
<ImageCarousel 
  images={['/img1.jpg', '/img2.jpg']}
  alt="Fotos del post"
  objectFit="contain"
/>
```

## Tamaño de Imágenes

- **Formato vertical (portrait)**: Las imágenes tienen un formato más vertical, con más altura que ancho
- **Dimensiones optimizadas**: 
  - **Una imagen**: 
    - Ancho: **85%** del contenedor (reducido para formato vertical)
    - Altura: **450px** (aumentada para formato vertical)
    - Max-width: **600px** (para mantener proporciones en pantallas grandes)
    - Aspect ratio: **4:5** (formato vertical)
  - **Múltiples imágenes (carrusel)**: 
    - Ancho: **85%** del contenedor (reducido para formato vertical)
    - Altura: **500px** (aumentada para formato vertical)
    - Max-width: **600px** (para mantener proporciones en pantallas grandes)
    - Aspect ratio: **4:5** (formato vertical)
- **Centrado**: Las imágenes están centradas horizontalmente en el contenedor
- **Ajuste de imagen**: 
  - `objectFit: 'cover'` (por defecto): Recorta la imagen si es necesario para llenar el espacio
  - `objectFit: 'contain'`: Ajusta la imagen sin recortar, manteniendo toda la imagen visible
- **Contenedor**: Fondo gris claro (`bg-gray-100`) que se muestra si la imagen es más pequeña que el contenedor
- **Responsive**: Se adapta a diferentes tamaños de pantalla manteniendo el formato vertical

## Estilos

- **Formato vertical**: Imágenes con formato portrait (más altura que ancho) para mejor visualización
- **Dimensiones**:
  - Ancho: 85% del contenedor (reducido para formato vertical)
  - Altura: 450px (una imagen) o 500px (múltiples imágenes)
  - Max-width: 600px para mantener proporciones en pantallas grandes
  - Aspect ratio: 4:5 (formato vertical)
- **Centrado**: Las imágenes están centradas horizontalmente usando flexbox
- `object-cover` por defecto (recorta si es necesario) o `object-contain` (ajusta sin recortar)
- Botones de navegación con overlay semitransparente
- Indicadores con estados activo/inactivo
- Contador con fondo semitransparente
- Bordes redondeados en las imágenes
- Contenedor con fondo gris claro para mejor contraste

## Accesibilidad

- Botones con `aria-label` apropiados
- Navegación por teclado funcional
- Estados de focus visibles

## Manejo de Errores

- Si una imagen falla al cargar, se oculta automáticamente
- No rompe el carrusel si una imagen falla

## Notas Técnicas

- Usa `useState` para manejar el índice actual
- Navegación circular (última → primera, primera → última)
- Transiciones suaves entre imágenes
- Responsive y adaptable a diferentes tamaños

