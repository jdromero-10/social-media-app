# auth-api.ts - Documentación

## Descripción
Este archivo contiene el servicio API específico para operaciones de autenticación. Actúa como una capa de abstracción entre los componentes/hooks de React y el cliente API base, proporcionando métodos tipados y específicos para login y registro.

## Estructura

El archivo exporta un objeto `authApi` con métodos que encapsulan las llamadas a los endpoints de autenticación del backend.

## Métodos Exportados

### `login(credentials: LoginDto): Promise<AuthResponse>`
- **Propósito**: Inicia sesión de un usuario existente.
- **Parámetros**:
  - `credentials`: Objeto de tipo `LoginDto` con `email` y `password`
- **Retorna**: `Promise<AuthResponse>` que contiene:
  - `user`: Datos del usuario autenticado
  - `access_token`: Opcional (ya no se devuelve en el body, se maneja mediante cookies)
- **Endpoint**: `POST /auth/login`
- **Cookies**: El backend establece automáticamente una cookie HTTP-only con el token JWT
- **Ejemplo de uso**:
  ```typescript
  const response = await authApi.login({
    email: 'user@example.com',
    password: 'password123'
  });
  // El token se guarda automáticamente en una cookie HTTP-only
  console.log(response.user); // Datos del usuario
  ```

### `register(userData: RegisterDto): Promise<AuthResponse>`
- **Propósito**: Registra un nuevo usuario en el sistema.
- **Parámetros**:
  - `userData`: Objeto de tipo `RegisterDto` con `email`, `password`, `name` y opcionalmente `username`
- **Retorna**: `Promise<AuthResponse>` que contiene:
  - `user`: Datos del usuario recién registrado
  - `access_token`: Opcional (ya no se devuelve en el body, se maneja mediante cookies)
- **Endpoint**: `POST /auth/register`
- **Cookies**: El backend establece automáticamente una cookie HTTP-only con el token JWT
- **Ejemplo de uso**:
  ```typescript
  const response = await authApi.register({
    email: 'newuser@example.com',
    password: 'password123',
    name: 'John Doe',
    username: 'johndoe'
  });
  // El token se guarda automáticamente en una cookie HTTP-only
  console.log(response.user); // Datos del nuevo usuario
  ```

### `logout(): Promise<{ message: string }>`
- **Propósito**: Cierra la sesión del usuario actual.
- **Parámetros**: Ninguno
- **Retorna**: `Promise<{ message: string }>` con mensaje de confirmación
- **Endpoint**: `POST /auth/logout`
- **Cookies**: El backend limpia la cookie `access_token`
- **Ejemplo de uso**:
  ```typescript
  await authApi.logout();
  // La cookie access_token ha sido eliminada
  ```

### `validateField(field: 'email' | 'username', value: string): Promise<{ isUnique: boolean; message?: string }>`
- **Propósito**: Valida si un campo (email o username) es único en la base de datos antes del registro.
- **Parámetros**:
  - `field`: El campo a validar, debe ser `'email'` o `'username'`
  - `value`: El valor a verificar
- **Retorna**: `Promise<{ isUnique: boolean; message?: string }>` que contiene:
  - `isUnique`: `true` si el valor es único, `false` si ya existe
  - `message`: Mensaje opcional cuando el campo no es único (ej: "El correo electrónico ya está en uso")
- **Endpoint**: `POST /auth/validate`
- **Uso**: Validación en tiempo real durante el registro para mejorar la UX
- **Nota**: Siempre retorna 200 OK, ya que la petición es válida. El resultado indica si el campo es único o no.
- **Ejemplo de uso**:
  ```typescript
  // Validar email
  const emailResult = await authApi.validateField('email', 'user@example.com');
  if (!emailResult.isUnique) {
    console.log(emailResult.message); // "El correo electrónico ya está en uso"
  }

  // Validar username
  const usernameResult = await authApi.validateField('username', 'johndoe');
  if (usernameResult.isUnique) {
    console.log('Username disponible');
  }
  ```

## Dependencias

- **apiClient**: Utiliza el cliente API base (`apiClient`) para realizar las peticiones HTTP.
- **Tipos**: Importa tipos de `auth.types.ts` para garantizar tipado fuerte.

## Flujo de Datos con Cookies

```
Componente/Hook
    ↓
authApi.login() o authApi.register()
    ↓
apiClient.post() (con credentials: 'include')
    ↓
Backend (NestJS)
    ├─ Valida credenciales
    ├─ Genera token JWT
    └─ Establece cookie HTTP-only
    ↓
AuthResponse (solo user, sin token)
    ↓
Navegador guarda cookie automáticamente
    ↓
Componente/Hook (con user)
    ↓
Peticiones futuras incluyen cookie automáticamente
```

## Manejo de Errores

Los errores son propagados desde `apiClient` y deben ser manejados en el componente o hook que utiliza estos métodos:

```typescript
try {
  const response = await authApi.login(credentials);
  // Manejar éxito
} catch (error) {
  // error es de tipo ApiError
  console.error(error.message);
  console.error(error.statusCode);
}
```

## Ventajas de esta Arquitectura

1. **Separación de responsabilidades**: La lógica de API está separada de los componentes React.
2. **Reutilización**: Los métodos pueden ser usados desde cualquier parte de la aplicación.
3. **Tipado fuerte**: TypeScript garantiza que los datos enviados y recibidos sean correctos.
4. **Mantenibilidad**: Si el endpoint cambia, solo necesitas actualizar este archivo.
5. **Testeable**: Fácil de mockear en tests unitarios.

## Implementación de Cookies HTTP-Only

### ¿Por qué cookies en lugar de headers?

La aplicación ha migrado de usar tokens en headers `Authorization` a cookies HTTP-only por:

1. **Seguridad**: Las cookies HTTP-only no son accesibles desde JavaScript, previniendo ataques XSS.
2. **Automatización**: El navegador envía automáticamente las cookies en cada petición.
3. **Mejor UX**: No necesitas manejar manualmente el token en el frontend.

### Configuración

- Las cookies se establecen automáticamente por el backend en login/register.
- Se envían automáticamente en cada petición gracias a `credentials: 'include'` en `apiClient`.
- Se limpian automáticamente al llamar a `logout()`.

## Mejoras Implementadas (2024)

- ✅ **Validación en tiempo real**: Agregado método `validateField()` para validar unicidad de email y username antes del registro
- ✅ **Mejor UX**: Los usuarios pueden verificar si su email o username está disponible antes de enviar el formulario
- ✅ **Validación asíncrona**: Integrado con Yup para validación en tiempo real en formularios

## Extensión Futura

Puedes agregar más métodos aquí según crezca tu aplicación:
- `refreshToken()`: Para renovar el token JWT
- `forgotPassword()`: Para recuperación de contraseña
- `resetPassword()`: Para restablecer contraseña
- `verifyEmail()`: Para verificación de email

