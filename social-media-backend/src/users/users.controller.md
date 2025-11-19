# users.controller.ts - Documentación

## Descripción
Controlador que maneja las peticiones HTTP relacionadas con usuarios. Define los endpoints para operaciones CRUD de usuarios.

## Endpoints

### `POST /users`
Crea un nuevo usuario.

**Autenticación**: No requerida (puede cambiar según requisitos)

**Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Juan Pérez",
  "username": "juanperez"
}
```

**Respuesta**: Usuario creado (sin password)

---

### `GET /users`
Obtiene todos los usuarios del sistema.

**Autenticación**: No requerida (puede cambiar según requisitos)

**Respuesta**: Array de usuarios (sin password)

**Campos retornados**:
- `id`, `email`, `name`, `username`, `imageUrl`, `bio`, `authStrategy`, `createdAt`, `updatedAt`

---

### `GET /users/:id`
Obtiene un usuario específico por su ID.

**Autenticación**: No requerida

**Path Parameters**:
- `id`: UUID del usuario

**Respuesta**: Usuario encontrado (sin password)

**Errores**:
- `404 Not Found`: Si el usuario no existe

---

### `PUT /users/:id`
Actualiza un usuario existente.

**Autenticación**: Requerida (`@UseGuards(JwtAuthGuard)`)

**Path Parameters**:
- `id`: UUID del usuario a actualizar

**Body** (todos los campos son opcionales):
```json
{
  "name": "Juan Pérez",
  "username": "juanperez",
  "email": "juan@example.com",
  "bio": "Desarrollador de software",
  "imageUrl": "https://example.com/avatar.jpg"
}
```

**Respuesta**: Usuario actualizado

**Validaciones**:
- Solo el usuario puede actualizar su propio perfil
- Email y username deben ser únicos si se actualizan
- Validaciones de formato y longitud según `UpdateUserDto`

**Errores**:
- `401 Unauthorized`: Si no está autenticado
- `403 Forbidden`: Si intenta actualizar otro usuario
- `404 Not Found`: Si el usuario no existe
- `409 Conflict`: Si el email o username ya están en uso
- `400 Bad Request`: Si los datos de validación fallan

**Ejemplo de uso**:
```bash
PUT /users/user-uuid-here
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Juan Pérez Actualizado",
  "bio": "Nueva biografía"
}
```

---

### `POST /users/delete-by-email`
Elimina un usuario por email (endpoint temporal para desarrollo).

**Autenticación**: No requerida

**Body**:
```json
{
  "email": "user@example.com"
}
```

**Respuesta**:
```json
{
  "success": true,
  "message": "Usuario eliminado correctamente"
}
```

**Nota**: Este endpoint es temporal y solo para desarrollo. En producción debería implementarse un endpoint `DELETE /users/:id` con autenticación.

---

## Autenticación

### Endpoints Protegidos
- `PUT /users/:id` - Requiere autenticación JWT

### Obtención del Usuario Autenticado
El usuario autenticado se obtiene del request usando `@Request() req: { user: User }`:

```typescript
@UseGuards(JwtAuthGuard)
async update(
  @Param('id') id: string,
  @Body() updateUserDto: UpdateUserDto,
  @Request() req: { user: User },
): Promise<User> {
  // req.user contiene el usuario autenticado
  return await this.usersService.update(id, updateUserDto, req.user);
}
```

## Autorización

### Verificación de Propiedad
El endpoint `PUT /users/:id` verifica que el usuario autenticado solo pueda actualizar su propio perfil:

- Si el usuario intenta actualizar otro usuario, se retorna `403 Forbidden`
- Solo el usuario con el mismo ID puede actualizar su perfil

## Validación

### DTOs
- `CreateUserDto`: Para crear usuarios (validaciones con class-validator)
- `UpdateUserDto`: Para actualizar usuarios (campos opcionales)

### Validaciones Automáticas
NestJS ejecuta automáticamente las validaciones usando `ValidationPipe` cuando está configurado en `main.ts`.

## Campos `imageUrl` y `bio`

Estos campos están completamente integrados:

- **imageUrl**: Se puede actualizar mediante `PUT /users/:id` con el campo `imageUrl` en el body
- **bio**: Se puede actualizar mediante `PUT /users/:id` con el campo `bio` en el body (máximo 500 caracteres)
- Ambos campos se retornan en `GET /users` y `GET /users/:id`
- Ambos campos son opcionales y nullable

## Ejemplo Completo de Actualización

```bash
# Request
PUT /users/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Juan Pérez",
  "bio": "Desarrollador de software apasionado",
  "imageUrl": "https://example.com/avatars/juan.jpg"
}

# Response 200 OK
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "juan@example.com",
  "name": "Juan Pérez",
  "username": "juanperez",
  "imageUrl": "https://example.com/avatars/juan.jpg",
  "bio": "Desarrollador de software apasionado",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

## Notas Técnicas

- Todos los endpoints retornan usuarios sin el campo `password` por seguridad
- El método `update` realiza actualización parcial (solo actualiza los campos proporcionados)
- Las validaciones de unicidad se realizan en el servicio, no en el controlador
- El endpoint `PUT /users/:id` requiere que el ID del path coincida con el ID del usuario autenticado

