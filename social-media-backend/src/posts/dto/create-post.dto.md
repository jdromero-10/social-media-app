# CreatePostDto - Documentación

## Descripción
DTO (Data Transfer Object) para crear un nuevo post. Define la estructura de datos requerida y las validaciones necesarias para crear una publicación en la red social.

## Campos

### `title: string`
- **Tipo**: String
- **Requerido**: Sí
- **Validaciones**:
  - `@IsString()`: Debe ser una cadena de texto
  - `@IsNotEmpty()`: No puede estar vacío
  - `@MaxLength(255)`: Máximo 255 caracteres
- **Descripción**: Título del post (obligatorio)
- **Ejemplo**: `"Mi primera publicación"`

### `description?: string | null`
- **Tipo**: String o null
- **Requerido**: No (opcional)
- **Validaciones**:
  - `@IsString()`: Debe ser una cadena de texto si se proporciona
  - `@IsOptional()`: Campo opcional
- **Descripción**: Descripción opcional del post
- **Ejemplo**: `"Esta es una descripción de mi post"`

### `content?: string | null`
- **Tipo**: String o null
- **Requerido**: No (opcional)
- **Validaciones**:
  - `@IsString()`: Debe ser una cadena de texto si se proporciona
  - `@IsOptional()`: Campo opcional
- **Descripción**: Contenido de texto del post
- **Ejemplo**: `"Este es el contenido completo de mi publicación..."`

### `imageUrl?: string | null`
- **Tipo**: String (URL) o null
- **Requerido**: No (opcional, pero requerido para tipos 'image' y 'text_with_image')
- **Validaciones**:
  - `@IsString()`: Debe ser una cadena de texto si se proporciona
  - `@IsOptional()`: Campo opcional
- **Descripción**: URL de la imagen del post
- **Ejemplo**: `"/uploads/posts/image-123.jpg"`

### `type?: 'text' | 'image' | 'text_with_image'`
- **Tipo**: String literal union
- **Requerido**: No (se auto-detecta si no se proporciona)
- **Validaciones**:
  - `@IsString()`: Debe ser una cadena de texto
  - `@IsIn(['text', 'image', 'text_with_image'])`: Solo valores permitidos
  - `@IsOptional()`: Campo opcional
- **Valores posibles**:
  - `'text'`: Solo texto (title + description/content)
  - `'image'`: Solo imagen (imageUrl + title)
  - `'text_with_image'`: Imagen con texto (imageUrl + title + description/content)
- **Default**: Se auto-detecta basado en los campos proporcionados

## Validaciones Condicionales

### Para tipo 'image' o 'text_with_image'
- `imageUrl` es requerido si el tipo es 'image' o 'text_with_image'
- Validación: `@ValidateIf()` + `@IsNotEmpty()`

### Para tipo 'text' o 'text_with_image'
- `description` o `content` debe tener al menos uno si el tipo es 'text' o 'text_with_image'
- Validación: `@ValidateIf()` + `@IsNotEmpty()`

## Auto-detección del Tipo

Si no se proporciona el campo `type`, el servicio automáticamente determina el tipo basado en los campos proporcionados:

1. **Si hay `imageUrl` Y (`description` o `content`)**: `'text_with_image'`
2. **Si hay `imageUrl` pero NO (`description` o `content`)**: `'image'`
3. **Si NO hay `imageUrl`**: `'text'`

## Ejemplos de Uso

### Post de Solo Texto
```typescript
const createPostDto: CreatePostDto = {
  title: 'Mi primera publicación',
  description: 'Esta es una descripción',
  content: 'Contenido completo del post...',
  type: 'text', // Opcional, se auto-detecta
};
```

### Post con Solo Imagen
```typescript
const createPostDto: CreatePostDto = {
  title: 'Mi foto del día',
  imageUrl: '/uploads/posts/image-123.jpg',
  type: 'image', // Opcional, se auto-detecta
};
```

### Post con Imagen y Texto
```typescript
const createPostDto: CreatePostDto = {
  title: 'Mi experiencia hoy',
  description: 'Compartiendo mi experiencia',
  content: 'Hoy fue un día increíble...',
  imageUrl: '/uploads/posts/image-456.jpg',
  type: 'text_with_image', // Opcional, se auto-detecta
};
```

## Validaciones de Negocio

### Post de tipo 'text'
- ✅ `title` es requerido
- ✅ `description` o `content` debe tener al menos uno
- ✅ `imageUrl` debe ser null o no proporcionado

### Post de tipo 'image'
- ✅ `title` es requerido
- ✅ `imageUrl` es requerido
- ✅ `description` o `content` pueden ser null

### Post de tipo 'text_with_image'
- ✅ `title` es requerido
- ✅ `imageUrl` es requerido
- ✅ `description` o `content` debe tener al menos uno

## Integración con el Servicio

El `CreatePostDto` se usa en el método `create()` del `PostsService`:

```typescript
async create(createPostDto: CreatePostDto, user: User): Promise<Post>
```

El servicio:
1. Valida los datos usando class-validator
2. Auto-detecta el tipo si no se proporciona
3. Asocia el post con el usuario autenticado
4. Guarda el post en la base de datos

## Notas Técnicas

- Usa `class-validator` para validaciones
- Las validaciones se ejecutan automáticamente cuando se usa `ValidationPipe` en NestJS
- Los campos opcionales pueden ser `undefined` o `null`
- El tipo se auto-detecta si no se proporciona, pero puede especificarse explícitamente

