# ProtectedRoute.tsx - Documentación

## Descripción
Componente de ruta protegida que verifica si el usuario está autenticado antes de permitir el acceso a una ruta. Si el usuario no está autenticado, redirige automáticamente a la página de login.

## Ubicación
`src/shared/components/ProtectedRoute.tsx`

## Dependencias

### Librerías
- **react-router-dom**: `Navigate`, `useLocation` para navegación y redirección
- **@tanstack/react-query**: `useQuery` para verificar autenticación

### APIs
- **apiClient**: Cliente HTTP para verificar autenticación

## Funcionalidad

### Verificación de Autenticación

El componente verifica la autenticación de dos formas:

1. **Query a la API**:
   - Intenta obtener datos del usuario actual
   - Si la petición falla con 401, el usuario no está autenticado
   - Usa `useQuery` con `retry: false` para no reintentar automáticamente

2. **Estado de la Query**:
   - `isLoading`: Muestra "Verificando autenticación..."
   - `isError` o `!user`: Redirige a `/login`
   - `user` existe: Muestra el contenido protegido

### Redirección

Cuando el usuario no está autenticado:
- Redirige a `/login`
- Guarda la ubicación actual en `state.from` para poder redirigir de vuelta después del login
- Usa `replace` para no agregar la ruta protegida al historial

## Props

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode; // Contenido a proteger
}
```

## Uso

### En App.tsx

```tsx
import { ProtectedRoute } from './shared/components/ProtectedRoute';
import { DashboardPage } from './modules/dashboard/DashboardPage';

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

### Múltiples Rutas Protegidas

```tsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  }
/>
```

## Flujo de Autenticación

```
Usuario intenta acceder a ruta protegida
    ↓
ProtectedRoute verifica autenticación
    ↓
¿Usuario autenticado?
    ├─ No → Redirige a /login (guarda ubicación)
    └─ Sí → Muestra contenido protegido
```

## Redirección Después del Login

Para redirigir al usuario de vuelta a la ruta que intentaba acceder:

```tsx
// En LoginForm o LoginPage
const location = useLocation();
const from = location.state?.from?.pathname || '/dashboard';

// Después de login exitoso
navigate(from, { replace: true });
```

## Configuración de la Query

- **Query Key**: `['auth-check']`
- **Retry**: `false` (no reintentar automáticamente)
- **Stale Time**: `0` (no usar caché, siempre verificar)
- **GC Time**: `0` (no mantener en caché)

**Nota**: Se configuró `staleTime: 0` y `gcTime: 0` para asegurar que la verificación de autenticación siempre use datos actualizados, especialmente después de un login exitoso. Esto evita problemas donde el componente usa datos en caché que no reflejan el estado de autenticación actualizado.

## Estados

### Loading
Muestra un mensaje "Verificando autenticación..." mientras se verifica.

### No Autenticado
Redirige automáticamente a `/login` con la ubicación guardada.

### Autenticado
Muestra el contenido protegido (children).

## Implementación Actual

### Endpoint `/auth/me`

El componente usa el endpoint `/auth/me` del backend:

```typescript
queryFn: async () => {
  return apiClient.get<User>('/auth/me');
}
```

Este endpoint:
- ✅ Verifica la cookie HTTP-only automáticamente
- ✅ Retorna los datos del usuario si está autenticado
- ✅ Retorna 401 si no está autenticado (token inválido o expirado)

## Notas Técnicas

1. **Cookies HTTP-only**: La verificación se basa en que las cookies se envían automáticamente con `credentials: 'include'`

2. **Sin Caché**: El resultado no se cachea (`staleTime: 0`, `gcTime: 0`) para asegurar que siempre se verifique la autenticación con datos actualizados. Esto es especialmente importante después de un login exitoso, donde las queries se invalidan y se necesita una verificación fresca.

3. **Error Handling**: Si hay un error 401, se trata como "no autenticado" y redirige

4. **Location State**: Guarda la ubicación original para redirigir después del login

5. **Invalidación de Queries**: Después de un login exitoso, el hook `useAuth` invalida la query `['auth-check']`, forzando una nueva verificación cuando el usuario navega a una ruta protegida. Esto, combinado con `staleTime: 0`, asegura que la verificación siempre use datos actualizados.

## Ventajas

- ✅ Protección automática de rutas
- ✅ Redirección inteligente después del login
- ✅ Manejo de estados de carga
- ✅ Reutilizable para cualquier ruta protegida
- ✅ Integración con React Router
- ✅ Verificación siempre actualizada (sin caché)
- ✅ Sincronización con invalidación de queries después del login

## Mejoras Implementadas (2024)

- ✅ **Sin caché**: Cambiado `staleTime` de 5 minutos a `0` para siempre verificar autenticación
- ✅ **Sin garbage collection**: Cambiado `gcTime` a `0` para no mantener datos en caché
- ✅ **Sincronización mejorada**: Funciona correctamente con la invalidación de queries en `useAuth` después del login
- ✅ **Redirección en primer intento**: La combinación de invalidación de queries y sin caché asegura que la redirección funcione correctamente en el primer intento de login

## Ejemplo Completo

```tsx
// App.tsx
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    }
  />
  
  <Route
    path="/profile"
    element={
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    }
  />
</Routes>
```

