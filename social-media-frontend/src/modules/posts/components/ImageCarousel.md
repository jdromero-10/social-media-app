# ImageCarousel.tsx - Documentación

## Descripción
Componente reutilizable para mostrar múltiples imágenes en un carrusel. Incluye navegación con flechas, indicadores de posición y contador de imágenes.

## Props

```typescript
interface ImageCarouselProps {
  images: string[];      // Array de URLs de imágenes
  alt?: string;          // Texto alternativo para las imágenes
  className?: string;    // Clases CSS adicionales
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
```

## Estilos

- Imágenes con `object-cover` para mantener proporción
- Botones de navegación con overlay semitransparente
- Indicadores con estados activo/inactivo
- Contador con fondo semitransparente
- Bordes redondeados en las imágenes

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

