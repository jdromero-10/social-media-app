# PostsService - Documentación

## Descripción
Servicio que maneja la lógica de negocio para los posts. Proporciona métodos CRUD completos para gestionar publicaciones en la red social, incluyendo validaciones de autorización y auto-detección del tipo de post.

## Dependencias

- `@InjectRepository(Post)`: Repositorio de TypeORM para la entidad Post
- `Repository<Post>`: Repositorio de TypeORM para operaciones de base de datos

## Métodos

### `getAll(page?: number, limit?: number): Promise<Post[]>`

Obtiene todos los posts con paginación opcional.

**Parámetros:**
- `page?: number`: Número de página (opcional)
- `limit?: number`: Límite de posts por página (opcional)

**Retorna:**
- `Promise<Post[]>`: Array de posts con información del autor

**Características:**
- Ordena los posts por fecha de creación descendente (más recientes primero)
- Incluye la relación con el autor (`relations: ['author']`)
- Soporta paginación opcional

**Ejemplo:**
```typescript
// Obtener todos los posts
const posts = await postsService.getAll();

// Obtener posts con paginación
const posts = await postsService.getAll(1, 10); // Página 1, 10 posts por página
```

---

### `getById(id: string): Promise<Post>`

Obtiene un post por su ID.

**Parámetros:**
- `id: string`: UUID del post

**Retorna:**
- `Promise<Post>`: Post con información del autor, likes y comentarios

**Lanza:**
- `NotFoundException`: Si el post no existe

**Características:**
- Incluye relaciones con autor, likes y comentarios
- Valida que el post exista

**Ejemplo:**
```typescript
const post = await postsService.getById('post-uuid-here');
```

---

### `getByUserId(userId: string, page?: number, limit?: number): Promise<Post[]>`

Obtiene todos los posts de un usuario específico.

**Parámetros:**
- `userId: string`: UUID del usuario
- `page?: number`: Número de página (opcional)
- `limit?: number`: Límite de posts por página (opcional)

**Retorna:**
- `Promise<Post[]>`: Array de posts del usuario

**Características:**
- Filtra posts por `authorId`
- Ordena por fecha de creación descendente
- Incluye la relación con el autor
- Soporta paginación opcional

**Ejemplo:**
```typescript
// Obtener todos los posts de un usuario
const userPosts = await postsService.getByUserId('user-uuid-here');

// Con paginación
const userPosts = await postsService.getByUserId('user-uuid-here', 1, 5);
```

---

### `create(createPostDto: CreatePostDto, user: User): Promise<Post>`

Crea un nuevo post.

**Parámetros:**
- `createPostDto: CreatePostDto`: Datos del post a crear
- `user: User`: Usuario autenticado que crea el post

**Retorna:**
- `Promise<Post>`: Post creado

**Características:**
- Auto-detecta el tipo de post si no se proporciona
- Asocia el post con el usuario autenticado
- Guarda el post en la base de datos

**Lógica de Auto-detección del Tipo:**
1. Si se proporciona `type`, se usa ese valor
2. Si no se proporciona `type`:
   - Si hay `imageUrl` Y `content`: `'text_with_image'`
   - Si hay `imageUrl` pero NO `content`: `'image'`
   - Si NO hay `imageUrl`: `'text'`

**Ejemplo:**
```typescript
const createPostDto: CreatePostDto = {
  content: '¿Qué estás pensando?',
  imageUrl: '/images/posts/uuid.jpg', // Opcional
};

const post = await postsService.create(createPostDto, authenticatedUser);
```

---

### `update(id: string, updatePostDto: UpdatePostDto, user: User): Promise<Post>`

Actualiza un post existente.

**Parámetros:**
- `id: string`: UUID del post a actualizar
- `updatePostDto: UpdatePostDto`: Datos a actualizar
- `user: User`: Usuario autenticado

**Retorna:**
- `Promise<Post>`: Post actualizado

**Lanza:**
- `NotFoundException`: Si el post no existe
- `ForbiddenException`: Si el usuario no es el autor del post

**Características:**
- Solo actualiza los campos proporcionados (actualización parcial)
- Verifica que el usuario sea el autor del post
- Recalcula el tipo si se actualiza `type` o `imageUrl`

**Lógica de Recalculo del Tipo:**
- Si se proporciona `type` explícitamente, se usa ese valor
- Si no se proporciona `type` pero se actualiza `imageUrl` o `content`:
  - Se calcula el tipo basado en los campos finales (actualizados + existentes)
  - Si hay `imageUrl` Y `content`: `'text_with_image'`
  - Si solo hay `imageUrl`: `'image'`
  - Si solo hay `content`: `'text'`

**Ejemplo:**
```typescript
const updatePostDto: UpdatePostDto = {
  content: 'Contenido actualizado',
  imageUrl: '/images/posts/new-uuid.jpg', // Opcional
};

const updatedPost = await postsService.update('post-uuid', updatePostDto, authenticatedUser);
```

---

### `delete(id: string, user: User): Promise<boolean>`

Elimina un post.

**Parámetros:**
- `id: string`: UUID del post a eliminar
- `user: User`: Usuario autenticado

**Retorna:**
- `Promise<boolean>`: `true` si se eliminó correctamente

**Lanza:**
- `NotFoundException`: Si el post no existe
- `ForbiddenException`: Si el usuario no es el autor del post

**Características:**
- Verifica que el usuario sea el autor del post
- Elimina el post de la base de datos
- Los likes y comentarios se eliminan automáticamente (CASCADE)

**Ejemplo:**
```typescript
const deleted = await postsService.delete('post-uuid', authenticatedUser);
```

## Seguridad y Autorización

### Verificación de Autoría
Los métodos `update()` y `delete()` verifican que el usuario autenticado sea el autor del post:

```typescript
if (post.authorId !== user.id) {
  throw new ForbiddenException('No tienes permiso para realizar esta acción');
}
```

### Relaciones CASCADE
- Si se elimina un usuario, sus posts se eliminan automáticamente (`onDelete: 'CASCADE'`)
- Si se elimina un post, sus likes y comentarios se eliminan automáticamente

## Manejo de Errores

### NotFoundException
Se lanza cuando:
- Se intenta obtener un post que no existe (`getById`)
- Se intenta actualizar un post que no existe (`update`)
- Se intenta eliminar un post que no existe (`delete`)

### ForbiddenException
Se lanza cuando:
- Un usuario intenta actualizar un post que no es suyo (`update`)
- Un usuario intenta eliminar un post que no es suyo (`delete`)

## Notas Técnicas

- Usa TypeORM Repository para operaciones de base de datos
- Incluye relaciones automáticamente cuando es necesario
- Soporta paginación opcional en métodos de listado
- Auto-detecta y recalcula el tipo de post según los campos
- Implementa validaciones de autorización para operaciones de escritura

