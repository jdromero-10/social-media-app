# NavBar.tsx - Documentación

## Descripción
Componente de barra de navegación superior que incluye el logo/nombre de la aplicación, una barra de búsqueda y un menú de usuario con avatar. Proporciona acceso rápido a funcionalidades importantes y gestión de la cuenta del usuario.

## Características

### Elementos Principales

1. **Logo/Nombre** (solo móvil)
   - Visible solo en pantallas pequeñas
   - Nombre de la aplicación: "SocialApp"

2. **Barra de Búsqueda**
   - Visible desde `md:` breakpoint
   - Input con icono de búsqueda
   - Placeholder: "Buscar..."
   - Funcionalidad de búsqueda (mockup inicial)

3. **Menú de Usuario**
   - Avatar del usuario
   - Nombre del usuario (solo desktop)
   - Menú desplegable con opciones:
     - Mi Perfil
     - Configuración
     - Cerrar Sesión

## Funcionalidades

### Búsqueda
- Input de búsqueda con icono
- Formulario que previene el comportamiento por defecto
- Actualmente es un mockup (TODO: implementar búsqueda real)

### Menú de Usuario

#### Información del Usuario
- Muestra nombre o email del usuario
- Avatar con iniciales si no hay imagen
- Email del usuario en el dropdown

#### Opciones del Menú
1. **Mi Perfil** (`/profile`)
   - Navega a la página de perfil
   - Icono: `User`

2. **Configuración** (`/settings`)
   - Navega a la página de configuración (a implementar)
   - Icono: `Settings`

3. **Cerrar Sesión**
   - Ejecuta logout
   - Redirige a `/login`
   - Muestra estado de carga durante el proceso
   - Icono: `LogOut`
   - Estilo: rojo para acción destructiva

## Estados

### Menú Desplegable
- Se abre/cierra al hacer clic en el avatar
- Se cierra automáticamente al hacer clic fuera
- Se cierra al seleccionar una opción
- Usa `useRef` y `useEffect` para detectar clics fuera

### Logout
- Estado de carga: `isLoggingOut`
- Botón deshabilitado durante el proceso
- Texto cambia a "Cerrando..." durante el logout

## Responsividad

### Desktop (lg:)
- Logo oculto
- Barra de búsqueda visible y centrada
- Nombre del usuario visible junto al avatar

### Móvil (< lg)
- Logo visible
- Barra de búsqueda oculta
- Solo avatar visible (sin nombre)

## Estilos

### NavBar
- Altura: 64px (lg: 80px)
- Fondo: blanco (`bg-white`)
- Borde inferior: gris claro
- Posición: sticky en la parte superior
- Z-index: 20 (debajo del sidebar móvil)

### Barra de Búsqueda
- Max-width: 2xl
- Input con padding izquierdo para el icono
- Icono de búsqueda posicionado absolutamente

### Menú Desplegable
- Posición: absoluta, derecha
- Ancho: 224px (w-56)
- Sombra: `shadow-lg`
- Border radius: `rounded-xl`
- Z-index: 50 (sobre otros elementos)

## Integración con APIs

### Obtener Usuario Actual
```tsx
const { data: user } = useQuery<User>({
  queryKey: ['currentUser'],
  queryFn: async () => {
    return apiClient.get<User>('/auth/me');
  },
  retry: false,
});
```

### Logout
```tsx
const { logout, isLoggingOut } = useAuth();
await logout();
navigate('/login');
```

## Componentes Utilizados

- **Avatar**: Componente reutilizable para mostrar la imagen del usuario
- **Input**: Componente reutilizable para la barra de búsqueda
- **Button**: No se usa directamente, pero el menú sigue el mismo estilo

## Accesibilidad

- Botones con `aria-label` apropiados
- Navegación por teclado funcional
- Estados de focus visibles
- Contraste adecuado

## Uso

```tsx
import { NavBar } from './shared/components';

// Se usa dentro de MainLayout
<NavBar />
```

## Efectos Hover

### Avatar con Hover
El avatar en el menú de usuario tiene efectos hover interactivos:
- **Escala**: Aumenta ligeramente (`scale-110`) al pasar el cursor
- **Ring**: Muestra un anillo cyan (`ring-2 ring-[#00dde5]`) alrededor del avatar
- **Ring Offset**: Espacio entre el avatar y el anillo (`ring-offset-2`)
- **Transición**: Animación suave de 200ms para todos los efectos
- **Cursor**: Cambia a `pointer` para indicar que es clickeable

**Implementación:**
- Usa `group` en el botón contenedor
- Usa `group-hover:` en el Avatar para activar los efectos cuando se hace hover sobre el botón
- Transiciones suaves con `transition-all duration-200`

## Notas Técnicas

- Usa `useQuery` de TanStack Query para obtener datos del usuario
- `useRef` y `useEffect` para cerrar el dropdown al hacer clic fuera
- `useNavigate` de React Router para navegación
- `useAuth` hook para funcionalidad de logout
- Estado local `isDropdownOpen` para controlar el menú
- Usa `group` y `group-hover:` de Tailwind para efectos hover en elementos hijos

## Mejoras Futuras

- Implementar búsqueda real con resultados en tiempo real
- Agregar notificaciones no leídas en el menú
- Agregar atajos de teclado (ej: Ctrl+K para búsqueda)
- Agregar modo oscuro
- Agregar preferencias de usuario en el dropdown

