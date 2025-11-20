# Optimización de Imágenes en Posts

## Resumen
Este documento describe el sistema de optimización de imágenes implementado para mejorar la experiencia del usuario y el rendimiento de la aplicación. El sistema incluye detección automática de imágenes grandes, modal de recorte opcional, y visualización optimizada en los posts.

## Características Principales

### 1. Detección Automática de Imágenes Grandes
- **Umbrales configurados**: 
  - Dimensiones: > 1500px (ancho o alto)
  - Tamaño de archivo: > 1.5MB
- **Comportamiento**: Cuando se detecta una imagen grande, se abre automáticamente el modal de recorte para que el usuario pueda optimizarla antes de subirla
- **Beneficios**: 
  - Reduce el tamaño de archivo antes de la subida
  - Mejora el tiempo de carga
  - Optimiza el almacenamiento

### 2. Modal de Recorte Interactivo
- **Componente**: `ImageCropModal` (componente global reutilizable)
- **Funcionalidades**:
  - Arrastrar para ajustar posición del recorte
  - Zoom controlable (50% - 300%) con slider
  - Vista previa en tiempo real
  - Grid visual para ayudar en el recorte
  - Aspect ratio configurable (por defecto 1:1)
- **Procesamiento**: 
  - Convierte la imagen recortada a JPEG con calidad 90%
  - Optimiza el tamaño de archivo
  - Mantiene la calidad visual
- **Manejo de CORS**: 
  - Carga imágenes externas mediante `fetch` como blob
  - Evita errores de "Tainted canvas"
  - Gestiona correctamente blob URLs para evitar fugas de memoria
  - Validaciones robustas antes de procesar

### 3. Visualización Optimizada en Posts
- **Tamaños de imagen**:
  - **Una imagen**: Altura fija de 300px
  - **Múltiples imágenes (carrusel)**: Altura fija de 350px
- **Restricciones**:
  - `maxWidth: 100%` para prevenir desbordamiento
  - `maxHeight` aplicado para mantener proporciones
- **Modos de ajuste**:
  - `object-cover` (por defecto): Recorta si es necesario para llenar el espacio
  - `object-contain`: Ajusta sin recortar, mostrando toda la imagen

## Flujo de Trabajo

### Al Crear un Post con Imagen

1. **Selección de imagen**:
   - Usuario selecciona una imagen desde su dispositivo
   - Validación de tipo (solo imágenes) y tamaño (máx. 5MB)

2. **Detección de tamaño**:
   - Sistema verifica dimensiones y tamaño de archivo
   - Si es grande (>1500px o >1.5MB), abre automáticamente el modal de recorte
   - Si es pequeña, muestra preview directamente

3. **Recorte (opcional)**:
   - Usuario puede recortar la imagen en el modal
   - Ajusta zoom y posición según necesidad
   - Aplica el recorte (convierte a JPEG optimizado)
   - Manejo correcto de CORS para evitar errores
   - El componente detecta automáticamente el tipo de URL (blob, data, http) y la maneja apropiadamente
   - Logging detallado para diagnóstico de problemas

4. **Preview**:
   - Muestra preview de la imagen (altura máxima 320px)
   - Botones disponibles:
     - **Recortar**: Abre modal de recorte (siempre disponible)
     - **Eliminar**: Remueve la imagen seleccionada

5. **Subida**:
   - Al publicar, la imagen se sube al servidor
   - Backend guarda en `images/posts/uuid.jpg`
   - Retorna URL relativa

6. **Visualización en el post**:
   - Imagen se muestra con tamaño optimizado (300px o 350px de altura)
   - Restricciones de ancho para prevenir desbordamiento

### Al Editar un Post con Imagen

1. **Carga del post existente**:
   - Se carga el post con su imagen existente
   - `useEffect` convierte URL relativa a completa para mostrar preview
   - Usa `apiClient.getImageUrl()` para construir URL completa

2. **Opciones del usuario**:
   - **Mantener imagen**: No hacer cambios, mantener la imagen existente
   - **Seleccionar nueva**: Elegir una nueva imagen del dispositivo
   - **Recortar existente**: Recortar la imagen actual del post
   - **Recortar nueva**: Seleccionar y recortar una nueva imagen

