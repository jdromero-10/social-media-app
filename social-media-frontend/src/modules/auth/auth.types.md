# auth.types.ts - Documentación

## Descripción
Este archivo contiene todas las definiciones de tipos TypeScript relacionadas con la autenticación. Define los DTOs (Data Transfer Objects) para las peticiones y respuestas de los endpoints de autenticación, así como los tipos de datos del usuario.

## Tipos Exportados

### `LoginDto`
```typescript
interface LoginDto {
  email: string;
  password: string;
}
```
- **Propósito**: Define la estructura de datos requerida para el endpoint de login.
- **Campos**:
  - `email`: Correo electrónico del usuario (string)
  - `password`: Contraseña del usuario (string)
- **Uso**: Se envía en el body de la petición `POST /auth/login`.

### `RegisterDto`
```typescript
interface RegisterDto {
  email: string;
  password: string;
  name: string;
  username: string;
}
```
- **Propósito**: Define la estructura de datos requerida para el endpoint de registro.
- **Campos**:
  - `email`: Correo electrónico del usuario (string, requerido)
  - `password`: Contraseña del usuario (string, requerido)
  - `name`: Nombre completo del usuario (string, requerido)
  - `username`: Nombre de usuario único (string, requerido, mínimo 3 caracteres)
- **Uso**: Se envía en el body de la petición `POST /auth/register`.

### `User`
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  imageUrl?: string | null;
  bio?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
```
- **Propósito**: Representa los datos básicos de un usuario en el sistema.
- **Campos**:
  - `id`: Identificador único del usuario (string)
  - `email`: Correo electrónico (string)
  - `name`: Nombre completo (string)
  - `username`: Nombre de usuario único (string, requerido)
  - `imageUrl`: URL de la imagen de perfil (string | null, opcional)
  - `bio`: Biografía del usuario (string | null, opcional, máximo 500 caracteres)
  - `createdAt`: Fecha de creación (string ISO, opcional)
  - `updatedAt`: Fecha de última actualización (string ISO, opcional)
- **Uso**: Retornado por el backend después de login/register exitoso y en el endpoint `/auth/me`.

### `AuthResponse`
```typescript
interface AuthResponse {
  access_token?: string;  // Opcional, ya que ahora se maneja con cookies HTTP-only
  user: User;
}
```
- **Propósito**: Define la estructura de la respuesta de los endpoints de autenticación.
- **Campos**:
  - `access_token`: Token JWT (opcional, ya no se devuelve en el body, se maneja mediante cookies HTTP-only)
  - `user`: Objeto con los datos del usuario autenticado (User)
- **Uso**: Respuesta de `POST /auth/login` y `POST /auth/register` cuando son exitosos.
- **Nota importante**: El token JWT ahora se establece automáticamente como una cookie HTTP-only por el backend. No es necesario (ni posible) acceder a él desde JavaScript.

### `AuthState`
```typescript
interface AuthState {
  user: User | null;
  token: string | null;  // Mantenido para compatibilidad, pero ya no se usa
  isAuthenticated: boolean;
}
```
- **Propósito**: Representa el estado de autenticación en la aplicación frontend.
- **Campos**:
  - `user`: Datos del usuario autenticado o `null` si no hay sesión (User | null)
  - `token`: Token JWT (mantenido para compatibilidad, pero ya no se usa ya que los tokens se manejan mediante cookies HTTP-only)
  - `isAuthenticated`: Flag booleano que indica si el usuario está autenticado (boolean)
- **Uso**: Útil para manejar el estado global de autenticación (por ejemplo, con Zustand o Context API).
- **Nota**: El campo `token` se mantiene por compatibilidad, pero los tokens ahora se manejan automáticamente mediante cookies HTTP-only establecidas por el backend.

## Relaciones entre Tipos

```
LoginDto / RegisterDto
    ↓
    POST /auth/login o /auth/register
    ↓
Backend establece cookie HTTP-only con token
    ↓
AuthResponse {
  access_token?: string  // Opcional, no se devuelve en el body
  user: User
}
    ↓
Token guardado automáticamente en cookie (no accesible desde JS)
    ↓
AuthState (estado en frontend)
    ↓
Peticiones futuras incluyen cookie automáticamente
```

## Notas de Implementación

1. **Validación**: Estos tipos deben coincidir con los DTOs del backend NestJS. Si el backend cambia, actualiza estos tipos.
2. **Opcionalidad**: Los campos opcionales (`?`) permiten flexibilidad, pero asegúrate de que el backend los maneje correctamente.
3. **Seguridad**: El `password` nunca debe ser incluido en tipos de respuesta, solo en DTOs de request.
4. **Extensibilidad**: Puedes agregar más campos a `User` según las necesidades de tu aplicación (avatar, bio, etc.).
5. **Cookies HTTP-only**: Los tokens JWT ahora se manejan mediante cookies HTTP-only establecidas por el backend. El campo `access_token` en `AuthResponse` es opcional y ya no se devuelve en el body de la respuesta.

## Ejemplo de Uso

```typescript
import { LoginDto, AuthResponse, User } from './auth.types';

// Al hacer login
const loginData: LoginDto = {
  email: 'user@example.com',
  password: 'password123'
};

// La respuesta será de tipo AuthResponse
const response: AuthResponse = await login(loginData);
// El token se guarda automáticamente en una cookie HTTP-only
// response.user contiene los datos del usuario
// Nota: response.access_token es opcional y ya no se devuelve en el body
```

