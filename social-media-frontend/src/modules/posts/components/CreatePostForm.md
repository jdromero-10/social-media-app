# CreatePostForm.tsx - Documentación

## Descripción
Componente de formulario para crear o editar posts. Permite ingresar título, descripción, contenido e imágenes. Soporta preview de imágenes y validación de archivos.

## Props

```typescript
interface CreatePostFormProps {
  onSubmit: (data: CreatePostDto) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  initialData?: Partial<CreatePostDto>;
}
```

## Campos del Formulario

### Contenido
- **Tipo**: Textarea
- **Requerido**: No (pero se requiere contenido o imagen para publicar)
- **Filas**: 4
- **Placeholder**: "¿Qué estás pensando?"
- **Estilo**: Texto más grande (`text-base`) para mejor legibilidad
- **Validación**: El formulario requiere al menos contenido o imagen para poder publicar

### Imagen
- **Tipo**: Input file
- **Acepta**: Todos los tipos de imagen (`image/*`)
- **Validaciones**:
  - Solo archivos de imagen
  - Tamaño máximo: 5MB
- **Preview**: Muestra preview de la imagen seleccionada (altura máxima de 320px para mejor visualización)
- **Recorte automático**: Si la imagen es grande (>1500px en ancho o alto, o >1.5MB), se abre automáticamente el modal de recorte
- **Recorte manual**: Botón de recorte disponible en la preview para recortar cualquier imagen en cualquier momento
- **Eliminar**: Botón para remover la imagen seleccionada

## Características

### Auto-detección de Tipo
El formulario auto-detecta el tipo de post:
- `text`: Si solo hay contenido (texto)
- `image`: Si solo hay imagen (sin contenido)
- `text_with_image`: Si hay imagen y contenido

### Preview de Imagen
- Muestra preview inmediato al seleccionar una imagen
- Usa `FileReader` para crear data URL (solo para preview)
- Botones de acción:
  - **Recortar**: Abre el modal de recorte para ajustar la imagen
  - **Eliminar**: Remueve la imagen seleccionada
- **Nota**: El preview es local, la imagen real se sube al servidor al enviar el formulario

### Recorte de Imágenes
- **Detección automática mejorada**: Si la imagen tiene dimensiones > 1500px (ancho o alto) o tamaño > 1.5MB, se abre automáticamente el modal de recorte para optimizar la imagen antes de subirla
- **Recorte manual**: El usuario puede hacer clic en el botón de recorte en cualquier momento, incluso si la imagen no es grande
- **Recorte al editar**: Al editar un post, el usuario puede recortar la imagen existente o una nueva imagen seleccionada
- **Modal de recorte**: Utiliza el componente `ImageCropModal` global (reutiliza componentes compartidos)
- **Funcionalidades del recorte**:
  - Arrastrar para ajustar posición
  - Zoom (50% - 300%) con control deslizante
  - Vista previa en tiempo real
  - Grid visual para ayudar en el recorte
  - Aspect ratio configurable (por defecto 1:1)
- **Procesamiento**: 
  - La imagen recortada se convierte a JPEG con calidad 90% para optimizar el tamaño
  - Se convierte de blob URL a File para mantener compatibilidad
  - Al editar, la imagen recortada se sube al servidor para actualizar el post
- **Optimización**: Reduce el tamaño de archivo y dimensiones de imágenes grandes, mejorando el rendimiento y la experiencia del usuario
- **Manejo de CORS**: El modal maneja correctamente imágenes desde diferentes orígenes, evitando errores de "Tainted canvas"
- **URLs completas**: Al hacer clic en recortar, el componente asegura que la URL esté completa (convierte URLs relativas a completas) antes de pasarla al modal
- **Logging**: El componente registra la URL que se pasa al modal para facilitar el debugging

### Validación de Archivos
- Verifica que sea un archivo de imagen
- Valida tamaño máximo (5MB)
- Muestra alertas si la validación falla

### Reset del Formulario
Si no es edición (`initialData` no proporcionado), el formulario se resetea después de enviar exitosamente.

## Uso

### Crear Post
```tsx
<CreatePostForm
  onSubmit={async (data) => {
    await createPost(data);
  }}
  onCancel={() => setIsOpen(false)}
  isLoading={isCreating}
/>
```

### Editar Post
```tsx
<CreatePostForm
  onSubmit={async (data) => {
    await updatePost(postId, data);
  }}
  onCancel={() => setIsOpen(false)}
  isLoading={isUpdating}
  initialData={{
    content: post.content,
    imageUrl: post.imageUrl, // Puede ser URL relativa (/images/posts/uuid.jpg)
  }}
/>
```

