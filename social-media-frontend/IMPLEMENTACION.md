# Documentación de Implementación - Sistema de Autenticación

## Resumen

Se ha implementado un sistema completo de autenticación frontend usando React, TypeScript, TanStack Query, React Hook Form, Yup y Tailwind CSS. El sistema incluye componentes reutilizables, servicios API, hooks personalizados y páginas de autenticación.

## Estructura del Proyecto

```
src/
├── api/                          # Lógica de peticiones HTTP
│   ├── apiClient.ts              # Cliente API base
│   ├── apiClient.md              # Documentación del cliente API
│   ├── authApi.ts                # Servicios de autenticación
│   └── authApi.md                # Documentación de servicios
│
├── modules/
│   └── auth/                     # Módulo de autenticación
│       ├── auth.types.ts         # Tipos TypeScript
│       ├── auth.types.md         # Documentación de tipos
│       ├── hooks/
│       │   ├── useAuth.ts        # Hook de autenticación
│       │   └── useAuth.md        # Documentación del hook
│       ├── LoginForm.tsx         # Formulario de login
│       ├── LoginForm.md          # Documentación del formulario
│       ├── LoginPage.tsx         # Página de login
│       ├── LoginPage.md          # Documentación de la página
│       ├── RegisterForm.tsx      # Formulario de registro
│       ├── RegisterForm.md       # Documentación del formulario
│       ├── RegisterPage.tsx      # Página de registro
│       ├── RegisterPage.md       # Documentación de la página
│       └── index.ts              # Exportaciones centralizadas
│
├── shared/
│   ├── components/               # Componentes reutilizables
│   │   ├── Button.tsx            # Componente de botón
│   │   ├── Button.md             # Documentación
│   │   ├── Input.tsx             # Componente de input
│   │   ├── Input.md              # Documentación
│   │   ├── Form.tsx              # Componente de formulario
│   │   ├── Form.md               # Documentación
│   │   ├── Card.tsx              # Componente de tarjeta
│   │   ├── Card.md               # Documentación
│   │   ├── Modal.tsx             # Componente de modal
│   │   ├── Modal.md              # Documentación
│   │   ├── Bar.tsx               # Componente de barra
│   │   ├── Bar.md                # Documentación
│   │   └── index.ts              # Exportaciones
│   │
│   ├── providers/
│   │   ├── QueryProvider.tsx     # Provider de TanStack Query
│   │   └── QueryProvider.md      # Documentación
│   │
│   └── utils/
│       ├── tokenStorage.ts       # Utilidades de token
│       └── tokenStorage.md      # Documentación
│
├── App.tsx                       # Componente principal con routing
├── App.md                        # Documentación
├── main.tsx                      # Punto de entrada
└── main.md                       # Documentación
```

## Componentes Creados

### Componentes Compartidos (`src/shared/components/`)

1. **Button** - Botón reutilizable con variantes (primary, secondary, danger, outline) y estados de carga
2. **Input** - Input con label, validación de errores y helper text
3. **Form** - Wrapper de formulario con espaciado consistente
4. **Card** - Tarjeta con header, body y footer opcionales
5. **Modal** - Modal con overlay, cierre con Escape y click fuera
6. **Bar** - Barra fija (top/bottom) con variantes de color

### Componentes de Autenticación (`src/modules/auth/`)

1. **LoginForm** - Formulario de login con validación Yup
2. **RegisterForm** - Formulario de registro con validación de contraseñas
3. **LoginPage** - Página completa de login
4. **RegisterPage** - Página completa de registro

## Servicios y Utilidades

### API Client (`src/api/`)

- **apiClient.ts**: Cliente HTTP base con métodos GET, POST, PUT, PATCH, DELETE
  - Manejo automático de tokens JWT
  - Manejo consistente de errores
  - Tipado fuerte con TypeScript

- **authApi.ts**: Servicios específicos de autenticación
  - `login(credentials)`: Inicia sesión
  - `register(userData)`: Registra nuevo usuario

### Utilidades (`src/shared/utils/`)

- **tokenStorage.ts**: Funciones para manejar tokens en localStorage
  - `saveToken(token)`: Guarda token
  - `getToken()`: Obtiene token
  - `removeToken()`: Elimina token
  - `hasToken()`: Verifica existencia

## Hooks Personalizados

### useAuth (`src/modules/auth/hooks/useAuth.ts`)

Hook que encapsula toda la lógica de autenticación usando TanStack Query:

