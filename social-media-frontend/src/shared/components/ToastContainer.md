# ToastContainer.tsx - Documentación

## Descripción
Contenedor global que gestiona la visualización de múltiples notificaciones toast. Se posiciona de forma fija en la esquina superior derecha de la pantalla y muestra los toasts en una columna vertical con espaciado entre ellos. **Lee automáticamente el estado del store de Zustand**, por lo que no requiere props.

## Características

- **Sin Props**: Lee directamente del `toastStore` de Zustand
- **Reactivo**: Se actualiza automáticamente cuando cambia el estado del store
- **Global**: Disponible en toda la aplicación a través del `ToastProvider`

## Características

### Posicionamiento Fijo
El contenedor usa `position: fixed` con:
- `top-4`: 16px desde la parte superior
- `right-4`: 16px desde la derecha
- `z-[9999]`: Z-index muy alto para estar por encima de todos los elementos
- `pointer-events-none`: Permite que los clics pasen a través del contenedor
- `pointer-events-auto`: En cada toast individual para permitir interacción

### Layout Vertical
Los toasts se muestran en una columna vertical (`flex-col`) con:
- `gap-2`: Espaciado de 8px entre toasts
- Se apilan de arriba hacia abajo

### Renderizado Condicional
Si no hay toasts (`toasts.length === 0`), el componente retorna `null` y no renderiza nada.

## Ejemplo de Uso

**Nota**: Normalmente no se usa directamente. Se usa a través del `ToastProvider` en `MainLayout`.

```tsx
import { ToastContainer } from '@/shared/components/ToastContainer';

// El componente lee automáticamente del store
function MyPage() {
  return (
    <div>
      <ToastContainer />
      {/* Resto del contenido */}
    </div>
  );
}
```

## Integración con ToastProvider

El `ToastContainer` se usa dentro del `ToastProvider` que se renderiza en `MainLayout`:

```tsx
// MainLayout.tsx
import { ToastProvider } from './ToastProvider';

export const MainLayout = () => {
  return (
    <>
      {/* Layout normal */}
      <ToastProvider /> {/* Renderiza ToastContainer internamente */}
    </>
  );
};
```

## Posicionamiento

El contenedor se posiciona de forma fija en la esquina superior derecha:

```
┌─────────────────────────────────────┐
│                                     │
│                    ┌─────────────┐ │
│                    │ Toast 1      │ │
│                    ├─────────────┤ │
│                    │ Toast 2      │ │
│                    └─────────────┘ │
│                                     │
│  Contenido de la página            │
│                                     │
└─────────────────────────────────────┘
```

## Responsive

El contenedor funciona bien en todos los tamaños de pantalla:
- **Desktop**: Se mantiene en la esquina superior derecha
- **Tablet**: Se ajusta automáticamente
- **Mobile**: Puede necesitar ajustes de padding si la pantalla es muy pequeña

## Notas Técnicas

- Usa `key={toast.id}` para optimizar el renderizado de React
- El `z-index` de 50 asegura que esté por encima de la mayoría de elementos
- El contenedor no tiene fondo propio, solo posiciona los toasts
- Cada toast maneja su propio estilo y comportamiento

## Integración con Páginas

Este componente se usa típicamente en páginas que necesitan mostrar notificaciones:

```tsx
// LoginPage.tsx
export const LoginPage = () => {
  const { toasts, removeToast, showError } = useToast();

  return (
    <div className="min-h-screen">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <LoginForm onError={showError} />
    </div>
  );
};
```

## Ventajas

1. **Centralizado**: Todas las notificaciones se muestran en el mismo lugar
2. **No intrusivo**: No interfiere con el contenido principal
3. **Apilable**: Puede mostrar múltiples toasts simultáneamente
4. **Reutilizable**: Se puede usar en cualquier página

## Personalización

### Cambiar la posición
```tsx
// Esquina superior izquierda
<div className="fixed top-4 left-4 z-50 flex flex-col gap-2">
  {/* toasts */}
</div>

// Esquina inferior derecha
<div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
  {/* toasts */}
</div>
```

### Cambiar el espaciado
```tsx
<div className="fixed top-4 right-4 z-50 flex flex-col gap-4">
  {/* gap-4 = 16px entre toasts */}
</div>
```

