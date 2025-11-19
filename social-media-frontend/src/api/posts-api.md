# posts-api.ts - Documentación

## Descripción
Servicio API para operaciones CRUD de posts. Proporciona métodos para interactuar con el backend relacionado con publicaciones.

## Métodos

### `getAll(page?: number, limit?: number): Promise<Post[]>`
Obtiene todos los posts con paginación opcional.

**Parámetros:**
- `page?: number`: Número de página (opcional, default: 1)
- `limit?: number`: Límite de posts por página (opcional, default: 10)

**Retorna:**
- `Promise<Post[]>`: Array de posts ordenados por fecha descendente

**Ejemplo:**
```typescript
// Obtener todos los posts
const posts = await postsApi.getAll();

// Obtener posts con paginación
const posts = await postsApi.getAll(1, 10); // Página 1, 10 posts
```

**Endpoint:** `GET /posts?page=1&limit=10`

---

### `getById(id: string): Promise<Post>`
Obtiene un post específico por su ID.

**Parámetros:**
- `id: string`: UUID del post

**Retorna:**
- `Promise<Post>`: Post completo con todas sus relaciones (author, likes, comments)

**Ejemplo:**
```typescript
const post = await postsApi.getById('post-uuid-here');
```

**Endpoint:** `GET /posts/:id`

---

### `getByUserId(userId: string, page?: number, limit?: number): Promise<Post[]>`
Obtiene todos los posts de un usuario específico.

**Parámetros:**
- `userId: string`: UUID del usuario
- `page?: number`: Número de página (opcional)
- `limit?: number`: Límite de posts por página (opcional)

**Retorna:**
- `Promise<Post[]>`: Array de posts del usuario

**Ejemplo:**
```typescript
const userPosts = await postsApi.getByUserId('user-uuid', 1, 10);
```

**Endpoint:** `GET /posts/user/:userId?page=1&limit=10`

---

### `create(postData: CreatePostDto): Promise<Post>`
Crea un nuevo post.

**Parámetros:**
- `postData: CreatePostDto`: Datos del post a crear

**Retorna:**
- `Promise<Post>`: Post creado

**Características:**
- Usa `FormData` para soportar envío de archivos
- El tipo de post se auto-detecta si no se especifica
- Requiere autenticación (cookie HTTP-only)

**Ejemplo:**
```typescript
const newPost = await postsApi.create({
  title: 'Mi nuevo post',
  description: 'Descripción',
  content: 'Contenido...',
  imageUrl: 'url-de-imagen',
});
```

**Endpoint:** `POST /posts` (multipart/form-data)

---

### `update(id: string, postData: UpdatePostDto): Promise<Post>`
Actualiza un post existente.

**Parámetros:**
- `id: string`: UUID del post a actualizar
- `postData: UpdatePostDto`: Datos a actualizar (todos opcionales)

**Retorna:**
- `Promise<Post>`: Post actualizado

**Ejemplo:**
```typescript
const updatedPost = await postsApi.update('post-uuid', {
  title: 'Título actualizado',
  description: 'Nueva descripción',
});
```

**Endpoint:** `PUT /posts/:id`

**Nota:** Solo el autor del post puede actualizarlo.

---

### `delete(id: string): Promise<{ message: string }>`
Elimina un post.

**Parámetros:**
- `id: string`: UUID del post a eliminar

**Retorna:**
- `Promise<{ message: string }>`: Mensaje de confirmación

**Ejemplo:**
```typescript
await postsApi.delete('post-uuid');
```

**Endpoint:** `DELETE /posts/:id`

**Nota:** Solo el autor del post puede eliminarlo.

## Manejo de Errores

Todos los métodos lanzan `ApiError` en caso de error:

```typescript
try {
  const post = await postsApi.getById('invalid-id');
} catch (error) {
  const apiError = error as ApiError;
  console.error(apiError.message);
  console.error(apiError.statusCode);
}
```

## Autenticación

Todas las operaciones (excepto `getAll` y `getById` en algunos casos) requieren autenticación mediante cookies HTTP-only. El token se envía automáticamente con `credentials: 'include'`.

## FormData para Creación

El método `create` usa `FormData` para soportar envío de archivos:

```typescript
const formData = new FormData();
formData.append('title', 'Mi post');
formData.append('description', 'Descripción');
// ... más campos
```

Esto permite enviar tanto texto como archivos en la misma petición.

## Uso con React Query

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { postsApi } from '../api/posts-api';

// Query para obtener posts
const { data: posts } = useQuery({
  queryKey: ['posts'],
  queryFn: () => postsApi.getAll(1, 10),
});

// Mutation para crear post
const createMutation = useMutation({
  mutationFn: postsApi.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  },
});
```

## Notas Técnicas

- Todos los endpoints usan cookies para autenticación
- La paginación es opcional pero recomendada para grandes volúmenes
- Los posts se ordenan por fecha de creación descendente
- El tipo de post se auto-detecta basado en los campos proporcionados

