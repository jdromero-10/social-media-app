# Orden de Lectura - Frontend

Esta guía enumera los archivos del frontend en orden lógico para comprender la implementación completa, especialmente la autenticación con cookies HTTP-only.

## 📋 Orden de Lectura Recomendado

### 1. Configuración Base

#### 1.1. `src/main.tsx`
- **Propósito**: Punto de entrada de la aplicación React
- **Contiene**: Configuración de React, providers globales (QueryProvider)
- **Lee primero**: Para entender cómo se inicializa la app

#### 1.2. `src/main.md`
- **Propósito**: Documentación de `main.tsx`
- **Lee después de**: `main.tsx`

---

### 2. Configuración de la Aplicación

#### 2.1. `src/App.tsx`
- **Propósito**: Componente raíz, configuración de rutas
- **Contiene**: Definición de rutas con React Router
- **Lee después de**: `main.tsx`

#### 2.2. `src/App.md`
- **Propósito**: Documentación de `App.tsx`
- **Lee después de**: `App.tsx`

---

### 3. Providers y Utilidades Base

#### 3.1. `src/shared/providers/QueryProvider.tsx`
- **Propósito**: Configuración de TanStack Query para manejo de estado del servidor
- **Contiene**: Provider que envuelve la app para queries y mutations
- **Lee después de**: `App.tsx`

#### 3.2. `src/shared/providers/QueryProvider.md`
- **Propósito**: Documentación de QueryProvider
- **Lee después de**: `QueryProvider.tsx`

#### 3.3. `src/lib/utils.ts`
- **Propósito**: Utilidades generales (cn, classNames, etc.)
- **Contiene**: Funciones helper reutilizables
- **Lee cuando**: Necesites entender utilidades usadas en componentes

#### 3.4. `src/lib/utils.md`
- **Propósito**: Documentación de utils
- **Lee después de**: `utils.ts`

---

### 4. Cliente API y Comunicación con Backend

#### 4.1. `src/api/apiClient.ts`
- **Propósito**: Cliente HTTP base para todas las peticiones
- **Contiene**: 
  - Configuración de fetch con `credentials: 'include'` para cookies
  - Manejo de errores
  - Métodos GET, POST, PUT, PATCH, DELETE
- **Lee primero de la capa API**: Es la base de todas las peticiones

#### 4.2. `src/api/apiClient.md`
- **Propósito**: Documentación completa del cliente API
- **Explica**: 
  - Cómo se envían cookies automáticamente
  - Manejo de errores
  - Flujo de autenticación con cookies HTTP-only
- **Lee después de**: `apiClient.ts`

#### 4.3. `src/api/auth-api.ts`
- **Propósito**: Servicio API específico para autenticación
- **Contiene**: 
  - `login()`: Inicia sesión (establece cookie HTTP-only)
  - `register()`: Registra nuevo usuario (establece cookie HTTP-only)
  - `logout()`: Cierra sesión (elimina cookie)
  - `getCurrentUser()`: Obtiene datos del usuario autenticado (usa `/auth/me`)
- **Lee después de**: `apiClient.ts`

#### 4.4. `src/api/auth-api.md`
- **Propósito**: Documentación de auth-api
- **Explica**: 
  - Cómo los métodos establecen cookies automáticamente
  - Flujo de datos con cookies
- **Lee después de**: `auth-api.ts`

---

### 5. Tipos y Definiciones

#### 5.1. `src/modules/auth/auth.types.ts`
- **Propósito**: Definiciones de tipos TypeScript para autenticación
- **Contiene**:
  - `LoginDto`: Datos para login
  - `RegisterDto`: Datos para registro
  - `User`: Estructura del usuario
  - `AuthResponse`: Respuesta de autenticación (con `access_token` opcional)
  - `AuthState`: Estado de autenticación
- **Lee después de**: `auth-api.ts` (para entender los tipos usados)

#### 5.2. `src/modules/auth/auth.types.md`
- **Propósito**: Documentación de tipos
- **Explica**: 
  - Por qué `access_token` es opcional (se maneja con cookies)
  - Relaciones entre tipos
- **Lee después de**: `auth.types.ts`

