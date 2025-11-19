# users-api.ts - Documentación

## Descripción
Este archivo contiene el servicio API específico para operaciones relacionadas con usuarios. Actúa como una capa de abstracción entre los componentes/hooks de React y el cliente API base, proporcionando métodos tipados para gestionar usuarios.

## Estructura

El archivo exporta un objeto `usersApi` con métodos que encapsulan las llamadas a los endpoints de usuarios del backend.

## Tipos Exportados

### `CreateUserDto`
```typescript
interface CreateUserDto {
  email: string;
  password: string;
}
```
- **Propósito**: Define la estructura de datos requerida para crear un nuevo usuario.
- **Campos**:
  - `email`: Correo electrónico del usuario (string, requerido)
  - `password`: Contraseña del usuario (string, requerido, mínimo 6 caracteres)
- **Uso**: Se envía en el body de la petición `POST /users`.

### `UpdateProfileDto`
```typescript
interface UpdateProfileDto {
  name?: string;
  bio?: string | null;
  imageUrl?: string | null;
}
```
- **Propósito**: Define la estructura de datos para actualizar el perfil del usuario autenticado.
- **Campos**:
  - `name`: Nombre completo del usuario (string, opcional)
  - `bio`: Biografía del usuario (string | null, opcional, máximo 500 caracteres)
  - `imageUrl`: URL de la imagen de perfil (string | null, opcional)
- **Uso**: Se envía en el body de la petición `PATCH /users/profile`.

## Métodos Exportados

### `getAll(): Promise<User[]>`
- **Propósito**: Obtiene una lista de todos los usuarios del sistema.
- **Parámetros**: Ninguno
- **Retorna**: `Promise<User[]>` - Array con los datos de todos los usuarios
- **Endpoint**: `GET /users`
- **Autenticación**: Requiere token JWT (Bearer token)
- **Ejemplo de uso**:
  ```typescript
  const users = await usersApi.getAll();
  console.log(users); // Array de usuarios
  ```

### `getById(id: string): Promise<User>`
- **Propósito**: Obtiene los datos de un usuario específico por su ID.
- **Parámetros**:
  - `id`: ID único del usuario (UUID string)
- **Retorna**: `Promise<User>` - Datos del usuario solicitado
- **Endpoint**: `GET /users/:id`
- **Autenticación**: Requiere token JWT (Bearer token)
- **Ejemplo de uso**:
  ```typescript
  const user = await usersApi.getById('123e4567-e89b-12d3-a456-426614174000');
  console.log(user.email); // Email del usuario
  ```

### `create(userData: CreateUserDto): Promise<User>`
- **Propósito**: Crea un nuevo usuario en el sistema.
- **Parámetros**:
  - `userData`: Objeto de tipo `CreateUserDto` con `email` y `password`
- **Retorna**: `Promise<User>` - Datos del usuario recién creado
- **Endpoint**: `POST /users`
- **Autenticación**: Requiere token JWT (Bearer token)
- **Ejemplo de uso**:
  ```typescript
  const newUser = await usersApi.create({
    email: 'newuser@example.com',
    password: 'password123'
  });
  console.log(newUser.id); // ID del nuevo usuario
  ```

### `updateProfile(userId: string, userData: UpdateProfileDto): Promise<User>`
- **Propósito**: Actualiza el perfil de un usuario específico.
- **Parámetros**:
  - `userId`: ID del usuario a actualizar (UUID)
  - `userData`: Objeto de tipo `UpdateProfileDto` con los campos a actualizar
- **Retorna**: `Promise<User>` - Datos del usuario actualizado
- **Endpoint**: `PUT /users/:id`
- **Autenticación**: Requiere token JWT (Bearer token)
- **Nota**: 
  - Solo actualiza los campos proporcionados (parcial update)
  - Solo el usuario puede actualizar su propio perfil (verificado en el backend)
- **Ejemplo de uso**:
  ```typescript
  const updatedUser = await usersApi.updateProfile(userId, {
    name: 'Juan Pérez',
    bio: 'Desarrollador de software',
    imageUrl: 'https://example.com/avatar.jpg'
  });
  console.log(updatedUser.name); // Nombre actualizado
  ```

## Dependencias

- **apiClient**: Utiliza el cliente API base (`apiClient`) para realizar las peticiones HTTP.
- **Tipos**: Importa el tipo `User` de `auth.types.ts` para garantizar tipado fuerte.

## Flujo de Datos

```
Componente/Hook
    ↓
usersApi.getAll() / usersApi.getById() / usersApi.create()
    ↓
apiClient.get() / apiClient.post()
    ↓
Backend (NestJS) - Endpoint /users
    ↓
User[] o User
    ↓
Componente/Hook (con datos del usuario/usuarios)
```

## Manejo de Errores

Los errores son propagados desde `apiClient` y deben ser manejados en el componente o hook que utiliza estos métodos:

```typescript
try {
  const users = await usersApi.getAll();
  // Manejar éxito
} catch (error) {
  // error es de tipo ApiError
  console.error(error.message);
  console.error(error.statusCode);
}
```

## Notas Importantes

1. **Autenticación**: Todos los endpoints de usuarios requieren autenticación JWT. El token se incluye automáticamente en los headers mediante `apiClient`.

2. **Diferencias con Auth**: 
   - `authApi.register()` crea un usuario Y devuelve un token de autenticación
   - `usersApi.create()` solo crea un usuario (útil para administradores)

3. **Seguridad**: El endpoint `getAll()` puede retornar información limitada según la configuración del backend (por ejemplo, sin passwords).

## Ventajas de esta Arquitectura

1. **Separación de responsabilidades**: La lógica de API está separada de los componentes React.
2. **Reutilización**: Los métodos pueden ser usados desde cualquier parte de la aplicación.
3. **Tipado fuerte**: TypeScript garantiza que los datos enviados y recibidos sean correctos.
4. **Mantenibilidad**: Si el endpoint cambia, solo necesitas actualizar este archivo.
5. **Testeable**: Fácil de mockear en tests unitarios.

## Métodos Implementados

- ✅ `getAll()`: Obtiene todos los usuarios
- ✅ `getById(id)`: Obtiene un usuario por ID
- ✅ `create(userData)`: Crea un nuevo usuario
- ✅ `updateProfile(userData)`: Actualiza el perfil del usuario autenticado

## Extensión Futura

Puedes agregar más métodos aquí según crezca tu aplicación:
- `update(id: string, userData: UpdateUserDto)`: Para actualizar datos de usuario (admin)
- `delete(id: string)`: Para eliminar un usuario
- `getProfile()`: Para obtener el perfil del usuario autenticado (si se necesita endpoint específico)
- `uploadAvatar(file: File)`: Para subir archivo de imagen de perfil

