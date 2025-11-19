# ToastProvider.tsx - Documentación

## Descripción
Provider global para el sistema de notificaciones Toast. Renderiza el `ToastContainer` que muestra todas las notificaciones activas del store de Zustand. Debe colocarse en el nivel más alto de la aplicación (en `MainLayout`) para que las notificaciones estén disponibles en toda la aplicación.

## Características

- **Global**: Proporciona notificaciones en toda la aplicación
- **No Bloqueante**: Las notificaciones no interfieren con la interacción del usuario
- **Automático**: Se integra automáticamente con el `toastStore` de Zustand
- **Sin Configuración**: No requiere props ni configuración adicional

## Uso

### En MainLayout

El `ToastProvider` se renderiza en `MainLayout` para estar disponible en todas las rutas protegidas:

```tsx
// MainLayout.tsx
import { ToastProvider } from './ToastProvider';

const MainLayoutContent = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Layout normal */}
      </div>
      {/* Sistema de Notificaciones Global */}
      <ToastProvider />
    </>
  );
};
```

## Integración

El `ToastProvider` renderiza internamente el `ToastContainer`, que lee automáticamente del `toastStore`:

```tsx
// ToastProvider.tsx
export const ToastProvider = () => {
  return <ToastContainer />;
};
```

## Flujo de Datos

```
Componente/Store
    ↓
useToastStore.getState().showToast()
    ↓
toastStore actualiza estado
    ↓
ToastContainer (en ToastProvider) se actualiza automáticamente
    ↓
Toast se muestra en pantalla
    ↓
Auto-cierre después de duration
    ↓
toastStore.removeToast()
```

## Ventajas

1. **Centralizado**: Un solo lugar para todas las notificaciones
2. **Reactivo**: Se actualiza automáticamente cuando cambia el store
3. **No Intrusivo**: No requiere pasar props a través de múltiples componentes
4. **Fácil de Usar**: Cualquier componente puede mostrar notificaciones usando el store

## Notas Técnicas

- El provider no mantiene estado propio, solo renderiza el `ToastContainer`
- El `ToastContainer` lee directamente del `toastStore` usando hooks de Zustand
- Se posiciona con `z-[9999]` para estar por encima de todos los elementos
- No interfiere con el layout principal gracias a `position: fixed`

## Mejoras Futuras

- Agregar animaciones de entrada/salida
- Soporte para diferentes posiciones (top-left, bottom-right, etc.)
- Límite máximo de toasts simultáneos
- Agrupar toasts similares