---

### 6. Hooks de Autenticación

#### 6.1. `src/modules/auth/hooks/useAuth.ts`
- **Propósito**: Hook principal para manejar autenticación
- **Contiene**:
  - `loginAsync()`: Función asíncrona para login (retorna Promise)
  - `registerAsync()`: Función asíncrona para registro (retorna Promise)
  - `logout()`: Función para cerrar sesión
  - Estados de carga y errores (`isLoggingIn`, `isRegistering`, `isLoggingOut`, etc.)
  - Ya NO guarda tokens manualmente (se manejan con cookies)
- **Lee después de**: `auth.types.ts` y `auth-api.ts`

#### 6.2. `src/modules/auth/hooks/useAuth.md`
- **Propósito**: Documentación completa del hook useAuth
- **Explica**:
  - Flujos de login, register y logout
  - Cómo funcionan las cookies automáticamente
  - Estados y métodos disponibles
- **Lee después de**: `useAuth.ts`

---

### 7. Componentes de Autenticación

#### 7.1. `src/modules/auth/LoginForm.tsx`
- **Propósito**: Formulario de inicio de sesión
- **Contiene**: 
  - Formulario que usa `loginAsync()` con `async/await`
  - Redirección inmediata después de login exitoso usando `navigate()`
  - Manejo de errores con `useToast`
- **Lee después de**: `useAuth.ts`

#### 7.2. `src/modules/auth/LoginForm.md`
- **Propósito**: Documentación del formulario de login
- **Lee después de**: `LoginForm.tsx`

#### 7.3. `src/modules/auth/LoginPage.tsx`
- **Propósito**: Página completa de login
- **Contiene**: Layout y estructura de la página de login
- **Lee después de**: `LoginForm.tsx`

#### 7.4. `src/modules/auth/LoginPage.md`
- **Propósito**: Documentación de la página de login
- **Lee después de**: `LoginPage.tsx`

#### 7.5. `src/modules/auth/RegisterForm.tsx`
- **Propósito**: Formulario de registro
- **Contiene**: 
  - Formulario que usa `registerAsync()` con `async/await`
  - Validación de confirmación de contraseña
  - Redirección inmediata después de registro exitoso usando `navigate()`
  - Manejo de errores con `useToast`
- **Lee después de**: `useAuth.ts`

#### 7.6. `src/modules/auth/RegisterForm.md`
- **Propósito**: Documentación del formulario de registro
- **Lee después de**: `RegisterForm.tsx`

#### 7.7. `src/modules/auth/RegisterPage.tsx`
- **Propósito**: Página completa de registro
- **Contiene**: Layout y estructura de la página de registro
- **Lee después de**: `RegisterForm.tsx`

#### 7.8. `src/modules/auth/RegisterPage.md`
- **Propósito**: Documentación de la página de registro
- **Lee después de**: `RegisterPage.tsx`

---

### 8. Componentes Compartidos

#### 8.1. `src/shared/components/Button.tsx`
- **Propósito**: Componente de botón reutilizable
- **Lee cuando**: Necesites entender componentes base

#### 8.2. `src/shared/components/Button.md`
- **Propósito**: Documentación del botón
- **Lee después de**: `Button.tsx`

#### 8.3. `src/shared/components/Input.tsx`
- **Propósito**: Componente de input reutilizable
- **Lee cuando**: Necesites entender componentes base

#### 8.4. `src/shared/components/Input.md`
- **Propósito**: Documentación del input
- **Lee después de**: `Input.tsx`

#### 8.5. `src/shared/components/Form.tsx`
- **Propósito**: Componente de formulario reutilizable
- **Lee cuando**: Necesites entender componentes base

#### 8.6. `src/shared/components/Form.md`
- **Propósito**: Documentación del formulario
- **Lee después de**: `Form.tsx`

#### 8.7. `src/shared/components/Card.tsx`
- **Propósito**: Componente de tarjeta/card
- **Lee cuando**: Necesites entender componentes base

#### 8.8. `src/shared/components/Card.md`
- **Propósito**: Documentación de la card
- **Lee después de**: `Card.tsx`