3. **Recorte (si aplica)**:
   - El modal maneja correctamente imágenes desde URLs externas y del mismo origen
   - Detecta automáticamente el tipo de URL (blob, data, http/https) y si es mismo origen
   - **Estrategia inteligente de carga**:
     - **Mismo origen**: Intenta carga directa primero (más rápido), luego fetch si falla
     - **Cross-origin**: Usa fetch primero (necesario para CORS), luego carga directa si falla
   - Convierte a blob URL local para procesamiento seguro cuando es necesario
   - El componente asegura que las URLs estén completas antes de procesarlas
   - Incluye logging detallado para facilitar el debugging
   - Evita errores de "Failed to fetch" usando la estrategia más apropiada según el origen

4. **Subida al editar**:
   - Si hay imagen nueva seleccionada (incluyendo recortadas), se sube al servidor
   - Si no hay imagen nueva, se mantiene la URL existente
   - El post se actualiza con la nueva información

5. **Resultado**:
   - El post se actualiza con la nueva imagen (si se cambió)
   - La imagen se muestra correctamente en el feed

## Componentes Utilizados

### Componentes Globales (Reutilizables)
- **`ImageCropModal`**: Modal de recorte de imágenes
  - Ubicación: `social-media-frontend/src/shared/components/ImageCropModal.tsx`
  - Usa `react-easy-crop` para el recorte interactivo
  - Reutiliza el componente `Modal` global

- **`Modal`**: Componente base de modal
  - Ubicación: `social-media-frontend/src/shared/components/Modal.tsx`
  - Overlay semitransparente con blur
  - Cierre con Escape o click en overlay

- **`Button`**: Botones de acción
  - Ubicación: `social-media-frontend/src/shared/components/Button.tsx`
  - Variantes: primary, outline
  - Soporte para estados de carga

### Componentes Específicos
- **`CreatePostForm`**: Formulario de creación/edición de posts
  - Maneja la selección y preview de imágenes
  - Integra el modal de recorte
  - Valida y sube imágenes

- **`ImageCarousel`**: Carrusel de imágenes en posts
  - Muestra imágenes con tamaño optimizado
  - Navegación entre múltiples imágenes
  - Indicadores y contador

## Configuración

### Umbrales de Detección
Los umbrales están configurados en `CreatePostForm.tsx`:
```typescript
const isLarge = dimensions.width > 1500 || 
                dimensions.height > 1500 || 
                file.size > 1.5 * 1024 * 1024;
```

### Tamaños de Visualización
Configurados en `ImageCarousel.tsx`:
- Una imagen: `height: '300px'`
- Múltiples imágenes: `height: '350px'`
- Preview en formulario: `max-h-80` (320px)

## Beneficios

1. **Mejor Rendimiento**:
   - Imágenes más pequeñas = carga más rápida
   - Menor uso de ancho de banda
   - Mejor experiencia en conexiones lentas

2. **Mejor UX**:
   - Imágenes no se muestran demasiado grandes
   - Consistencia visual en el feed
   - Opción de recortar para mejorar composición

3. **Optimización de Almacenamiento**:
   - Archivos más pequeños en el servidor
   - Menor costo de almacenamiento
   - Escalabilidad mejorada

4. **Reutilización de Componentes**:
   - `ImageCropModal` puede usarse en otros contextos (perfil, etc.)
   - Consistencia en toda la aplicación
   - Mantenimiento más fácil

## Próximas Mejoras (Opcional)

1. **Compresión automática**: Comprimir imágenes antes de subir
2. **Thumbnails**: Generar miniaturas automáticamente
3. **Lazy loading**: Cargar imágenes bajo demanda
4. **Formatos modernos**: Soporte para WebP, AVIF
5. **Progressive loading**: Mostrar versión de baja calidad primero

## Documentación Relacionada

- `IMAGE_STORAGE_MIGRATION.md`: Migración de almacenamiento de imágenes
- `ImageCarousel.md`: Documentación del componente carrusel
- `CreatePostForm.md`: Documentación del formulario de posts
- `ImageCropModal.md`: Documentación del modal de recorte

