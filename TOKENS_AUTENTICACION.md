# 🔐 Sistema de Autenticación con Tokens JWT y Cookies HTTP-Only

Este documento explica cómo funciona el sistema de autenticación con tokens JWT implementado en este proyecto, tanto en el backend (NestJS) como en el frontend (React).

---

## 📚 Índice

1. [¿Qué son los Tokens JWT?](#qué-son-los-tokens-jwt)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Flujo Completo de Autenticación](#flujo-completo-de-autenticación)
4. [Implementación en el Backend](#implementación-en-el-backend)
5. [Implementación en el Frontend](#implementación-en-el-frontend)
6. [Seguridad: Cookies HTTP-Only vs LocalStorage](#seguridad-cookies-http-only-vs-localstorage)
7. [Configuración y Variables de Entorno](#configuración-y-variables-de-entorno)

---

## ¿Qué son los Tokens JWT?

### JWT (JSON Web Token)

Un JWT es un estándar abierto (RFC 7519) que define una forma compacta y autónoma de transmitir información de forma segura entre partes como un objeto JSON. Esta información puede ser verificada y confiada porque está firmada digitalmente.

### Estructura de un JWT

Un JWT tiene tres partes separadas por puntos (`.`):

```
header.payload.signature
```

**Ejemplo:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

1. **Header**: Contiene el tipo de token (JWT) y el algoritmo de firma (ej: HS256)
2. **Payload**: Contiene los "claims" (datos), como el ID del usuario, email, fecha de expiración
3. **Signature**: Firma que verifica que el token no ha sido alterado

### Payload en este Proyecto

En este proyecto, el payload del JWT contiene:

```typescript
{
  sub: string,    // ID del usuario (subject)
  email: string,  // Email del usuario
  iat: number,    // Fecha de emisión (automático)
  exp: number     // Fecha de expiración (automático, 1 hora)
}
```

---

## 🏗️ Arquitectura del Sistema

### Componentes Principales

```
┌─────────────────┐
│   Frontend      │
│   (React)       │
└────────┬────────┘
         │
         │ HTTP Requests
         │ (con cookies)
         │
         ▼
┌─────────────────┐
│   Backend        │
│   (NestJS)      │
│                 │
│  ┌───────────┐  │
│  │ AuthModule│  │
│  └─────┬─────┘  │
│        │        │
│  ┌─────▼─────┐  │
│  │JwtService │  │ Genera tokens
│  └──────────┘  │
│                 │
│  ┌───────────┐  │
│  │JwtStrategy│  │ Valida tokens
│  └───────────┘  │
└─────────────────┘
```

### Flujo de Datos

1. **Usuario hace login/register** → Frontend envía credenciales
2. **Backend valida** → Genera token JWT
3. **Backend establece cookie** → Cookie HTTP-only con el token
4. **Frontend recibe respuesta** → Solo datos del usuario (sin token)
5. **Peticiones futuras** → Navegador envía cookie automáticamente
6. **Backend valida token** → Extrae de cookie y verifica

---

## 🔄 Flujo Completo de Autenticación

### 1. Registro de Usuario

```
Usuario → Frontend (RegisterForm)
    ↓
Envía: { email, password, name }
    ↓
POST /auth/register
    ↓
Backend (AuthController.register)
    ↓
AuthService.register()
    ├─ Verifica si email existe
    ├─ Hashea la contraseña (bcrypt)
    ├─ Crea usuario en BD
    └─ Genera token JWT
    ↓
AuthController establece cookie HTTP-only
    ↓
Respuesta: { user: {...} } (sin token en body)
    ↓
Navegador guarda cookie automáticamente
    ↓
Usuario autenticado ✅
```

### 2. Login de Usuario

```
Usuario → Frontend (LoginForm)
    ↓
Envía: { email, password }
    ↓
POST /auth/login
    ↓
Backend (AuthController.login)
    ↓
AuthService.login()
    ├─ Busca usuario por email
    ├─ Compara contraseña (bcrypt)
    └─ Genera token JWT
    ↓
AuthController establece cookie HTTP-only
    ↓
Respuesta: { user: {...} } (sin token en body)
    ↓
Navegador guarda cookie automáticamente
    ↓
Usuario autenticado ✅
```

### 3. Petición Autenticada

```
Frontend hace petición (ej: GET /users/me)
    ↓
apiClient incluye credentials: 'include'
    ↓
Navegador envía cookie automáticamente
    ↓
Backend recibe petición
    ↓
JwtStrategy extrae token de cookie
    ├─ Lee request.cookies.access_token
    └─ Si no existe, fallback a header Authorization
    ↓
JwtStrategy valida token
    ├─ Verifica firma
    ├─ Verifica expiración
    └─ Extrae payload
    ↓
JwtStrategy.validate()
    ├─ Busca usuario en BD por ID (payload.sub)
    └─ Retorna usuario completo
    ↓
Usuario adjuntado a request.user
    ↓
Controlador puede usar @Request() req → req.user
    ↓
Respuesta exitosa ✅
```

### 4. Logout

```
Usuario → Frontend (botón logout)
    ↓
POST /auth/logout
    ↓
Backend (AuthController.logout)
    ↓
Limpia cookie access_token
    ↓
Respuesta: { message: "Logout exitoso" }
    ↓
Cookie eliminada del navegador
    ↓
Usuario desautenticado ✅
```

---

## ⚙️ Implementación en el Backend

### 1. Generación del Token (AuthService)

**Archivo:** `src/auth/auth.service.ts`

```typescript
private async buildAuthResponse(userId: string, email: string) {
  // Crear payload del JWT
  const payload = { sub: userId, email };
  
  // Generar token JWT usando JwtService
  const accessToken = this.jwtService.sign(payload);
  
  // Retornar token y datos del usuario
  return {
    access_token: accessToken,
    user: { ... }
  };
}
```

**Configuración del JWT:**
- **Secret**: `process.env.JWT_SECRET` (variable de entorno)
- **Expiración**: 1 hora (`expiresIn: '1h'`)
- **Algoritmo**: HS256 (por defecto)

### 2. Establecimiento de Cookie (AuthController)

**Archivo:** `src/auth/auth.controller.ts`

```typescript
@Post('login')
async login(@Body() loginDto: LoginDto, @Res() res: Response) {
  const result = await this.authService.login(loginDto);
  
  // Establecer cookie HTTP-only
  res.cookie('access_token', result.access_token, {
    httpOnly: true,                    // No accesible desde JavaScript
    secure: process.env.NODE_ENV === 'production',  // Solo HTTPS en producción
    sameSite: 'lax',                  // Protección CSRF
    maxAge: 3600000,                  // 1 hora
  });
  
  // Retornar solo datos del usuario (sin token)
  return res.json({ user: result.user });
}
```

**Opciones de la Cookie:**
- `httpOnly: true` → Previene acceso desde JavaScript (XSS)
- `secure: true` (producción) → Solo se envía por HTTPS
- `sameSite: 'lax'` → Protección contra CSRF
- `maxAge: 3600000` → Expira en 1 hora (igual que el token)

### 3. Validación del Token (JwtStrategy)

**Archivo:** `src/auth/strategies/jwt.strategy.ts`

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      // Extraer token de cookies (prioridad) o header (fallback)
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          if (request?.cookies?.access_token) {
            return request.cookies.access_token;
          }
          return ExtractJwt.fromAuthHeaderAsBearerToken()(request);
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'changeThisSecret',
    });
  }

  // Validar y obtener usuario
  async validate(payload: JwtPayload) {
    const user = await this.usersService.getById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    return user; // Se adjunta a request.user
  }
}
```

**Proceso de Validación:**
1. Extrae token de cookie o header
2. Verifica firma con `JWT_SECRET`
3. Verifica que no haya expirado
4. Extrae payload (sub, email)
5. Busca usuario en BD por ID
6. Retorna usuario completo

### 4. Uso en Endpoints Protegidos

**Ejemplo de endpoint protegido:**

```typescript
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Request() req) {
  // req.user contiene el usuario validado
  return req.user;
}
```

El `JwtAuthGuard` usa automáticamente `JwtStrategy` para validar el token.

---

## 🎨 Implementación en el Frontend

### 1. Cliente API Base (apiClient)

**Archivo:** `src/api/apiClient.ts`

```typescript
class ApiClient {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // ← Envía cookies automáticamente
    });
    return await this.handleResponse<T>(response);
  }
  
  // Similar para POST, PUT, PATCH, DELETE
}
```

**Punto clave:** `credentials: 'include'` hace que el navegador envíe cookies automáticamente en cada petición.

### 2. Servicio de Autenticación (auth-api)

**Archivo:** `src/api/auth-api.ts`

```typescript
export const authApi = {
  login: async (credentials: LoginDto): Promise<AuthResponse> => {
    // El token se guarda automáticamente en cookie por el backend
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },
  
  register: async (userData: RegisterDto): Promise<AuthResponse> => {
    // El token se guarda automáticamente en cookie por el backend
    return apiClient.post<AuthResponse>('/auth/register', userData);
  },
  
  logout: async (): Promise<{ message: string }> => {
    // El backend limpia la cookie
    return apiClient.post<{ message: string }>('/auth/logout');
  },
};
```

**Nota importante:** El frontend **NO** maneja el token manualmente. Se guarda automáticamente en una cookie HTTP-only.

### 3. Hook de Autenticación (useAuth)

**Archivo:** `src/modules/auth/hooks/useAuth.ts`

```typescript
export const useAuth = () => {
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginDto) => {
      return await authApi.login(credentials);
    },
    onSuccess: (data: AuthResponse) => {
      // Ya NO guardamos el token manualmente
      // Se maneja automáticamente mediante cookies
      console.log('Login exitoso, token guardado en cookie');
    },
  });
  
  // Similar para register y logout
  
  return {
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    // ... más estados
  };
};
```

**Cambio importante:** Ya no se usa `saveToken()` ni `localStorage`. El token se maneja completamente mediante cookies.

### 4. Tipos (auth.types)

**Archivo:** `src/modules/auth/auth.types.ts`

```typescript
export interface AuthResponse {
  access_token?: string;  // Opcional, ya no se devuelve en el body
  user: User;
}
```

El campo `access_token` es opcional porque ya no se devuelve en el body de la respuesta (se maneja con cookies).

---

## 🔒 Seguridad: Cookies HTTP-Only vs LocalStorage

### Implementación Anterior (LocalStorage) ❌

```typescript
// Frontend guardaba token manualmente
onSuccess: (data) => {
  localStorage.setItem('token', data.access_token);
}

