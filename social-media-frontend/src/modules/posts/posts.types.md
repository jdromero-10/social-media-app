# posts.types.ts - Documentación

## Descripción
Tipos e interfaces TypeScript para el módulo de Posts. Define todas las estructuras de datos relacionadas con publicaciones, likes, comentarios y operaciones CRUD.

## Tipos Exportados

### `PostType`
Enum que define los tipos de post disponibles:
- `TEXT = 'text'`: Post solo con texto
- `IMAGE = 'image'`: Post solo con imagen
- `TEXT_WITH_IMAGE = 'text_with_image'`: Post con texto e imagen

### `Like`
Interfaz que representa un like en un post:
```typescript
interface Like {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
  user?: User; // Usuario que dio el like (opcional)
}
```

### `Comment`
Interfaz que representa un comentario en un post:
```typescript
interface Comment {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  parentId?: string | null; // Para comentarios anidados
  createdAt: string;
  updatedAt: string;
  author?: User; // Autor del comentario (opcional)
}
```

### `Post`
Interfaz principal que representa un post completo:
```typescript
interface Post {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  imageUrl: string | null;
  type: PostType;
  authorId: string;
  author: User;
  likes?: Like[];
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
}
```

**Campos:**
- `id`: UUID único del post
- `title`: Título del post (requerido, max 255 caracteres)
- `description`: Descripción opcional del post
- `content`: Contenido de texto del post
- `imageUrl`: URL de la imagen del post (si tiene)
- `type`: Tipo de post (text, image, text_with_image)
- `authorId`: ID del usuario que creó el post
- `author`: Objeto User completo del autor
- `likes`: Array de likes (opcional, se carga bajo demanda)
- `comments`: Array de comentarios (opcional, se carga bajo demanda)
- `createdAt`: Fecha de creación (ISO string)
- `updatedAt`: Fecha de última actualización (ISO string)

### `CreatePostDto`
DTO para crear un nuevo post:
```typescript
interface CreatePostDto {
  title: string; // Requerido
  description?: string | null;
  content?: string | null;
  imageUrl?: string | null;
  type?: PostType; // Opcional, se auto-detecta
}
```

### `UpdatePostDto`
DTO para actualizar un post existente (todos los campos son opcionales):
```typescript
interface UpdatePostDto {
  title?: string;
  description?: string | null;
  content?: string | null;
  imageUrl?: string | null;
  type?: PostType;
}
```

## Uso

### Importar tipos
```typescript
import type { Post, CreatePostDto, UpdatePostDto, PostType } from './posts.types';
```

### Ejemplo de uso
```typescript
// Crear un nuevo post
const newPost: CreatePostDto = {
  title: 'Mi primera publicación',
  description: 'Esta es una descripción',
  content: 'Contenido completo del post...',
  type: PostType.TEXT,
};

// Actualizar un post
const updateData: UpdatePostDto = {
  title: 'Título actualizado',
  description: 'Nueva descripción',
};
```

## Relaciones

### Post → User
- Un post pertenece a un usuario (author)
- Relación Many-to-One

### Post → Likes
- Un post puede tener muchos likes
- Relación One-to-Many

### Post → Comments
- Un post puede tener muchos comentarios
- Relación One-to-Many
- Los comentarios pueden tener respuestas (parentId)

## Validaciones

### Al crear un post:
- `title` es requerido y no puede exceder 255 caracteres
- Si hay `imageUrl` y (`description` o `content`), el tipo será `TEXT_WITH_IMAGE`
- Si solo hay `imageUrl`, el tipo será `IMAGE`
- Si no hay `imageUrl`, el tipo será `TEXT`

## Notas Técnicas

- Todos los IDs son UUIDs (strings)
- Las fechas se manejan como ISO strings
- Los campos opcionales pueden ser `null` o `undefined`
- El tipo de post se puede auto-detectar o especificar manualmente

