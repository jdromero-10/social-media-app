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

### Título
- **Tipo**: Input de texto
- **Requerido**: Sí
- **Max length**: 255 caracteres
- **Validación**: No puede estar vacío
- **Contador**: Muestra caracteres usados / 255

### Descripción
- **Tipo**: Textarea
- **Requerido**: No
- **Filas**: 3
- **Placeholder**: "Escribe una descripción..."

### Contenido
- **Tipo**: Textarea
- **Requerido**: No
- **Filas**: 5
- **Placeholder**: "Escribe el contenido de tu post..."

### Imagen
- **Tipo**: Input file
- **Acepta**: Todos los tipos de imagen (`image/*`)
- **Validaciones**:
  - Solo archivos de imagen
  - Tamaño máximo: 5MB
- **Preview**: Muestra preview de la imagen seleccionada
- **Eliminar**: Botón para remover la imagen seleccionada

## Características

### Auto-detección de Tipo
El formulario auto-detecta el tipo de post:
- `text`: Si no hay imagen
- `image`: Si solo hay imagen
- `text_with_image`: Si hay imagen y texto

### Preview de Imagen
- Muestra preview inmediato al seleccionar una imagen
- Usa `FileReader` para crear data URL
- Botón para eliminar imagen con preview

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
    title: post.title,
    description: post.description,
    content: post.content,
    imageUrl: post.imageUrl,
  }}
/>
```

## Componentes Utilizados

- `Input`: Para el campo de título
- `Button`: Para los botones de acción
- Textarea nativo: Para descripción y contenido

## Estilos

- Formulario con espaciado consistente
- Campos con focus ring cyan (`ring-[#00dde5]`)
- Botón de eliminar imagen con overlay
- Área de drop de imagen con borde punteado
- Transiciones suaves en hover

## Validaciones

1. **Título requerido**: No puede estar vacío
2. **Tipo de archivo**: Solo imágenes
3. **Tamaño de archivo**: Máximo 5MB
4. **Botón deshabilitado**: Si el título está vacío o está cargando

## Manejo de Errores

- Validación de tipo de archivo con alerta
- Validación de tamaño con alerta
- El componente no maneja errores de API (se delegan al componente padre)

## Notas Técnicas

- Usa `useRef` para el input de archivo
- `FileReader` para crear preview
- El formulario se resetea automáticamente después de crear (no en edición)
- El tipo de post se determina automáticamente basado en los campos

