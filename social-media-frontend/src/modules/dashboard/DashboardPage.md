# DashboardPage.tsx - Documentación

## Descripción
Página principal del dashboard que se muestra después de que el usuario inicia sesión exitosamente. Proporciona una vista general de la aplicación y acceso a las diferentes funcionalidades.

## Ubicación
`src/modules/dashboard/DashboardPage.tsx`

## Dependencias

### Librerías
- **react-router-dom**: `useNavigate` para navegación
- **@tanstack/react-query**: `useQuery` para obtener datos del usuario

### Componentes
- **Card**: Componente de tarjeta para mostrar contenido
- **Button**: Botón para cerrar sesión
- **useAuth**: Hook para manejar autenticación

## Funcionalidad

### Estado y Datos

1. **Datos del Usuario**:
   - Usa `useQuery` para obtener datos del usuario actual
   - Query key: `['currentUser']`
   - Por ahora retorna `null` (pendiente crear endpoint `/auth/me` en backend)

2. **Logout**:
   - Usa el hook `useAuth` para cerrar sesión
   - Redirige a `/login` después del logout exitoso

### Estructura de la Página

```
DashboardPage
├── Header
│   ├── Título "Dashboard"
│   └── Botón "Cerrar Sesión"
├── Contenido Principal (Grid)
│   ├── Card de Bienvenida (full width)
│   │   └── Información del usuario
│   ├── Card de Posts (placeholder)
│   ├── Card de Notificaciones (placeholder)
│   └── Card de Perfil (placeholder)
```

### Estados de Carga

- **Loading**: Muestra "Cargando..." mientras se obtienen los datos
- **Error**: Maneja errores de la query (por ahora no muestra nada específico)
- **Success**: Muestra el contenido del dashboard

## Uso

```tsx
import { DashboardPage } from './modules/dashboard/DashboardPage';

// En App.tsx o router
<Route path="/dashboard" element={<DashboardPage />} />
```

## Rutas Relacionadas

- **Ruta protegida**: `/dashboard` (requiere autenticación)
- **Redirección después de login**: Desde `/login` → `/dashboard`
- **Redirección después de logout**: Desde `/dashboard` → `/login`

## Funcionalidades Futuras

### Implementado

1. **Endpoint `/auth/me`**:
   - ✅ Creado en el backend
   - ✅ La query usa: `apiClient.get<User>('/auth/me')`
   - ✅ Obtiene datos reales del usuario autenticado

2. **Módulos de Contenido**:
   - Posts: Mostrar publicaciones del usuario
   - Notificaciones: Mostrar notificaciones
   - Perfil: Gestión de perfil de usuario

3. **Navegación**:
   - Agregar barra de navegación lateral o superior
   - Agregar enlaces a diferentes secciones

4. **Estadísticas**:
   - Mostrar métricas del usuario
   - Actividad reciente

## Estilos

### Contenedor Principal
- `bg-gradient-to-br from-gray-50 via-[#eafffd]/30 to-[#cbfffb]/30`: Fondo con gradiente cyan sutil (mejorado)
- Layout responsive con grid mejorado

### Header
- `text-4xl font-bold`: Título más grande y prominente (mejorado de `text-3xl`)
- Layout responsive: `flex-col sm:flex-row` para mejor adaptación móvil
- Botón de logout con `whitespace-nowrap` para evitar saltos de línea

### Card de Bienvenida
- `bg-gradient-to-r from-[#00b1c0] via-[#038c9b] to-[#0d6f7d]`: Gradiente cyan con texto blanco (NUEVO)
- `text-white`: Texto blanco para contraste
- Icono circular con fondo semitransparente (`bg-white/20`)
- Muestra información del usuario (email y nombre si está disponible)

### Cards de Funcionalidades
- Iconos con fondos de colores: `bg-[#eafffd]` (cyan-50), `bg-[#cbfffb]` (cyan-100), `bg-purple-100`
- `hover:shadow-xl transition-shadow duration-200`: Efectos hover mejorados
- Iconos SVG inline para mejor rendimiento
- Descripciones más detalladas

## Mejoras Implementadas (2024)

- ✅ **Diseño moderno con gradiente**: Fondo con gradiente sutil para mejor estética
- ✅ **Header mejorado**: Título más grande (`text-4xl`) y layout responsive mejorado
- ✅ **Card de bienvenida destacada**: Gradiente cyan con texto blanco y icono visual
- ✅ **Cards con iconos**: Agregados iconos SVG con fondos de colores para cada sección
- ✅ **Efectos hover**: Transiciones suaves en las cards para mejor interacción
- ✅ **Mejor información del usuario**: Muestra email y nombre si están disponibles
- ✅ **Layout responsive mejorado**: Mejor adaptación en móviles con flex-col

## Notas Técnicas

- El componente usa `useQuery` de TanStack Query para manejar el estado del servidor
- La query tiene `retry: false` para no reintentar automáticamente en caso de error
- El logout es asíncrono y espera a que se complete antes de redirigir
- Los iconos SVG son inline para evitar dependencias externas y mejorar rendimiento
- El gradiente de fondo es sutil (`/30` opacity) para no interferir con la legibilidad
- Las cards usan `transition-shadow` para animaciones suaves al hacer hover

## Extensión

Para agregar más funcionalidades:

1. Crea componentes específicos para cada sección (Posts, Notificaciones, etc.)
2. Importa y usa en las Cards correspondientes
3. Actualiza la query para obtener datos reales del backend

