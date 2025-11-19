# toastStore.ts - Documentación

## Descripción
Store global de Zustand para manejar el estado de las notificaciones toast en toda la aplicación. Proporciona un sistema centralizado y no bloqueante para mostrar notificaciones al usuario sobre el resultado de sus interacciones.

## Características

- **Estado Global**: Todas las notificaciones se gestionan desde un único store
- **Auto-cierre**: Las notificaciones se cierran automáticamente después de la duración especificada
- **Cola de Notificaciones**: Soporta múltiples notificaciones simultáneas
- **No Bloqueante**: Las notificaciones no interfieren con la interacción del usuario

## Estructura

### Tipos

```typescript
type ToastType = 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING';

interface Toast {
  id: string;           // ID único del toast
  message: string;       // Mensaje a mostrar
  type: ToastType;       // Tipo de notificación
  duration: number;      // Duración en milisegundos
}
```

### Estado del Store

```typescript
interface ToastStore {
  toasts: Toast[];                    // Array de toasts activos
  showToast: (message, type, duration?) => string;  // Mostrar nuevo toast
  hideToast: (id: string) => void;    // Ocultar toast específico
  clearAll: () => void;               // Limpiar todos los toasts
}
```

## API

### `showToast(message: string, type: ToastType, duration?: number): string`

Muestra un nuevo toast y retorna su ID único.

**Parámetros:**
- `message`: Mensaje a mostrar (requerido)
- `type`: Tipo de toast - 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING' (requerido)
- `duration`: Duración en milisegundos antes de auto-cerrar (default: 4000ms)

**Retorna:** ID único del toast creado

**Ejemplo:**
```typescript
const toastId = useToastStore.getState().showToast(
  'Publicación creada con éxito.',
  'SUCCESS',
  4000
);
```

**Comportamiento:**
- Genera un ID único para el toast
- Agrega el toast al array de toasts activos
- Configura un timer para auto-cierre después de `duration` milisegundos
- Si `duration` es 0 o negativo, el toast no se cierra automáticamente

### `hideToast(id: string): void`

Oculta un toast específico por su ID.

**Parámetros:**
- `id`: ID del toast a ocultar (requerido)

**Ejemplo:**
```typescript
useToastStore.getState().hideToast(toastId);
```

### `clearAll(): void`

Limpia todos los toasts activos.

**Ejemplo:**
```typescript
useToastStore.getState().clearAll();
```

## Uso

### Desde un Componente

```typescript
import { useToastStore } from '../store/toastStore';

const MyComponent = () => {
  const showToast = useToastStore((state) => state.showToast);
  
  const handleAction = () => {
    showToast('Operación exitosa', 'SUCCESS');
  };
  
  return <button onClick={handleAction}>Acción</button>;
};
```

### Desde un Store (PostStore)

```typescript
import { useToastStore } from './toastStore';

// En una acción del store
createPost: async (postData) => {
  try {
    const newPost = await postsApi.create(postData);
    // Notificación de éxito
    useToastStore.getState().showToast(
      'Publicación creada con éxito.',
      'SUCCESS'
    );
    return newPost;
  } catch (error) {
    // Notificación de error
    useToastStore.getState().showToast(
      'Error al procesar la publicación. Intente de nuevo.',
      'ERROR'
    );
    return null;
  }
}
```

### Usando el Hook `useToast`

Para mayor comodidad, se recomienda usar el hook `useToast` que proporciona métodos helper:

```typescript
import { useToast } from '../hooks/useToast';

const MyComponent = () => {
  const { showSuccess, showError } = useToast();
  
  const handleAction = () => {
    showSuccess('Operación exitosa');
  };
};
```

## Integración con PostStore

El `PostStore` está integrado con el `toastStore` para mostrar notificaciones automáticamente:

- **Crear Post**: Muestra 'SUCCESS' al crear, 'ERROR' si falla
- **Actualizar Post**: Muestra 'SUCCESS' al actualizar, 'ERROR' si falla
- **Eliminar Post**: Muestra 'SUCCESS' al eliminar, 'ERROR' si falla

## Tipos de Toast

### SUCCESS
- **Uso**: Operaciones exitosas (crear, editar, eliminar)
- **Color**: Verde
- **Icono**: CheckCircle (Lucide React)

### ERROR
- **Uso**: Errores de API o validación
- **Color**: Rojo
- **Icono**: XCircle (Lucide React)

### INFO
- **Uso**: Información general
- **Color**: Azul
- **Icono**: Info (Lucide React)

### WARNING
- **Uso**: Advertencias
- **Color**: Amarillo
- **Icono**: AlertTriangle (Lucide React)

## Duración por Defecto

- **Default**: 4000ms (4 segundos)
- **Personalizable**: Se puede especificar una duración diferente por toast
- **Persistente**: Si `duration` es 0, el toast no se cierra automáticamente

## Notas Técnicas

- El store usa Zustand para gestión de estado global
- Los IDs se generan usando timestamp y random string
- El auto-cierre se maneja con `setTimeout` en el store
- El store es reactivo: los componentes se actualizan automáticamente cuando cambia el estado

## Mejoras Futuras

- Agregar límite máximo de toasts simultáneos
- Implementar animaciones de entrada/salida
- Agregar soporte para acciones en los toasts
- Implementar persistencia de notificaciones importantes
- Agregar sonidos opcionales para diferentes tipos