**Nota**: El componente convierte automáticamente las URLs relativas a URLs completas usando `apiClient.getImageUrl()` para mostrar el preview correctamente al editar. Esto se hace mediante un `useEffect` que se ejecuta cuando hay `initialData` con `imageUrl`.

**Al recortar imágenes**: Cuando el usuario hace clic en el botón de recortar, el componente:
- Valida que la URL no esté vacía
- Convierte URLs relativas a completas usando `apiClient.getImageUrl()`
- Valida que la URL sea válida antes de abrir el modal
- Muestra un error si la URL no se puede construir correctamente
- Pasa la URL completa al modal de recorte

**Validaciones antes de recortar**:
- Verifica que `imagePreview` no sea null o vacío
- Valida que la URL se pueda construir correctamente
- Muestra mensajes de error descriptivos si algo falla

## Componentes Utilizados

- `Button`: Para los botones de acción
- `ImageCropModal`: Modal de recorte de imágenes (componente global)
- Textarea nativo: Para el contenido del post

## Estilos

- Formulario con espaciado consistente
- Campos con focus ring cyan (`ring-[#00dde5]`)
- Botón de eliminar imagen con overlay
- Área de drop de imagen con borde punteado
- Transiciones suaves en hover

## Validaciones

1. **Contenido o imagen requerido**: Debe haber al menos contenido o imagen para publicar
2. **Tipo de archivo**: Solo imágenes
3. **Tamaño de archivo**: Máximo 5MB
4. **Botón deshabilitado**: Si no hay contenido ni imagen, o está cargando

## Manejo de Errores

- Validación de tipo de archivo con alerta
- Validación de tamaño con alerta
- El componente no maneja errores de API (se delegan al componente padre)

## Notas Técnicas

- Usa `useRef` para el input de archivo
- `FileReader` para crear preview local
- **Detección de tamaño**: Verifica dimensiones de la imagen usando `Image` API antes de mostrar preview
- **Recorte**: Utiliza `react-easy-crop` para el recorte interactivo
- **Conversión de blob**: La imagen recortada se convierte de blob URL a File para mantener compatibilidad
- **Subida de imagen**: 
  - **Posts nuevos**: Si hay una imagen nueva seleccionada, se sube primero a `/upload/post-image` antes de crear el post
  - **Edición de posts**: Si hay una imagen nueva seleccionada (incluyendo imágenes recortadas), también se sube al servidor para actualizar el post
  - **Sin imagen nueva**: Si es edición y no hay imagen nueva, se mantiene la URL existente
  - **Eliminar imagen**: Si se elimina la imagen al editar, se envía `imageUrl: null` al backend para eliminar la imagen del post
- **Estado de carga**: Muestra `isUploadingImage` durante la subida de la imagen
- **Conversión de URLs**: Usa `useEffect` para convertir URLs relativas a completas al editar posts
- El formulario se resetea automáticamente después de crear (no en edición)
- El tipo de post se determina automáticamente basado en los campos

## Subida de Imágenes

### Flujo de Subida (Post Nuevo)
1. Usuario selecciona imagen → Preview local con `FileReader`
2. Usuario puede recortar la imagen (opcional)
3. Al enviar formulario → Si hay imagen nueva, se sube a `POST /upload/post-image`
4. Backend guarda → Archivo en `images/posts/uuid.jpg`
5. Backend retorna → URL relativa: `/images/posts/uuid.jpg`
6. Frontend crea post → Con la URL retornada
7. Frontend muestra → Usa `apiClient.getImageUrl()` para construir URL completa

### Flujo de Edición con Imagen
1. Usuario abre modal de edición → Se carga el post existente con su imagen
2. `useEffect` convierte URL relativa a completa → Para mostrar preview correctamente
3. Usuario puede:
   - Mantener la imagen existente
   - Seleccionar una nueva imagen
   - Recortar la imagen existente o nueva
4. Al enviar formulario:
   - Si hay imagen nueva seleccionada → Se sube al servidor y se actualiza el post
   - Si no hay imagen nueva → Se mantiene la URL existente
5. El post se actualiza con la nueva información

### Endpoint de Upload
- **URL**: `POST /upload/post-image`
- **Autenticación**: Requerida (JWT)
- **Content-Type**: `multipart/form-data`
- **Campo**: `image` (File)
- **Validaciones**: Tipo de imagen (JPEG, PNG, GIF, WebP), tamaño máximo 5MB
- **Respuesta**: `{ imageUrl: "/images/posts/uuid.jpg" }`

### Estados
- `isUploadingImage`: Indica si se está subiendo la imagen
- El botón de submit muestra "Subiendo imagen..." durante la subida
- El botón se deshabilita durante la subida

