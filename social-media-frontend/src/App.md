# App.tsx - Documentación

## Descripción
Componente principal de la aplicación que configura el routing usando React Router. Define todas las rutas de la aplicación, incluyendo las páginas de autenticación.

## Dependencias

### Librerías
- **react-router-dom**: Para enrutamiento en la aplicación

### Componentes
- **LoginPage**: Página de inicio de sesión
- **RegisterPage**: Página de registro

## Estructura de Rutas

### Ruta Raíz (`/`)
- **Componente**: `Navigate` (redirección)
- **Comportamiento**: Redirige automáticamente a `/home`
- **Props**: `replace` evita que la ruta `/` quede en el historial
- **Nota**: Si el usuario no está autenticado, `ProtectedRoute` lo redirigirá a `/login`

### Ruta de Login (`/login`)
- **Componente**: `LoginPage`
- **Descripción**: Página para que los usuarios inicien sesión
- **Redirección**: Después del login exitoso, redirige a `/home` (o a la ruta que intentaba acceder)

### Ruta de Registro (`/register`)
- **Componente**: `RegisterPage`
- **Descripción**: Página para que los usuarios creen una nueva cuenta
- **Redirección**: Después del registro exitoso, redirige a `/home`

### Rutas Protegidas con MainLayout

Todas las rutas autenticadas están envueltas en `MainLayout` que proporciona:
- SideBar con navegación lateral
- NavBar con búsqueda y menú de usuario
- Área de contenido principal

#### Ruta de Home (`/home`)
- **Componente**: `HomePage` (protegida)
- **Descripción**: Página principal (feed) de la red social
- **Protección**: Requiere autenticación
- **Layout**: `MainLayout`

#### Ruta de Perfil (`/profile`)
- **Componente**: `ProfilePage` (protegida)
- **Descripción**: Página de perfil del usuario
- **Protección**: Requiere autenticación
- **Layout**: `MainLayout`

#### Ruta de Notificaciones (`/notifications`)
- **Componente**: `NotificationsPage` (protegida)
- **Descripción**: Página de notificaciones del usuario
- **Protección**: Requiere autenticación
- **Layout**: `MainLayout`

## Configuración del Router

### BrowserRouter
- Proporciona el contexto de routing a toda la aplicación
- Usa la API History del navegador para navegación
- Permite URLs limpias sin `#` (a diferencia de HashRouter)

### Routes y Route
- `Routes`: Contenedor para todas las rutas
- `Route`: Define una ruta individual con su path y componente

## Flujo de Navegación

```
Usuario visita la app
    ↓
Ruta "/" → Redirige a "/home"
    ↓
¿Usuario autenticado?
    ├─ No → ProtectedRoute redirige a "/login"
    └─ Sí → Muestra MainLayout con HomePage
    ↓
Usuario puede:
  - Iniciar sesión en "/login" → Redirige a "/home"
  - Ir a "/register" para crear cuenta → Redirige a "/home"
  - Navegar entre secciones usando SideBar:
    * /home (Feed)
    * /profile (Perfil)
    * /notifications (Notificaciones)
  - Acceder a rutas protegidas si está autenticado
```

## Estructura de Rutas con MainLayout

Las rutas protegidas están organizadas usando rutas anidadas:

```tsx
<Route
  path="/"
  element={
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  }
>
  <Route path="home" element={<HomePage />} />
  <Route path="profile" element={<ProfilePage />} />
  <Route path="notifications" element={<NotificationsPage />} />
</Route>
```

## Extensión Futura

Puedes agregar más rutas protegidas dentro de MainLayout:

```tsx
<Route
  path="/"
  element={
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  }
>
  <Route path="home" element={<HomePage />} />
  <Route path="profile" element={<ProfilePage />} />
  <Route path="notifications" element={<NotificationsPage />} />
  <Route path="posts/create" element={<CreatePostPage />} />
  <Route path="posts/:id" element={<PostDetailPage />} />
  <Route path="settings" element={<SettingsPage />} />
</Route>
```

## Rutas Protegidas

Las rutas protegidas están implementadas usando el componente `ProtectedRoute`:

```tsx
import { ProtectedRoute, MainLayout } from './shared/components';

<Route 
  path="/"
  element={
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  }
>
  <Route path="home" element={<HomePage />} />
</Route>
```

**Características de `ProtectedRoute`:**
- Verifica automáticamente si el usuario está autenticado
- Redirige a `/login` si no está autenticado
- Guarda la ruta original para redirigir después del login
- Muestra estado de carga mientras verifica

**Nota**: Actualmente `ProtectedRoute` confía en que el usuario está autenticado si llegó a la ruta. Cuando implementes el endpoint `/auth/me` en el backend, se actualizará para verificar realmente la autenticación.

## Notas Técnicas

- `Navigate` con `replace` evita agregar una entrada al historial
- Todas las rutas están definidas en un solo lugar, facilitando el mantenimiento
- El `BrowserRouter` debe estar dentro de `QueryProvider` (ya está en main.tsx)

## Mejores Prácticas

1. **Centralización**: Todas las rutas en un solo lugar
2. **Lazy Loading**: Para páginas grandes, considera usar `React.lazy()`:
   ```tsx
   const LoginPage = React.lazy(() => import('./modules/auth/LoginPage'));
   ```
3. **Error Boundaries**: Considera agregar un componente para manejar errores de routing
4. **404 Page**: Agrega una ruta `*` para páginas no encontradas:
   ```tsx
   <Route path="*" element={<NotFoundPage />} />
   ```

