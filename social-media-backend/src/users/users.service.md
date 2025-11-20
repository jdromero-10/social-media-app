# users.service.ts - Documentación

## Descripción
Servicio que gestiona la lógica de negocio relacionada con usuarios. Proporciona métodos para crear, leer, actualizar y eliminar usuarios, así como validaciones de unicidad.

## Métodos

### `create(createUserDto: CreateUserDto): Promise<User>`
Crea un nuevo usuario en el sistema.

**Parámetros**:
- `createUserDto`: Datos del usuario a crear

**Retorna**: `Promise<User>` - Usuario creado

**Ejemplo**:
```typescript
const user = await usersService.create({
  email: 'user@example.com',
  password: 'password123',
  name: 'Juan Pérez',
  username: 'juanperez'
});
```

---

### `getAll(): Promise<User[]>`
Obtiene todos los usuarios del sistema.

**Retorna**: `Promise<User[]>` - Lista de usuarios (sin password)

**Campos retornados**:
- `id`, `email`, `name`, `username`, `imageUrl`, `bio`, `authStrategy`, `createdAt`, `updatedAt`

**Nota**: El password nunca se incluye en los resultados

---

### `getById(id: string): Promise<User | null>`
Obtiene un usuario por su ID.

**Parámetros**:
- `id`: UUID del usuario

**Retorna**: `Promise<User | null>` - Usuario encontrado o null

---

### `getByEmail(email: string): Promise<User | null>`
Obtiene un usuario por su email (búsqueda case-insensitive).

**Parámetros**:
- `email`: Email del usuario

**Retorna**: `Promise<User | null>` - Usuario encontrado o null

**Nota**: La búsqueda es case-insensitive usando query builder

---

### `getByUsername(username: string): Promise<User | null>`
Obtiene un usuario por su username (búsqueda case-insensitive).

**Parámetros**:
- `username`: Username del usuario

**Retorna**: `Promise<User | null>` - Usuario encontrado o null

**Nota**: La búsqueda es case-insensitive usando query builder

---

### `checkFieldUniqueness(field: 'email' | 'username', value: string): Promise<boolean>`
Verifica si un campo (email o username) es único en la base de datos.

**Parámetros**:
- `field`: Campo a validar ('email' o 'username')
- `value`: Valor a verificar

**Retorna**: `Promise<boolean>` - `true` si es único, `false` si ya existe

**Uso**: Utilizado en validaciones de formularios

---

### `update(id: string, updateUserDto: UpdateUserDto, currentUser: User): Promise<User>`
Actualiza un usuario existente.

**Parámetros**:
- `id`: UUID del usuario a actualizar
- `updateUserDto`: Datos a actualizar (campos opcionales)
- `currentUser`: Usuario autenticado que realiza la actualización

**Retorna**: `Promise<User>` - Usuario actualizado

**Validaciones**:
1. Verifica que el usuario exista (lanza `NotFoundException` si no existe)
2. Verifica que el usuario solo pueda actualizar su propio perfil (lanza `ForbiddenException` si intenta actualizar otro usuario)
3. Valida unicidad de email si se está actualizando (lanza `ConflictException` si ya está en uso)
4. Valida unicidad de username si se está actualizando (lanza `ConflictException` si ya está en uso)

**Campos actualizables**:
- `name`: Nombre completo
- `username`: Nombre de usuario (debe ser único)
- `email`: Email (debe ser único)
- `bio`: Biografía (máximo 500 caracteres)
- `imageUrl`: URL de la imagen de perfil

**Ejemplo**:
```typescript
const updatedUser = await usersService.update(
  userId,
  {
    name: 'Juan Pérez',
    bio: 'Desarrollador de software',
    imageUrl: 'https://example.com/avatar.jpg'
  },
  currentUser
);
```

**Errores**:
- `NotFoundException`: Si el usuario no existe
- `ForbiddenException`: Si el usuario intenta actualizar otro usuario
- `ConflictException`: Si el email o username ya están en uso

---

### `deleteByEmail(email: string): Promise<boolean>`
Elimina un usuario por su email (método temporal para desarrollo).

**Parámetros**:
- `email`: Email del usuario a eliminar

**Retorna**: `Promise<boolean>` - `true` si se eliminó, `false` si no se encontró

**Nota**: Este método es temporal y solo para desarrollo. En producción debería usarse `deleteById` con autenticación.

---

### `updatePassword(userId: string, hashedPassword: string): Promise<User>`
Actualiza la contraseña de un usuario (usado en recuperación de contraseña).

**Parámetros**:
- `userId`: UUID del usuario
- `hashedPassword`: Contraseña hasheada (con bcrypt)

**Retorna**: `Promise<User>` - Usuario actualizado

**Errores**:
- `NotFoundException`: Si el usuario no existe

**Uso**: Utilizado por `AuthService` en el flujo de recuperación de contraseña

**Ejemplo**:
```typescript
const hashedPassword = await bcrypt.hash('nuevaPassword123', 10);
await usersService.updatePassword(userId, hashedPassword);
```

**Nota**: Este método no requiere autenticación ya que se usa en el contexto de recuperación de contraseña donde el usuario no está autenticado.

---

## Manejo de Campos `imageUrl` y `bio`

Los campos `imageUrl` y `bio` están completamente integrados en el servicio:

### En `getAll()`
- Se incluyen en el `select` para retornar estos campos en la lista de usuarios

### En `update()`
- Se pueden actualizar mediante `UpdateUserDto`
- Se manejan como campos opcionales y nullable
- Se actualizan usando `Object.assign()` junto con los demás campos

### Validaciones
- `bio`: Máximo 500 caracteres (validado en `UpdateUserDto`)
- `imageUrl`: Sin validación de formato (se espera una URL válida)

## Seguridad

- El password nunca se retorna en ningún método
- Solo el usuario puede actualizar su propio perfil
- Las validaciones de unicidad previenen duplicados
- Las búsquedas son case-insensitive para mejor UX

## Dependencias

- `@nestjs/common`: Para excepciones (`NotFoundException`, `ForbiddenException`, `ConflictException`)
- `@nestjs/typeorm`: Para inyección del repositorio
- `typeorm`: Para operaciones de base de datos

