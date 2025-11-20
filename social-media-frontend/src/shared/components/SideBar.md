# SideBar.tsx - Documentación

## Descripción
Componente de barra lateral que proporciona navegación principal para la aplicación. Incluye enlaces a Home, Perfil, Notificaciones y un botón para crear posts. Se adapta responsivamente: fijo en desktop y menú off-canvas en móvil.

## Características

### Desktop (lg: y superior)
- Barra lateral **fija** (fixed) con ancho variable
  - **Expandido**: 256px de ancho (`w-64`)
  - **Colapsado**: 64px de ancho (`w-16`) - solo iconos visibles
- **Botón de ocultar/mostrar**: Botón con icono `ChevronLeft`/`ChevronRight` en el header
- **Sin scroll** - los elementos se mantienen en su posición
- Logo y nombre de la aplicación (oculto cuando está colapsado)
- Navegación con iconos y etiquetas (etiquetas ocultas cuando está colapsado)
- Botón "Crear Post" en la parte inferior (solo icono cuando está colapsado)
- Indicador visual del elemento activo
- Altura completa de la pantalla sin scroll
- **Transiciones suaves**: Animación de 300ms al expandir/colapsar

### Móvil (< lg)
- Menú hamburguesa en la esquina superior izquierda
- Menú off-canvas que se desliza desde la izquierda
- Overlay oscuro cuando el menú está abierto
- BottomNav fijo en la parte inferior de la pantalla
- Botón "Crear Post" visible en el menú móvil

## Botón de Ocultar/Mostrar

### Ubicación
- **Posición**: Header del sidebar, lado derecho
- **Visibilidad**: Solo en desktop (`hidden lg:flex`)
- **Componente**: Usa el componente global `Button` con variante `outline`

### Funcionalidad
- **Icono**: `ChevronLeft` cuando está expandido, `ChevronRight` cuando está colapsado
- **Acción**: Alterna la visibilidad del sidebar usando `useSidebar().toggleSidebar()`
- **Estado**: El estado se mantiene durante la sesión (no persiste entre recargas)

### Comportamiento
- Al hacer clic, el sidebar se colapsa/expande con animación suave
- Los textos se ocultan gradualmente con `opacity-0` y `overflow-hidden`
- Los iconos permanecen visibles en ambos estados
- El contenido principal se ajusta automáticamente (`ml-64` → `ml-16`)
- **Estado colapsado**: 
  - Logo y botón de mostrar están centrados verticalmente en el header
  - Botón de "Crear Post" se convierte en botón de icono centrado
  - Todos los elementos están alineados al ancho del sidebar colapsado (64px)

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
- **Estados**:
  - **Expandido**: Botón completo con icono y texto "Crear Post"
  - **Colapsado**: Botón pequeño con solo icono, centrado y con tooltip

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
- Logo con gradiente cyan
- Nombre de la app (oculto en móvil y cuando el sidebar está colapsado)
- **Estado expandido**: Logo y nombre a la izquierda, botón de ocultar a la derecha
- **Estado colapsado**: Logo centrado arriba, botón de mostrar centrado abajo (en columna)

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

## Integración con Contextos

### CreatePostModalContext
El SideBar usa el hook `useCreatePostModal` para abrir el modal:

```tsx
const { openModal } = useCreatePostModal();

// En el botón
<button onClick={openModal}>
  Crear Post
</button>
```

**Nota**: El SideBar debe estar dentro de `CreatePostModalProvider` (proporcionado por MainLayout) para que el hook funcione correctamente.

### SidebarContext
El SideBar usa el hook `useSidebar` para controlar su visibilidad:

```tsx
const { isVisible, toggleSidebar } = useSidebar();

// En el botón de ocultar
<Button onClick={toggleSidebar}>
  {isVisible ? <ChevronLeft /> : <ChevronRight />}
</Button>
```

**Nota**: El SideBar debe estar dentro de `SidebarProvider` (proporcionado por MainLayout) para que el hook funcione correctamente.

## Notas Técnicas

- Usa `useLocation()` de React Router para detectar la ruta activa
- Estado local `isMobileMenuOpen` para controlar el menú móvil
- Estado global `isVisible` desde `useSidebar()` para controlar visibilidad en desktop
- Transiciones CSS para animaciones suaves (300ms)
- `z-index` apropiado para overlay y sidebar
- Usa `useCreatePostModal()` hook para abrir el modal de crear post
- Usa `useSidebar()` hook para controlar la visibilidad del sidebar
- El botón "Crear Post" abre el modal global en lugar de navegar a una ruta
- El botón de ocultar usa el componente global `Button` con variante `outline`
- Los elementos de texto se ocultan con `opacity-0` y `overflow-hidden` cuando está colapsado
- Los iconos permanecen visibles en ambos estados para mejor UX
- Tooltips (`title`) se muestran en elementos cuando el sidebar está colapsado

## Mejoras Futuras

- Agregar contador de notificaciones no leídas
- Agregar badge para nuevos posts
- Implementar animaciones más suaves
- Agregar atajos de teclado para navegación
- Soporte para temas personalizados
- Persistir preferencia de visibilidad del sidebar en `localStorage`
- Agregar tooltips mejorados cuando el sidebar está colapsado

