# jwt.strategy.ts - Documentación

## Descripción
Este archivo implementa la estrategia JWT para Passport en NestJS. Define cómo se extrae y valida el token JWT de las peticiones entrantes. Ha sido actualizado para soportar tokens desde cookies HTTP-only, con fallback al header Authorization para compatibilidad.

## Estrategia JWT

### Configuración

La estrategia se configura con los siguientes parámetros:

```typescript
{
  jwtFromRequest: ExtractJwt.fromExtractors([...]),
  ignoreExpiration: false,
  secretOrKey: process.env.JWT_SECRET || 'changeThisSecret',
}
```

### Extracción del Token

La estrategia implementa un sistema de extracción múltiple que intenta obtener el token en el siguiente orden:

1. **Desde Cookies** (prioridad): 
   - Busca el token en `request.cookies.access_token`
   - Este es el método principal para la nueva implementación con cookies HTTP-only

2. **Desde Header Authorization** (fallback):
   - Si no encuentra el token en cookies, intenta extraerlo del header `Authorization: Bearer <token>`
   - Mantiene compatibilidad con implementaciones anteriores o clientes que aún usen headers

### Implementación del Extractor

```typescript
jwtFromRequest: ExtractJwt.fromExtractors([
  (request: Request) => {
    // Primero intentar obtener de cookies
    if (request?.cookies?.access_token) {
      return request.cookies.access_token;
    }
    // Fallback al header Authorization (para compatibilidad)
    return ExtractJwt.fromAuthHeaderAsBearerToken()(request);
  },
])
```

## Validación del Token

### Método `validate(payload: JwtPayload)`

Una vez que el token es extraído y decodificado, se ejecuta el método `validate()`:

1. **Extrae el ID del usuario** del payload JWT (`payload.sub`)
2. **Busca el usuario** en la base de datos usando `usersService.getById()`
3. **Valida que el usuario exista**: Si no existe, lanza `UnauthorizedException`
4. **Retorna el usuario**: El usuario retornado se adjunta a `request.user` y está disponible en los guards y controladores

### Payload JWT

El payload esperado tiene la siguiente estructura:

```typescript
interface JwtPayload {
  sub: string;    // ID del usuario
  email: string;  // Email del usuario
}
```

## Flujo de Autenticación

```
Petición HTTP entrante
    ↓
JwtStrategy extrae token
    ↓
¿Token en cookies?
    ├─ Sí → Usa token de cookies
    └─ No → Intenta header Authorization
        ↓
¿Token válido?
    ├─ No → 401 Unauthorized
    └─ Sí → Decodifica payload
        ↓
validate() busca usuario en BD
    ↓
¿Usuario existe?
    ├─ No → 401 Unauthorized
    └─ Sí → Adjunta usuario a request.user
        ↓
Guards y controladores pueden usar request.user
```

## Uso en Guards

Esta estrategia se usa automáticamente por `JwtAuthGuard`:

```typescript
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Request() req) {
  // req.user contiene el usuario validado
  return req.user;
}
```

## Dependencias

- `@nestjs/common`: `Injectable`, `UnauthorizedException`
- `@nestjs/passport`: `PassportStrategy`
- `passport-jwt`: `Strategy`, `ExtractJwt`
- `express`: Tipo `Request` para acceso a cookies
- `UsersService`: Servicio para buscar usuarios en la base de datos

## Migración a Cookies

### Cambios Realizados

1. **Antes**: Solo extraía tokens del header `Authorization: Bearer <token>`
2. **Ahora**: Prioriza cookies, con fallback al header para compatibilidad

### Ventajas

- **Seguridad mejorada**: Las cookies HTTP-only no son accesibles desde JavaScript
- **Compatibilidad**: Mantiene soporte para clientes que aún usen headers
- **Transición suave**: Permite migración gradual sin romper funcionalidad existente

## Configuración del Secret

El secret JWT se obtiene de:
- Variable de entorno: `process.env.JWT_SECRET`
- Valor por defecto: `'changeThisSecret'` (⚠️ **NO usar en producción**)

**Importante**: En producción, siempre configura `JWT_SECRET` en las variables de entorno.

## Manejo de Errores

La estrategia puede lanzar los siguientes errores:

- **Token inválido o expirado**: Passport automáticamente retorna 401
- **Usuario no encontrado**: `UnauthorizedException` con mensaje "Usuario no encontrado"

## Notas de Seguridad

1. **Validación de usuario**: Siempre valida que el usuario exista en la BD, incluso si el token es válido (por si el usuario fue eliminado)
2. **Secret seguro**: Nunca uses el secret por defecto en producción
3. **Expiración**: Los tokens expiran según la configuración en `AuthModule` (por defecto 1 hora)

## Extensión Futura

Puedes extender esta estrategia para:
- Validar roles o permisos adicionales
- Verificar si el usuario está activo
- Implementar refresh tokens
- Agregar logging de intentos de autenticación fallidos

