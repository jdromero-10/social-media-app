# ProfilePage.tsx - Documentación

## Descripción
Página de perfil del usuario que muestra información personal, avatar y datos de la cuenta. Permite al usuario ver y gestionar su información. Utiliza componentes globales reutilizables para mantener consistencia visual en toda la aplicación.

## Ruta
- **Path**: `/profile`
- **Protección**: Requiere autenticación (envuelta en `ProtectedRoute` y `MainLayout`)

## Estructura

### Header
- Título: "Mi Perfil" (`text-3xl font-bold`)
- Descripción: "Gestiona tu información personal"

### Sección de Perfil (Profile Header Card)
- **Avatar grande** (`size="lg"`, 32x32) con:
  - Soporte para mostrar imagen de perfil desde `user.imageUrl`
  - Fallback a iniciales si no hay imagen
  - Efecto hover con escala suave
  - Efecto hover (`hover:scale-105`)
  - Badge de usuario en la esquina inferior derecha
  - Icono de usuario dentro del badge
- **Información del usuario**:
  - Username (título grande)
  - Email con icono `Mail`
  - Username con icono `AtSign`
  - Fecha de registro con icono `Calendar` (si está disponible)

### Sección de Información Personal
- **Card con título** "Información Personal"
- **Inputs deshabilitados** (solo lectura) usando el componente `Input` global:
  - Email
  - Nombre completo (si existe `user.name`)
  - Username (si existe `user.username`)
- Los inputs usan `bg-gray-50` para indicar que son de solo lectura

### Sección de Acciones
- **Card con botones de acción**:
  - Botón "Editar Perfil" (variante `outline`) - Navega a `/profile/edit`
  - Botón "Cambiar Contraseña" (variante `outline`) - Funcionalidad pendiente
- Botones con iconos de Lucide React
- Layout responsive: columna en móvil, fila en desktop
- El botón "Editar Perfil" usa `useNavigate` para navegar a la página de edición

## Integración con API

### Obtener Usuario Actual
```tsx
const { data: user, isLoading } = useQuery<User>({
  queryKey: ['currentUser'],
  queryFn: async () => {
    return apiClient.get<User>('/auth/me');
  },
  retry: false,
});
```

## Componentes Utilizados

- **Card**: Componente reutilizable para contenedores con título opcional
- **Avatar**: Componente para mostrar la imagen del usuario con efectos hover
- **Input**: Componente reutilizable para mostrar información (en modo deshabilitado)
- **Button**: Componente reutilizable para acciones (variante `outline`)
- **Iconos de Lucide React**: `Mail`, `User`, `AtSign`, `Calendar` para mejor UX visual

## Estados

### Carga
- Muestra spinner animado y mensaje "Cargando perfil..." mientras se obtienen los datos
- Spinner con estilo consistente (borde cyan animado - `border-[#00b1c0]`)

### Datos Cargados
- Muestra información del usuario organizada en cards
- Avatar con iniciales si no hay imagen
- Badge de usuario en el avatar
- Información con iconos para mejor identificación visual
- Inputs deshabilitados para mostrar información de solo lectura

## Responsividad

- **Layout flexible** que se adapta a móvil y desktop
- **Avatar**: Centrado en móvil, alineado a la izquierda en desktop
- **Texto**: Centrado en móvil, alineado a la izquierda en desktop
- **Información con iconos**: Se adapta al layout (centrado en móvil, alineado en desktop)
- **Botones de acción**: Columna en móvil (`flex-col`), fila en desktop (`sm:flex-row`)

## Uso

```tsx
// En App.tsx
<Route path="profile" element={<ProfilePage />} />
```

## Características Visuales

### Avatar con Badge
- Avatar grande con efecto hover suave
- Badge circular en la esquina inferior derecha
- Icono de usuario dentro del badge
- Borde blanco alrededor del badge para contraste

### Iconos Informativos
- **Mail**: Para email del usuario
- **AtSign**: Para username
- **Calendar**: Para fecha de registro
- **User**: Para badge del avatar

### Inputs de Solo Lectura
- Usan el componente `Input` global
- Estilo `bg-gray-50` para indicar que son de solo lectura
- Deshabilitados (`disabled`) para prevenir edición
- Mantienen la consistencia visual con otros formularios

### Botones de Acción
- Variante `outline` para acciones secundarias
- Iconos integrados con texto
- Layout responsive
- Listos para implementar funcionalidad de edición

## Visualización de Imagen de Perfil

El Avatar muestra la imagen de perfil del usuario si está disponible:

```tsx
<Avatar
  src={(user as any)?.imageUrl || undefined}
  name={userName}
  size="lg"
  className="mx-auto sm:mx-0 transition-all duration-200 hover:scale-105 cursor-pointer w-32 h-32 text-2xl"
/>
```

- **Soporte para base64**: El componente Avatar puede mostrar imágenes en formato base64 (data URLs)
- **Fallback**: Si no hay `imageUrl`, muestra las iniciales del usuario con un color aleatorio
- **Actualización automática**: Cuando se actualiza el perfil, la imagen se refresca automáticamente gracias a React Query

## Mejoras Futuras

- ✅ **Componentes globales**: Ya utiliza Card, Avatar, Input, Button
- ✅ **Iconos visuales**: Integrados con Lucide React
- ✅ **Estilos consistentes**: Usa la paleta de colores del proyecto
- ✅ **Edición de perfil**: Implementado en `/profile/edit`
- ✅ **Cambio de avatar**: Implementado con vista previa y actualización
- 🔄 **Mostrar estadísticas**: Posts, seguidores, etc.
- 🔄 **Lista de posts**: Mostrar posts del usuario
- 🔄 **Configuración de privacidad**: Ajustes de privacidad
- 🔄 **Historial de actividad**: Actividad reciente del usuario

