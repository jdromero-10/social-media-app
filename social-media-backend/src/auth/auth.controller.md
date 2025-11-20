# auth.controller.ts - Documentación

## Descripción
Este controlador maneja todos los endpoints relacionados con la autenticación: registro de nuevos usuarios, inicio de sesión y cierre de sesión. Implementa el manejo de tokens mediante cookies HTTP-only para mayor seguridad.

## Endpoints

### `POST /auth/register`
Registra un nuevo usuario en el sistema.

**Request Body** (`RegisterDto`):
```typescript
{
  email: string;
  password: string;
  name: string;
  username: string; // Requerido, mínimo 3 caracteres, único
}
```

**Response**:
```typescript
{
  user: {
    id: string;
    email: string;
    name: string;
    username: string;
    createdAt: string;
    updatedAt: string;
  }
}
```

**Cookies establecidas**:
- `access_token`: Token JWT HTTP-only (no incluido en el body de la respuesta)

**Comportamiento**:
1. Recibe los datos del nuevo usuario
2. Llama a `authService.register()` que crea el usuario y genera el token
3. Establece una cookie HTTP-only con el token JWT
4. Retorna los datos del usuario (sin el token en el body)

### `POST /auth/login`
Inicia sesión de un usuario existente.

**Request Body** (`LoginDto`):
```typescript
{
  email: string;
  password: string;
}
```

**Response**:
```typescript
{
  user: {
    id: string;
    email: string;
    name: string;
    username: string;
    createdAt: string;
    updatedAt: string;
  }
}
```

**Cookies establecidas**:
- `access_token`: Token JWT HTTP-only (no incluido en el body de la respuesta)

**Comportamiento**:
1. Recibe las credenciales del usuario
2. Llama a `authService.login()` que valida las credenciales y genera el token
3. Establece una cookie HTTP-only con el token JWT
4. Retorna los datos del usuario (sin el token en el body)

### `POST /auth/logout`
Cierra la sesión del usuario actual.

**Request**: No requiere body

**Response**:
```typescript
{
  message: "Logout exitoso"
}
```

**Comportamiento**:
1. Limpia la cookie `access_token` estableciendo su expiración en el pasado
2. Retorna un mensaje de confirmación

## Implementación de Cookies HTTP-Only

### Configuración de Cookies

Las cookies se establecen con las siguientes opciones de seguridad:

```typescript
res.cookie('access_token', token, {
  httpOnly: true,                    // No accesible desde JavaScript
  secure: process.env.NODE_ENV === 'production',  // Solo HTTPS en producción
  sameSite: 'lax',                   // Protección CSRF
  maxAge: 3600000,                   // 1 hora en milisegundos
});
```

### Ventajas de esta Implementación

1. **Seguridad mejorada**: Las cookies HTTP-only no son accesibles desde JavaScript, previniendo ataques XSS.
2. **Envío automático**: El navegador envía automáticamente las cookies en cada petición al mismo dominio.
3. **No exposición en el body**: El token nunca se expone en el body de la respuesta, reduciendo el riesgo de interceptación.

### Limpieza de Cookies en Logout

El endpoint de logout limpia la cookie estableciendo las mismas opciones y expirándola:

```typescript
res.clearCookie('access_token', {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
});
```

## Dependencias

- `@nestjs/common`: Decoradores de controlador (`Controller`, `Post`, `Body`, `Res`)
- `express`: Tipo `Response` para manejar cookies
- `AuthService`: Servicio que contiene la lógica de negocio de autenticación
- `LoginDto` y `RegisterDto`: DTOs para validación de datos

## Flujo de Autenticación

### Registro:
```
Cliente → POST /auth/register (email, password, name)
    ↓
AuthController.register()
    ↓
AuthService.register() → Crea usuario y genera token
    ↓
Establece cookie HTTP-only con token
    ↓
Retorna datos del usuario (sin token)
    ↓
Cliente recibe cookie automáticamente
```

### Login:
```
Cliente → POST /auth/login (email, password)
    ↓
AuthController.login()
    ↓
AuthService.login() → Valida credenciales y genera token
    ↓
Establece cookie HTTP-only con token
    ↓
Retorna datos del usuario (sin token)
    ↓
Cliente recibe cookie automáticamente
```

### Logout:
```
Cliente → POST /auth/logout
    ↓
AuthController.logout()
    ↓
Limpia cookie access_token
    ↓
Retorna confirmación
    ↓
Cliente ya no tiene cookie
```

## Manejo de Errores