#### 8.9. `src/shared/components/Modal.tsx`
- **Propósito**: Componente de modal
- **Lee cuando**: Necesites entender componentes base

#### 8.10. `src/shared/components/Modal.md`
- **Propósito**: Documentación del modal
- **Lee después de**: `Modal.tsx`

#### 8.11. `src/shared/components/Toast.tsx`
- **Propósito**: Componente de notificación toast
- **Lee cuando**: Necesites entender notificaciones

#### 8.12. `src/shared/components/Toast.md`
- **Propósito**: Documentación del toast
- **Lee después de**: `Toast.tsx`

#### 8.13. `src/shared/components/ToastContainer.tsx`
- **Propósito**: Contenedor de toasts
- **Lee después de**: `Toast.tsx`

#### 8.14. `src/shared/components/ToastContainer.md`
- **Propósito**: Documentación del contenedor de toasts
- **Lee después de**: `ToastContainer.tsx`

#### 8.15. `src/shared/components/Bar.tsx`
- **Propósito**: Componente de barra/navbar
- **Lee cuando**: Necesites entender componentes base

#### 8.16. `src/shared/components/Bar.md`
- **Propósito**: Documentación de la barra
- **Lee después de**: `Bar.tsx`

#### 8.17. `src/shared/components/ProtectedRoute.tsx`
- **Propósito**: Componente para proteger rutas que requieren autenticación
- **Contiene**:
  - Verificación de autenticación usando `GET /auth/me`
  - Redirección automática a `/login` si no está autenticado
  - Guarda la ruta original para redirigir después del login
  - Estado de carga mientras verifica autenticación
- **Lee después de**: `useAuth.ts` y `auth-api.ts` (para entender `/auth/me`)

#### 8.18. `src/shared/components/ProtectedRoute.md`
- **Propósito**: Documentación completa de ProtectedRoute
- **Explica**:
  - Cómo verifica la autenticación con `/auth/me`
  - Flujo de redirección
  - Uso en rutas protegidas
- **Lee después de**: `ProtectedRoute.tsx`

---

### 9. Hooks Compartidos

#### 9.1. `src/shared/hooks/useToast.ts`
- **Propósito**: Hook para mostrar notificaciones toast
- **Lee cuando**: Necesites entender notificaciones

#### 9.2. `src/shared/hooks/useToast.md`
- **Propósito**: Documentación del hook useToast
- **Lee después de**: `useToast.ts`

---

### 10. Archivos de Exportación

#### 10.1. `src/modules/auth/index.ts`
- **Propósito**: Archivo barrel para exportar módulos de auth
- **Contiene**: Exports centralizados del módulo auth
- **Lee cuando**: Necesites ver qué se exporta del módulo

#### 10.2. `src/shared/components/index.ts`
- **Propósito**: Archivo barrel para exportar componentes
- **Contiene**: Exports centralizados de componentes (incluye `ProtectedRoute`)
- **Lee cuando**: Necesites ver qué componentes se exportan

#### 10.3. `src/modules/dashboard/index.ts`
- **Propósito**: Archivo barrel para exportar módulo dashboard
- **Contiene**: Export de `DashboardPage`
- **Lee cuando**: Necesites ver qué se exporta del módulo dashboard

---

### 11. Módulo Dashboard

#### 11.1. `src/modules/dashboard/DashboardPage.tsx`
- **Propósito**: Página principal después del login/registro
- **Contiene**:
  - Muestra datos del usuario autenticado
  - Obtiene datos del usuario usando `GET /auth/me`
  - Botón de logout
  - Protegida por `ProtectedRoute` en `App.tsx`
- **Lee después de**: `ProtectedRoute.tsx` y `useAuth.ts`

#### 11.2. `src/modules/dashboard/DashboardPage.md`
- **Propósito**: Documentación de DashboardPage
- **Explica**:
  - Cómo obtiene datos del usuario
  - Integración con logout
  - Uso de TanStack Query para datos del usuario
- **Lee después de**: `DashboardPage.tsx`

---

### 12. Archivos Legacy (Ya no se usan con cookies)