// Frontend enviaba token manualmente
headers: {
  'Authorization': `Bearer ${localStorage.getItem('token')}`
}
```

**Problemas de seguridad:**
- ❌ Accesible desde JavaScript → Vulnerable a XSS
- ❌ Se puede leer con `document.cookie` o `localStorage.getItem()`
- ❌ Scripts maliciosos pueden robar el token
- ❌ No se envía automáticamente (debe manejarse manualmente)

### Implementación Actual (Cookies HTTP-Only) ✅

```typescript
// Backend establece cookie automáticamente
res.cookie('access_token', token, {
  httpOnly: true,  // No accesible desde JavaScript
  secure: true,     // Solo HTTPS
  sameSite: 'lax'   // Protección CSRF
});

// Frontend NO maneja el token
// Se envía automáticamente con credentials: 'include'
```

**Ventajas de seguridad:**
- ✅ **HTTP-only**: No accesible desde JavaScript → Protección contra XSS
- ✅ **Secure**: Solo se envía por HTTPS en producción
- ✅ **SameSite**: Protección contra ataques CSRF
- ✅ **Automático**: El navegador maneja el envío
- ✅ **No expuesto**: El token nunca aparece en el código del frontend

### Comparación Visual

| Aspecto | LocalStorage | Cookies HTTP-Only |
|--------|-------------|-------------------|
| Accesible desde JS | ✅ Sí | ❌ No |
| Vulnerable a XSS | ✅ Sí | ❌ No |
| Envío automático | ❌ No | ✅ Sí |
| Protección CSRF | ❌ No | ✅ Sí (sameSite) |
| Solo HTTPS | ❌ No | ✅ Sí (secure) |

---

## 🔧 Configuración y Variables de Entorno

### Backend

**Archivo:** `.env` (backend)

```env
# JWT Secret (OBLIGATORIO en producción)
JWT_SECRET=tu-secret-super-seguro-y-largo

