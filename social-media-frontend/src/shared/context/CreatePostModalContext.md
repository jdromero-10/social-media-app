# CreatePostModalContext.tsx - Documentación

## Descripción
Contexto de React que proporciona un estado global compartido para el modal de crear post. Permite que cualquier componente dentro de la aplicación abra o cierre el modal de crear post de manera consistente.

## Propósito
Centralizar el control del modal de crear post para que:
- El botón del SideBar y el botón de HomePage abran el mismo modal
- El modal esté disponible desde cualquier página
- La lógica de creación de post esté centralizada en MainLayout

## Estructura

### Provider
- **`CreatePostModalProvider`**: Componente que envuelve la aplicación y proporciona el contexto
- Debe envolver los componentes que necesiten acceso al modal

### Hook
- **`useCreatePostModal`**: Hook personalizado para acceder al contexto
- Retorna: `{ isOpen, openModal, closeModal }`

## API

### `CreatePostModalProvider`

**Props:**
```tsx
interface CreatePostModalProviderProps {
  children: ReactNode;
}
```

**Uso:**
```tsx
<CreatePostModalProvider>
  <MainLayout />
</CreatePostModalProvider>
```

### `useCreatePostModal`

**Retorna:**
```tsx
{
  isOpen: boolean;        // Estado actual del modal (abierto/cerrado)
  openModal: () => void;  // Función para abrir el modal
  closeModal: () => void; // Función para cerrar el modal
}
```

**Uso:**
```tsx
const { isOpen, openModal, closeModal } = useCreatePostModal();
```

## Integración

### En MainLayout
El `MainLayout` envuelve su contenido con el provider y renderiza el modal:

```tsx
export const MainLayout = () => {
  return (
    <CreatePostModalProvider>
      <MainLayoutContent />
    </CreatePostModalProvider>
  );
};
```

El componente interno `MainLayoutContent` usa el hook y renderiza el modal:

```tsx
const MainLayoutContent = () => {
  const { isOpen, closeModal } = useCreatePostModal();
  // ... lógica de creación de post
  
  return (
    <>
      {/* Layout normal */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <CreatePostForm onSubmit={handleCreatePost} />
      </Modal>
    </>
  );
};
```

### En SideBar
El SideBar usa el hook para abrir el modal:

```tsx
export const SideBar = () => {
  const { openModal } = useCreatePostModal();
  
  return (
    <button onClick={openModal}>
      Crear Post
    </button>
  );
};
```

### En HomePage
HomePage también usa el hook:

```tsx
export const HomePage = () => {
  const { openModal: openCreateModal } = useCreatePostModal();
  
  return (
    <Button onClick={openCreateModal}>
      Crear Post
    </Button>
  );
};
```

## Flujo de Datos

```
CreatePostModalProvider (MainLayout)
    ↓
useCreatePostModal() hook disponible
    ↓
SideBar / HomePage llaman openModal()
    ↓
Estado isOpen cambia a true
    ↓
MainLayout renderiza Modal
    ↓
Usuario completa formulario
    ↓
Post se crea, closeModal() se llama
    ↓
Estado isOpen cambia a false
    ↓
Modal se oculta
```

## Ventajas

1. **Centralización**: Un solo lugar para manejar el modal
2. **Consistencia**: Mismo comportamiento desde cualquier componente
3. **Reutilización**: Fácil de usar desde cualquier parte de la app
4. **Mantenibilidad**: Cambios en un solo lugar afectan a todos los usos

## Notas Técnicas

- Usa `createContext` y `useContext` de React
- El contexto se inicializa como `undefined` y se valida en el hook
- Lanza error si se usa fuera del provider
- El estado se maneja con `useState` dentro del provider

## Mejoras Futuras

- Agregar soporte para diferentes tipos de modales
- Agregar historial de modales abiertos
- Implementar animaciones de transición
- Agregar callbacks personalizados al abrir/cerrar

