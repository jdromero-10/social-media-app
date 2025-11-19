# UpdatePostDto - Documentación

## Descripción
DTO (Data Transfer Object) para actualizar un post existente. Extiende `CreatePostDto` pero hace todos los campos opcionales, permitiendo actualizaciones parciales.

## Herencia

```typescript
export class UpdatePostDto extends PartialType(CreatePostDto)
```

- **Extiende**: `CreatePostDto` usando `PartialType` de `@nestjs/mapped-types`
- **Efecto**: Todos los campos de `CreatePostDto` se vuelven opcionales

## Campos

Todos los campos son opcionales (heredados de `CreatePostDto`):

- `title?: string`
- `description?: string | null`
- `content?: string | null`
- `imageUrl?: string | null`
- `type?: 'text' | 'image' | 'text_with_image'`

## Comportamiento

### Actualización Parcial
Solo se actualizan los campos que se proporcionan en el DTO. Los campos no incluidos permanecen sin cambios.

**Ejemplo:**
```typescript
// Solo actualizar el título
const updatePostDto: UpdatePostDto = {
  title: 'Nuevo título',
};

// Actualizar título y descripción
const updatePostDto: UpdatePostDto = {
  title: 'Nuevo título',
  description: 'Nueva descripción',
};
```

### Recalculo del Tipo
Si se actualiza `type` o `imageUrl`, el servicio recalcula automáticamente el tipo del post basado en los campos finales:

1. Si se proporciona `type` explícitamente, se usa ese valor
2. Si no se proporciona `type` pero se actualiza `imageUrl`, se recalcula:
   - Si hay `imageUrl` Y (`description` o `content`): `'text_with_image'`
   - Si hay `imageUrl` pero NO (`description` o `content`): `'image'`
   - Si NO hay `imageUrl`: `'text'`

## Ejemplos de Uso

### Actualizar Solo el Título
```typescript
const updatePostDto: UpdatePostDto = {
  title: 'Título actualizado',
};
```

### Actualizar Descripción y Contenido
```typescript
const updatePostDto: UpdatePostDto = {
  description: 'Nueva descripción',
  content: 'Nuevo contenido',
};
```

### Cambiar de Post de Texto a Post con Imagen
```typescript
const updatePostDto: UpdatePostDto = {
  imageUrl: '/uploads/posts/new-image.jpg',
  type: 'text_with_image', // Opcional, se recalcula automáticamente
};
```

### Actualizar Múltiples Campos
```typescript
const updatePostDto: UpdatePostDto = {
  title: 'Título actualizado',
  description: 'Nueva descripción',
  content: 'Nuevo contenido',
  imageUrl: '/uploads/posts/updated-image.jpg',
  type: 'text_with_image',
};
```

## Integración con el Servicio

El `UpdatePostDto` se usa en el método `update()` del `PostsService`:

```typescript
async update(
  id: string,
  updatePostDto: UpdatePostDto,
  user: User,
): Promise<Post>
```

El servicio:
1. Busca el post por ID
2. Verifica que el usuario sea el autor del post
3. Actualiza solo los campos proporcionados
4. Recalcula el tipo si es necesario
5. Guarda los cambios en la base de datos

## Validaciones

Las validaciones de `CreatePostDto` se aplican solo a los campos que se proporcionan:

- Si se actualiza `title`, debe cumplir con las validaciones (no vacío, max 255 caracteres)
- Si se actualiza `imageUrl` y el tipo es 'image' o 'text_with_image', debe ser válido
- Si se actualiza `type`, debe ser uno de los valores permitidos

## Notas Técnicas

- Usa `PartialType` de `@nestjs/mapped-types` para hacer todos los campos opcionales
- Las validaciones se aplican solo a los campos proporcionados
- El servicio maneja la lógica de actualización parcial
- El tipo se recalcula automáticamente si es necesario

