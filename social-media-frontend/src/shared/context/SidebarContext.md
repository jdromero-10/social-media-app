# SidebarContext.tsx - Documentación

## Descripción
Contexto React que proporciona estado global para controlar la visibilidad del SideBar. Permite ocultar y mostrar el sidebar desde cualquier componente de la aplicación.

## API del Contexto

### `SidebarContextType`
```typescript
interface SidebarContextType {
  isVisible: boolean;        // Estado actual de visibilidad
  toggleSidebar: () => void; // Alterna entre visible/oculto
  hideSidebar: () => void;   // Oculta el sidebar
  showSidebar: () => void;   // Muestra el sidebar
}
```

## Componentes

### `SidebarProvider`
Provider que envuelve los componentes que necesitan acceso al estado del sidebar.

**Props:**
- `children: ReactNode` - Componentes hijos

**Estado inicial:**
- `isVisible: true` - El sidebar está visible por defecto

**Uso:**
```tsx
<SidebarProvider>
  <MainLayout />
</SidebarProvider>
```

### `useSidebar()`
Hook para acceder al contexto del sidebar.

**Retorna:**
- `SidebarContextType` - Objeto con estado y funciones de control

**Lanza error si:**
- Se usa fuera de `SidebarProvider`

**Ejemplo:**
```tsx
const { isVisible, toggleSidebar } = useSidebar();

// Alternar visibilidad
<button onClick={toggleSidebar}>
  {isVisible ? 'Ocultar' : 'Mostrar'} Sidebar
</button>
```

## Funcionalidades

### `toggleSidebar()`
Alterna el estado de visibilidad del sidebar.
- Si está visible → lo oculta
- Si está oculto → lo muestra

### `hideSidebar()`
Oculta el sidebar explícitamente.
- Establece `isVisible = false`

### `showSidebar()`
Muestra el sidebar explícitamente.
- Establece `isVisible = true`

## Integración

### En MainLayout
El `SidebarProvider` debe envolver el contenido que usa el sidebar:

```tsx
export const MainLayout = () => {
  return (
    <CreatePostModalProvider>
      <SidebarProvider>
        <MainLayoutContent />
      </SidebarProvider>
    </CreatePostModalProvider>
  );
};
```

### En SideBar
El componente `SideBar` usa el hook para controlar su visibilidad:

```tsx
export const SideBar = () => {
  const { isVisible, toggleSidebar } = useSidebar();
  
  return (
    <aside className={isVisible ? 'w-64' : 'w-16'}>
      {/* Contenido del sidebar */}
    </aside>
  );
};
```

## Comportamiento

### Desktop (lg: y superior)
- **Visible**: Sidebar ocupa 256px (`w-64`)
- **Oculto**: Sidebar ocupa 64px (`w-16`) - solo iconos visibles
- **Transición**: Animación suave de 300ms
- **Botón**: Siempre visible en el header del sidebar

### Móvil (< lg)
- El contexto no afecta el comportamiento móvil
- El sidebar móvil se controla con `isMobileMenuOpen` (estado local)
- El botón de ocultar solo es visible en desktop

## Persistencia

**Nota**: El estado no se persiste entre recargas de página. Si se desea persistencia, se puede agregar:
- `localStorage` para guardar preferencia del usuario
- Inicializar `isVisible` desde `localStorage` en el provider

## Ejemplo Completo

```tsx
// En MainLayout.tsx
<SidebarProvider>
  <MainLayoutContent />
</SidebarProvider>

// En SideBar.tsx
const { isVisible, toggleSidebar } = useSidebar();

<Button onClick={toggleSidebar}>
  {isVisible ? <ChevronLeft /> : <ChevronRight />}
</Button>

// En cualquier componente
const { isVisible } = useSidebar();
<div className={isVisible ? 'ml-64' : 'ml-16'}>
  Contenido
</div>
```

## Notas Técnicas

- Usa `useState` para el estado local
- El contexto se crea con `createContext` y se valida en el hook
- El estado es reactivo: todos los componentes que usan `useSidebar()` se actualizan automáticamente
- Compatible con React 18+ y Strict Mode

