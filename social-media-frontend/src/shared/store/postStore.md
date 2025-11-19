# postStore.ts - Documentación

## Descripción
Store de Zustand para gestionar el estado global de los posts. Proporciona acciones para CRUD de posts, paginación, scroll infinito y actualizaciones optimistas.

## Estado

```typescript
interface PostState {
  posts: Post[];              // Array de posts
  isLoading: boolean;         // Estado de carga
  error: ApiError | null;     // Error actual
  page: number;              // Página actual
  limit: number;             // Límite de posts por página
  hasMore: boolean;          // Si hay más posts para cargar
  isCreating: boolean;       // Estado de creación
  isUpdating: boolean;       // Estado de actualización
  isDeleting: boolean;       // Estado de eliminación
}
```

## Acciones

### `fetchPosts(page?: number, limit?: number, append?: boolean)`
Obtiene posts con paginación.

**Parámetros:**
- `page`: Número de página (default: 1)
- `limit`: Límite de posts (default: 10)
- `append`: Si es `true`, agrega posts al array existente (para scroll infinito)

**Ejemplo:**
```typescript
const { fetchPosts } = usePostStore();

// Cargar primera página
await fetchPosts(1, 10);

// Cargar siguiente página (append)
await fetchPosts(2, 10, true);
```

---

### `fetchPostById(id: string)`
Obtiene un post específico por ID.

**Parámetros:**
- `id`: UUID del post

**Retorna:**
- `Promise<Post | null>`: Post encontrado o null si hay error

**Ejemplo:**
```typescript
const post = await fetchPostById('post-uuid');
```

---

### `fetchUserPosts(userId: string, page?: number, limit?: number)`
Obtiene posts de un usuario específico.

**Parámetros:**
- `userId`: UUID del usuario
- `page`: Número de página (opcional)
- `limit`: Límite de posts (opcional)

---

### `createPost(postData: CreatePostDto)`
Crea un nuevo post. **Muestra notificaciones automáticamente** usando el sistema de toasts global.

**Parámetros:**
- `postData`: Datos del post a crear

**Retorna:**
- `Promise<Post | null>`: Post creado o null si hay error

**Características:**
- Agrega el post al inicio del array
- Actualiza `isCreating` durante la operación
- **Muestra notificación SUCCESS** si la creación es exitosa: "Publicación creada con éxito."
- **Muestra notificación ERROR** si falla: "Error al procesar la publicación. Intente de nuevo."

**Ejemplo:**
```typescript
const newPost = await createPost({
  title: 'Mi nuevo post',
  description: 'Descripción',
});
```

---

### `updatePost(id: string, postData: UpdatePostDto)`
Actualiza un post existente. **Muestra notificaciones automáticamente** usando el sistema de toasts global.

**Parámetros:**
- `id`: UUID del post
- `postData`: Datos a actualizar

**Retorna:**
- `Promise<Post | null>`: Post actualizado o null si hay error

**Características:**
- Actualiza el post en el array
- Mantiene el orden de los posts
- **Muestra notificación SUCCESS** si la actualización es exitosa: "Publicación actualizada con éxito."
- **Muestra notificación ERROR** si falla: "Error al procesar la publicación. Intente de nuevo."

---

### `deletePost(id: string)`
Elimina un post. **Muestra notificaciones automáticamente** usando el sistema de toasts global.

**Parámetros:**
- `id`: UUID del post

**Retorna:**
- `Promise<boolean>`: `true` si se eliminó correctamente

**Características:**
- Elimina el post del array
- Actualiza `isDeleting` durante la operación
- **Muestra notificación SUCCESS** si la eliminación es exitosa: "Publicación eliminada con éxito."
- **Muestra notificación ERROR** si falla: "Error al procesar la publicación. Intente de nuevo."

---

### `reset()`
Resetea el store al estado inicial.

**Ejemplo:**
```typescript
reset(); // Limpia todos los posts y resetea el estado
```

---

### `setError(error: ApiError | null)`
Establece un error manualmente.

---

### Acciones Optimistas