# Puerto del servidor
PORT=3000

# URL del frontend (para CORS)
FRONTEND_URL=http://localhost:5173

# Entorno
NODE_ENV=development  # o 'production'
```

**Importante:**
- `JWT_SECRET` debe ser una cadena larga y aleatoria
- En producción, usa un secret diferente y más seguro
- Nunca commitees el `.env` al repositorio

### Frontend

**Archivo:** `.env` (frontend)

```env
# URL del backend
VITE_API_BASE_URL=http://localhost:3000
```

### Configuración de CORS

**Archivo:** `src/main.ts` (backend)

```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,  // ← IMPORTANTE: Permite cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

**Punto crítico:** `credentials: true` es **obligatorio** para que las cookies funcionen entre dominios.

---

## 📊 Resumen del Flujo Completo

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │
       │ 1. Login/Register
       ▼
┌─────────────────┐
│   Frontend      │
│  - useAuth()    │
│  - authApi      │
└──────┬──────────┘
       │
       │ 2. POST /auth/login
       │    { email, password }
       ▼
┌─────────────────┐
│   Backend       │
│  - AuthController│
│  - AuthService  │
│  - JwtService   │
└──────┬──────────┘
       │
       │ 3. Valida credenciales
       │ 4. Genera JWT
       │ 5. Establece cookie
       │
       │ 6. Respuesta: { user }
       ▼