#### 12.1. `src/shared/utils/tokenStorage.ts`
- **Propósito**: ⚠️ **LEGACY** - Ya no se usa con cookies HTTP-only
- **Contiene**: Funciones para guardar tokens en localStorage
- **Nota**: Este archivo ya no se utiliza. Los tokens se manejan mediante cookies HTTP-only automáticamente.
- **Lee solo si**: Necesitas entender la implementación anterior

#### 12.2. `src/shared/utils/tokenStorage.md`
- **Propósito**: Documentación legacy
- **Nota**: Ya no aplica con la nueva implementación de cookies

---

## 🎯 Resumen del Flujo de Autenticación

Para entender específicamente la autenticación con cookies, lee en este orden:

1. **`api/apiClient.ts`** → Cliente base con `credentials: 'include'`
2. **`api/auth-api.ts`** → Métodos de autenticación (incluye `getCurrentUser()` para `/auth/me`)
3. **`modules/auth/auth.types.ts`** → Tipos (nota: `access_token` es opcional)
4. **`modules/auth/hooks/useAuth.ts`** → Hook que usa auth-api (proporciona `loginAsync()`, `registerAsync()`)
5. **`modules/auth/LoginForm.tsx`** → Ejemplo de uso con `async/await` y redirección inmediata
6. **`modules/auth/RegisterForm.tsx`** → Otro ejemplo de uso con `async/await`
7. **`shared/components/ProtectedRoute.tsx`** → Protección de rutas usando `/auth/me`
8. **`modules/dashboard/DashboardPage.tsx`** → Página protegida que muestra datos del usuario

## 📝 Notas Importantes

- **Cookies HTTP-only**: Los tokens ya NO se guardan en localStorage. Se manejan automáticamente mediante cookies establecidas por el backend.
- **`credentials: 'include'`**: Todas las peticiones incluyen cookies automáticamente.
- **`access_token` opcional**: En `AuthResponse`, el campo `access_token` es opcional porque ya no se devuelve en el body (se maneja con cookies).
- **`loginAsync()` y `registerAsync()`**: Funciones asíncronas que retornan Promise. Se usan con `await` en los formularios para redirección inmediata después del éxito.
- **Redirección inmediata**: Los formularios redirigen directamente en `onSubmit` después de `await`, no en `useEffect`.
- **`/auth/me` endpoint**: Endpoint protegido que verifica autenticación y retorna datos del usuario. Usado por `ProtectedRoute` y `DashboardPage`.
- **`ProtectedRoute`**: Componente que verifica autenticación usando `/auth/me` antes de renderizar contenido protegido.

## 🔄 Orden Alternativo (Por Funcionalidad)

Si prefieres leer por funcionalidad completa:

1. **Configuración**: `main.tsx` → `App.tsx` → `QueryProvider.tsx`
2. **API Layer**: `apiClient.ts` → `auth-api.ts`
3. **Tipos**: `auth.types.ts`
4. **Lógica**: `useAuth.ts`
5. **UI Autenticación**: `LoginForm.tsx` → `LoginPage.tsx` → `RegisterForm.tsx` → `RegisterPage.tsx`
6. **Protección de Rutas**: `ProtectedRoute.tsx` → `App.tsx` (ver cómo se usa)
7. **Dashboard**: `DashboardPage.tsx` (página protegida de ejemplo)
8. **Componentes Base**: Cualquier componente de `shared/components/` cuando lo necesites

## 🔐 Flujo Completo de Autenticación y Protección

```
Usuario intenta acceder a /dashboard
    ↓
App.tsx → ProtectedRoute verifica autenticación
    ↓
ProtectedRoute → GET /auth/me (con cookie HTTP-only)
    ↓
¿Usuario autenticado?
    ├─ No (401) → Redirige a /login
    └─ Sí (200) → Muestra DashboardPage
    ↓
Usuario completa LoginForm
    ↓
onSubmit → await loginAsync(data)
    ↓
Backend valida → Establece cookie HTTP-only
    ↓
await se resuelve → navigate('/dashboard')
    ↓
ProtectedRoute verifica nuevamente → Usuario autenticado
    ↓
DashboardPage → GET /auth/me → Muestra datos del usuario
```