#### `addPost(post: Post)`
Agrega un post al store sin llamar a la API (optimistic update).

#### `updatePostInStore(id: string, postData: Partial<Post>)`
Actualiza un post en el store sin llamar a la API.

#### `removePostFromStore(id: string)`
Elimina un post del store sin llamar a la API.

#### `toggleLike(postId: string, userId: string)`
Toggle de like en un post (optimistic update).

**Ejemplo:**
```typescript
// Toggle like optimista
toggleLike('post-id', 'user-id');

// Luego hacer la llamada real a la API
await likePost('post-id');
```

## Uso

### Hook básico
```typescript
import { usePostStore } from '../../shared/store/postStore';

function MyComponent() {
  const { posts, isLoading, fetchPosts } = usePostStore();
  
  useEffect(() => {
    fetchPosts();
  }, []);
  
  return <div>{/* ... */}</div>;
}
```

### Selectores (mejor rendimiento)
```typescript
// Solo suscribirse a posts específicos
const posts = usePostStore((state) => state.posts);
const isLoading = usePostStore((state) => state.isLoading);

// O usar múltiples selectores
const { posts, isLoading } = usePostStore((state) => ({
  posts: state.posts,
  isLoading: state.isLoading,
}));
```

### Scroll infinito
```typescript
const { posts, hasMore, isLoading, page, fetchPosts } = usePostStore();

const loadMore = () => {
  if (hasMore && !isLoading) {
    fetchPosts(page + 1, 10, true); // append = true
  }
};
```

## Integración con Sistema de Notificaciones

El `PostStore` está **integrado automáticamente** con el sistema de notificaciones global (`toastStore`). Las acciones CRUD muestran notificaciones automáticamente:

### Notificaciones Automáticas

- **Crear Post**: 
  - ✅ SUCCESS: "Publicación creada con éxito."
  - ❌ ERROR: "Error al procesar la publicación. Intente de nuevo."

- **Actualizar Post**:
  - ✅ SUCCESS: "Publicación actualizada con éxito."
  - ❌ ERROR: "Error al procesar la publicación. Intente de nuevo."

- **Eliminar Post**:
  - ✅ SUCCESS: "Publicación eliminada con éxito."
  - ❌ ERROR: "Error al procesar la publicación. Intente de nuevo."

### Implementación

Las notificaciones se muestran usando `useToastStore.getState().showToast()` directamente en las acciones del store:

```typescript
// En createPost
try {
  const newPost = await postsApi.create(postData);
  // Notificación de éxito
  useToastStore.getState().showToast('Publicación creada con éxito.', 'SUCCESS');
  return newPost;
} catch (error) {
  // Notificación de error
  useToastStore.getState().showToast('Error al procesar la publicación. Intente de nuevo.', 'ERROR');
  return null;
}
```

**Nota**: No necesitas llamar manualmente a las notificaciones en los componentes. El store las maneja automáticamente.

## Integración con React Query

El store puede usarse junto con React Query para caché y sincronización:

```typescript
import { useQuery } from '@tanstack/react-query';
import { usePostStore } from '../../shared/store/postStore';

function PostsComponent() {
  const { fetchPosts } = usePostStore();
  
  const { data } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetchPosts(1, 10),
  });
}
```

## Notas Técnicas

- El store usa Zustand para gestión de estado
- Las actualizaciones optimistas mejoran la UX
- El estado se mantiene durante la sesión
- Los errores se almacenan en `error` y pueden ser limpiados con `setError(null)`
- **Integrado con `toastStore`**: Las notificaciones se muestran automáticamente en las acciones CRUD
- Las notificaciones usan el sistema global de toasts renderizado en `MainLayout` a través de `ToastProvider`

## Mejores Prácticas

1. **Usar selectores**: Solo suscribirse a los campos necesarios
2. **Resetear al cambiar de página**: Llamar `reset()` al cambiar de vista
3. **Manejar errores**: Siempre verificar `error` antes de mostrar datos
4. **Scroll infinito**: Usar `append: true` para agregar posts sin perder los existentes