Los errores son manejados por el `AuthService` y propagados automáticamente por NestJS:
- `ConflictException`: Cuando el email ya está en uso (registro)
- `UnauthorizedException`: Cuando las credenciales son inválidas (login)

## Notas de Seguridad

1. **No exponer tokens**: El token nunca se retorna en el body de la respuesta.
2. **Cookies seguras**: En producción, las cookies solo se envían por HTTPS.
3. **SameSite Lax**: Protege contra ataques CSRF mientras permite navegación normal.
4. **Expiración**: Los tokens expiran después de 1 hora (configurable en `AuthModule`).

### `GET /auth/me`
Obtiene los datos del usuario actual autenticado.

**Request**: No requiere body (usa el token de la cookie)

**Headers**: 
- Cookie: `access_token` (HTTP-only, enviada automáticamente)

**Response**:
```typescript
{
  id: string;
  email: string;
  name: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}
```

**Protección**: Requiere autenticación (usa `JwtAuthGuard`)

**Comportamiento**:
1. Extrae el token de la cookie HTTP-only
2. Valida el token usando `JwtStrategy`
3. Busca el usuario en la base de datos
4. Retorna los datos del usuario (sin la contraseña)

**Uso**: 
- Verificar si el usuario está autenticado
- Obtener datos del usuario actual en el frontend
- Usado por `ProtectedRoute` para verificar autenticación

### `POST /auth/forgot-password`
Solicita un código de recuperación de contraseña.

**Request Body** (`ForgotPasswordDto`):
```typescript
{
  email: string;
}
```

**Response**:
```typescript
{
  message: "Si el email existe, recibirás un código de recuperación en breve."
}
```

**Comportamiento**:
1. Recibe el email del usuario
2. Si el email existe, genera un código de 6 dígitos
3. Guarda el código en la base de datos con expiración de 15 minutos
4. Envía el código por email usando Resend
5. Siempre retorna el mismo mensaje (por seguridad)

**Notas de Seguridad**:
- No revela si el email existe o no
- El código expira después de 15 minutos
- Solo se puede usar una vez

---

### `POST /auth/verify-code`
Verifica un código de recuperación de contraseña.

**Request Body** (`VerifyCodeDto`):
```typescript
{
  email: string;
  code: string; // 6 dígitos
}
```

**Response** (éxito):
```typescript
{
  valid: true,
  message: "Código verificado correctamente"
}
```

**Response** (error):
```typescript
{
  message: "Código inválido" | "El código ha expirado",
  statusCode: 400
}
```

**Comportamiento**:
1. Busca el usuario por email
2. Busca el código más reciente no usado
3. Valida que el código coincida y no haya expirado
4. Retorna resultado de verificación

**Errores**:
- `NotFoundException`: Si el usuario no existe
- `BadRequestException`: Si el código es inválido o expirado

---

### `POST /auth/reset-password`
Restablece la contraseña del usuario.

**Request Body** (`ResetPasswordDto`):
```typescript
{
  email: string;
  code: string; // 6 dígitos (previamente verificado)
  newPassword: string;
  confirmPassword: string;
}
```

**Response**:
```typescript
{
  message: "Contraseña restablecida exitosamente"
}
```

**Comportamiento**:
1. Valida que las contraseñas coincidan
2. Busca el usuario por email
3. Re-valida el código (debe ser válido y no expirado)
4. Hashea la nueva contraseña con bcrypt
5. Actualiza la contraseña del usuario
6. Marca el código como usado

**Errores**:
- `BadRequestException`: Si las contraseñas no coinciden, código inválido o expirado
- `NotFoundException`: Si el usuario no existe

---

## Flujo de Recuperación de Contraseña

```
Usuario → POST /auth/forgot-password (email)
    ↓
AuthController.forgotPassword()
    ↓
AuthService.forgotPassword() → Genera código y envía email
    ↓
Retorna mensaje genérico
    ↓
Usuario recibe email con código
    ↓
Usuario → POST /auth/verify-code (email, code)
    ↓
AuthController.verifyCode()
    ↓
AuthService.verifyCode() → Valida código
    ↓
Retorna valid: true
    ↓
Usuario → POST /auth/reset-password (email, code, newPassword, confirmPassword)
    ↓
AuthController.resetPassword()
    ↓
AuthService.resetPassword() → Actualiza contraseña
    ↓
Retorna mensaje de éxito
    ↓
Usuario puede iniciar sesión con nueva contraseña
```

## Extensión Futura

Puedes agregar más endpoints aquí:
- `POST /auth/refresh`: Para renovar tokens

