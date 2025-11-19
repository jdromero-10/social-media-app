# SideBar.tsx - Documentación

## Descripción
Componente de barra lateral que proporciona navegación principal para la aplicación. Incluye enlaces a Home, Perfil, Notificaciones y un botón para crear posts. Se adapta responsivamente: fijo en desktop y menú off-canvas en móvil.

## Características

### Desktop (lg: y superior)
- Barra lateral **fija** (fixed) de 256px de ancho
- **Sin scroll** - los elementos se mantienen en su posición
- Logo y nombre de la aplicación
- Navegación con iconos y etiquetas
- Botón "Crear Post" en la parte inferior
- Indicador visual del elemento activo
- Altura completa de la pantalla sin scroll

### Móvil (< lg)
- Menú hamburguesa en la esquina superior izquierda
- Menú off-canvas que se desliza desde la izquierda
- Overlay oscuro cuando el menú está abierto
- BottomNav fijo en la parte inferior de la pantalla
- Botón "Crear Post" visible en el menú móvil

## Elementos de Navegación

### Items de Navegación

1. **Home** (`/home`)
   - Icono: `Home` (Lucide React)
   - Ruta al feed principal

2. **Perfil** (`/profile`)
   - Icono: `User` (Lucide React)
   - Ruta al perfil del usuario

3. **Notificaciones** (`/notifications`)
   - Icono: `Bell` (Lucide React)
   - Ruta a las notificaciones

### Botón Crear Post
- Visible en desktop (parte inferior del sidebar)
- Visible en móvil (dentro del menú off-canvas)
- **Funcionalidad**: Abre el modal global de crear post usando `useCreatePostModal`
- **Comportamiento**: Al hacer clic, abre el mismo modal que se usa en HomePage
- **Integración**: Usa el contexto `CreatePostModalContext` para abrir el modal

## Estados

### Elemento Activo
- Fondo cyan claro (`bg-[#eafffd]` - cyan-50)
- Texto cyan (`text-[#00b1c0]` - cyan-600)
- Fuente semibold
- Icono cyan

### Elemento Inactivo
- Fondo transparente
- Texto gris (`text-gray-700`)
- Hover: fondo gris claro (`hover:bg-gray-50`)

## Responsividad

### Breakpoints
- **lg (1024px)**: Sidebar fijo visible
- **< lg**: Sidebar oculto, menú hamburguesa visible

### Comportamiento Móvil
- Menú hamburguesa abre/cierra el sidebar
- Overlay cierra el menú al hacer clic
- BottomNav siempre visible en móvil
- Sidebar se cierra automáticamente al navegar

## Estilos

### Sidebar Desktop
```css
- Posición: fixed (fijo en la pantalla)
- Ancho: 256px (w-64)
- Altura: 100vh (inset-y-0)
- Fondo: blanco (bg-white)
- Borde derecho: gris claro (border-r border-gray-200)
- Sombra: solo en móvil (shadow-lg lg:shadow-none)
- Overflow: hidden (sin scroll)
- Z-index: 40
```

### Logo Section
- Altura: 64px (lg: 80px)
- Borde inferior
- Logo con gradiente azul-índigo
- Nombre de la app (oculto en móvil)

### Navigation Items
- Espaciado vertical: `space-y-2`
- Padding: `px-4 py-3`
- Border radius: `rounded-lg`
- Transiciones suaves

## Accesibilidad

- Botones con `aria-label` apropiados
- Navegación por teclado funcional
- Estados de focus visibles
- Contraste adecuado en todos los estados

## Uso

```tsx
import { SideBar } from './shared/components';

// Se usa dentro de MainLayout
// Requiere estar dentro de CreatePostModalProvider
<SideBar />
```

## Integración con Modal de Crear Post

El SideBar usa el hook `useCreatePostModal` para abrir el modal:

```tsx
const { openModal } = useCreatePostModal();

// En el botón
<button onClick={openModal}>
  Crear Post
</button>
```

**Nota**: El SideBar debe estar dentro de `CreatePostModalProvider` (proporcionado por MainLayout) para que el hook funcione correctamente.

## Notas Técnicas

- Usa `useLocation()` de React Router para detectar la ruta activa
- Estado local `isMobileMenuOpen` para controlar el menú móvil
- Transiciones CSS para animaciones suaves
- `z-index` apropiado para overlay y sidebar
- Usa `useCreatePostModal()` hook para abrir el modal de crear post
- El botón "Crear Post" abre el modal global en lugar de navegar a una ruta

## Mejoras Futuras

- Agregar contador de notificaciones no leídas
- Agregar badge para nuevos posts
- Implementar animaciones más suaves
- Agregar atajos de teclado para navegación
- Soporte para temas personalizados

