# PostsController - Documentación

## Descripción
Controlador REST que maneja las peticiones HTTP relacionadas con posts. Proporciona endpoints para operaciones CRUD completas, con autenticación JWT para operaciones de escritura.

## Ruta Base
`/posts`

## Endpoints

### `GET /posts`
Obtiene todos los posts con paginación opcional.

**Autenticación:** No requerida

**Query Parameters:**
- `page?: string`: Número de página (opcional)
- `limit?: string`: Límite de posts por página (opcional)

**Respuesta:**
```json
[
  {
    "id": "uuid",
    "title": "Título del post",
    "description": "Descripción",
    "content": "Contenido",
    "imageUrl": null,
    "type": "text",
    "authorId": "user-uuid",
    "author": {
      "id": "user-uuid",
      "email": "user@example.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Ejemplo de Uso:**
```bash
# Obtener todos los posts
GET /posts

# Con paginación
GET /posts?page=1&limit=10
```

---

### `GET /posts/user/:userId`
Obtiene todos los posts de un usuario específico.

**Autenticación:** No requerida

**Path Parameters:**
- `userId: string`: UUID del usuario

**Query Parameters:**
- `page?: string`: Número de página (opcional)
- `limit?: string`: Límite de posts por página (opcional)

**Respuesta:**
```json
[
  {
    "id": "uuid",
    "title": "Título del post",
    "authorId": "user-uuid",
    "author": { ... },
    ...
  }
]
```

**Ejemplo de Uso:**
```bash
GET /posts/user/user-uuid-here
GET /posts/user/user-uuid-here?page=1&limit=5
```

**Nota:** Esta ruta debe estar antes de `GET /posts/:id` para evitar conflictos de routing.

---

### `GET /posts/:id`
Obtiene un post por su ID.

**Autenticación:** No requerida

**Path Parameters:**
- `id: string`: UUID del post

**Respuesta:**
```json
{
  "id": "uuid",
  "title": "Título del post",
  "description": "Descripción",
  "content": "Contenido",
  "imageUrl": null,
  "type": "text",
  "authorId": "user-uuid",
  "author": {
    "id": "user-uuid",
    "email": "user@example.com"
  },
  "likes": [],
  "comments": [],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Errores:**
- `404 Not Found`: Si el post no existe

**Ejemplo de Uso:**
```bash
GET /posts/post-uuid-here
```

---

### `POST /posts`
Crea un nuevo post.

**Autenticación:** Requerida (`@UseGuards(JwtAuthGuard)`)

**Body:**
```json
{
  "title": "Título del post",
  "description": "Descripción opcional",
  "content": "Contenido opcional",
  "imageUrl": "/uploads/posts/image.jpg",
  "type": "text" // Opcional: "text", "image", "text_with_image"
}
```

**Respuesta:**
```json
{
  "id": "uuid",
  "title": "Título del post",
  "description": "Descripción",
  "content": "Contenido",
  "imageUrl": null,
  "type": "text",
  "authorId": "user-uuid",
  "author": { ... },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Errores:**
- `400 Bad Request`: Si los datos de validación fallan
- `401 Unauthorized`: Si no está autenticado

**Ejemplo de Uso:**
```bash
POST /posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Mi primera publicación",
  "description": "Esta es una descripción",
  "content": "Contenido completo..."
}
```

---

### `PUT /posts/:id`
Actualiza un post existente.

**Autenticación:** Requerida (`@UseGuards(JwtAuthGuard)`)

**Path Parameters:**
- `id: string`: UUID del post a actualizar

**Body (todos los campos son opcionales):**
```json
{
  "title": "Título actualizado",
  "description": "Nueva descripción",
  "content": "Nuevo contenido",
  "imageUrl": "/uploads/posts/new-image.jpg",
  "type": "text_with_image"
}
```

**Respuesta:**
```json
{
  "id": "uuid",
  "title": "Título actualizado",
  ...
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Errores:**
- `400 Bad Request`: Si los datos de validación fallan
- `401 Unauthorized`: Si no está autenticado
- `403 Forbidden`: Si el usuario no es el autor del post
- `404 Not Found`: Si el post no existe

**Ejemplo de Uso:**
```bash
PUT /posts/post-uuid-here
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Título actualizado"
}
```

---

### `DELETE /posts/:id`
Elimina un post.

**Autenticación:** Requerida (`@UseGuards(JwtAuthGuard)`)

**Path Parameters:**
- `id: string`: UUID del post a eliminar

**Respuesta:**
- Status Code: `204 No Content`
- Body: `{ "message": "Post eliminado exitosamente" }`

**Errores:**
- `401 Unauthorized`: Si no está autenticado
- `403 Forbidden`: Si el usuario no es el autor del post
- `404 Not Found`: Si el post no existe

**Ejemplo de Uso:**
```bash
DELETE /posts/post-uuid-here
Authorization: Bearer <token>
```

## Autenticación

### Endpoints Protegidos
Los siguientes endpoints requieren autenticación JWT:
- `POST /posts` - Crear post
- `PUT /posts/:id` - Actualizar post
- `DELETE /posts/:id` - Eliminar post

### Obtención del Usuario
El usuario autenticado se obtiene del request usando `@Request() req: { user: User }`:

```typescript
@UseGuards(JwtAuthGuard)
async create(@Request() req: { user: User }) {
  // req.user contiene el usuario autenticado
}
```

## Autorización

### Verificación de Autoría
Los endpoints `PUT` y `DELETE` verifican que el usuario autenticado sea el autor del post:

- Si el usuario no es el autor, se retorna `403 Forbidden`
- Solo el autor puede actualizar o eliminar sus propios posts

## Validación

### DTOs
- `CreatePostDto`: Para crear posts (validaciones con class-validator)
- `UpdatePostDto`: Para actualizar posts (campos opcionales)

### Validaciones Automáticas
NestJS ejecuta automáticamente las validaciones usando `ValidationPipe` cuando está configurado en `main.ts`.

## Orden de Rutas

**IMPORTANTE:** El orden de las rutas es crítico:

1. `GET /posts` - Debe estar primero
2. `GET /posts/user/:userId` - Debe estar antes de `GET /posts/:id`
3. `GET /posts/:id` - Debe estar después de las rutas específicas

Esto evita que rutas como `/posts/user` sean interpretadas como `/posts/:id` con `id = "user"`.

## Manejo de Errores

### Códigos de Estado HTTP
- `200 OK`: Operación exitosa (GET, PUT)
- `201 Created`: Recurso creado (POST)
- `204 No Content`: Recurso eliminado (DELETE)
- `400 Bad Request`: Datos de validación inválidos
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: No autorizado (no es el autor)
- `404 Not Found`: Recurso no encontrado

## Ejemplos Completos

### Crear un Post
```bash
curl -X POST http://localhost:3000/posts \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mi primera publicación",
    "description": "Esta es una descripción",
    "content": "Contenido completo del post..."
  }'
```

### Actualizar un Post
```bash
curl -X PUT http://localhost:3000/posts/post-uuid \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Título actualizado"
  }'
```

### Eliminar un Post
```bash
curl -X DELETE http://localhost:3000/posts/post-uuid \
  -H "Authorization: Bearer <token>"
```

## Notas Técnicas

- Usa `@UseGuards(JwtAuthGuard)` para proteger endpoints
- Usa `@Request()` para obtener el usuario autenticado
- Usa `@HttpCode(HttpStatus.NO_CONTENT)` para DELETE
- Soporta paginación opcional en endpoints GET
- Valida autorización antes de permitir actualizaciones/eliminaciones