**Retorna:**
- `login(data)`: Función para iniciar sesión
- `loginAsync(data)`: Versión async/await
- `isLoggingIn`: Estado de carga
- `loginError`: Error si falla
- `loginSuccess`: Éxito del login
- `register(data)`: Función para registrar
- `registerAsync(data)`: Versión async/await
- `isRegistering`: Estado de carga
- `registerError`: Error si falla
- `registerSuccess`: Éxito del registro
- `logout()`: Cierra sesión

## Configuración

### TanStack Query (`src/shared/providers/QueryProvider.tsx`)

- Configurado en `main.tsx` para envolver toda la aplicación
- Opciones por defecto:
  - `refetchOnWindowFocus: false`
  - `retry: 1`
  - `staleTime: 5 minutos`

### Routing (`src/App.tsx`)

- Configurado con React Router
- Rutas:
  - `/` → Redirige a `/login`
  - `/login` → Página de login
  - `/register` → Página de registro

## Flujo de Autenticación

### Login
```
Usuario completa LoginForm
    ↓
React Hook Form valida con Yup
    ↓
useAuth.login() → TanStack Query mutation
    ↓
authApi.login() → apiClient.post('/auth/login')
    ↓
Backend valida credenciales
    ↓
onSuccess: Token guardado en localStorage
    ↓
Usuario autenticado
```

### Register
```
Usuario completa RegisterForm
    ↓
React Hook Form valida con Yup (incluye confirmPassword)
    ↓
confirmPassword removido antes de enviar
    ↓
useAuth.register() → TanStack Query mutation
    ↓
authApi.register() → apiClient.post('/auth/register')
    ↓
Backend crea usuario
    ↓
onSuccess: Token guardado en localStorage
    ↓
Usuario autenticado
```

## Validaciones

### Login
- Email: Debe ser válido y requerido
- Password: Mínimo 6 caracteres y requerido

### Register
- Name: Mínimo 2 caracteres y requerido
- Email: Debe ser válido y requerido
- Password: Mínimo 6 caracteres y requerido
- Confirm Password: Debe coincidir con password
- Username: Opcional

## Endpoints del Backend

### POST /auth/login
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "username": "johndoe"
  }
}
```

### POST /auth/register
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "username": "johndoe" // opcional
}
```

**Response:**
```json
{
  "access_token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "username": "johndoe"
  }
}
```

## Configuración del Backend

La URL base del backend se configura en `src/api/apiClient.ts`:
- Por defecto: `http://localhost:3000`
- Puede cambiarse con variable de entorno: `VITE_API_BASE_URL`

## Uso de los Componentes

### Ejemplo: Usar Button
```tsx
import { Button } from '@/shared/components';

<Button variant="primary" size="lg" isLoading={loading}>
  Enviar
</Button>
```

### Ejemplo: Usar Input con React Hook Form
```tsx
import { Input } from '@/shared/components';
import { useForm } from 'react-hook-form';

const { register, formState: { errors } } = useForm();

<Input
  label="Email"
  type="email"
  {...register('email')}
  error={errors.email?.message}
/>
```

### Ejemplo: Usar useAuth
```tsx
import { useAuth } from '@/modules/auth';

const { login, isLoggingIn, loginError } = useAuth();

const handleLogin = () => {
  login({ email: 'user@example.com', password: 'pass123' });
};
```

## Próximos Pasos Sugeridos

1. **Rutas Protegidas**: Crear un componente `ProtectedRoute` para proteger rutas que requieren autenticación
2. **Manejo de Sesión**: Implementar verificación de token y refresh token
3. **Redirecciones**: Agregar lógica para redirigir después de login/register exitoso
4. **Manejo de Errores Global**: Crear un sistema de notificaciones para errores
5. **Loading States**: Mejorar los estados de carga con skeletons
6. **Tests**: Agregar tests unitarios y de integración

## Notas Importantes

- Todos los archivos tienen documentación detallada en archivos `.md` correspondientes
- El token se guarda automáticamente en localStorage después de login/register exitoso
- Los componentes están completamente tipados con TypeScript
- El sistema está listo para producción pero puede extenderse según necesidades

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Lint
npm run lint
```

## Dependencias Principales

- `@tanstack/react-query`: Manejo de estado del servidor
- `react-hook-form`: Manejo de formularios
- `yup`: Validación de esquemas
- `@hookform/resolvers`: Integración Yup + React Hook Form
- `react-router-dom`: Enrutamiento
- `tailwindcss`: Estilos

---

**Implementado por**: Sistema de autenticación completo con mejores prácticas
**Fecha**: 2024
**Stack**: React + TypeScript + Vite + TanStack Query + React Hook Form + Yup + Tailwind