┌─────────────────┐
│   Navegador     │
│  Guarda cookie  │
│  automáticamente│
└─────────────────┘
       │
       │ 7. Peticiones futuras
       │    (con cookie)
       ▼
┌─────────────────┐
│   Backend       │
│  - JwtStrategy  │
│  - Valida token │
│  - Adjunta user │
└─────────────────┘
```

---

## 🎯 Puntos Clave a Recordar

1. **El token JWT se genera en el backend** usando `JwtService.sign()`
2. **El token se guarda en una cookie HTTP-only** establecida por el backend
3. **El frontend NO maneja el token manualmente** - se envía automáticamente
4. **Las cookies se envían automáticamente** gracias a `credentials: 'include'`
5. **El backend valida el token** en cada petición usando `JwtStrategy`
6. **El usuario validado** se adjunta a `request.user` en el backend
7. **Las cookies HTTP-only** previenen ataques XSS
8. **SameSite: 'lax'** protege contra CSRF
9. **Secure: true** (producción) asegura que solo se envíen por HTTPS

---

## 🔍 Debugging

### Verificar que la cookie se establece

**En el navegador (DevTools):**
1. Abre DevTools → Application/Storage
2. Ve a Cookies → `http://localhost:3000`
3. Deberías ver `access_token` con valor del token

### Verificar que la cookie se envía

**En el navegador (DevTools):**
1. Abre DevTools → Network
2. Haz una petición autenticada
3. Ve a Headers → Request Headers
4. Deberías ver `Cookie: access_token=...`

### Problemas Comunes

**Cookie no se establece:**
- Verifica que CORS tenga `credentials: true`
- Verifica que el frontend use `credentials: 'include'`
- Verifica que el dominio del frontend esté en `origin` de CORS

**Token inválido:**
- Verifica que `JWT_SECRET` sea el mismo en backend
- Verifica que el token no haya expirado (1 hora)
- Verifica que el usuario exista en la BD

---

## 📚 Referencias

- [JWT.io](https://jwt.io/) - Decodificar y entender JWT
- [MDN: HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [Passport JWT Strategy](http://www.passportjs.org/packages/passport-jwt/)

---

**Última actualización:** Implementación con cookies HTTP-only
**Versión:** 2.0 (Migrado de localStorage a cookies)

