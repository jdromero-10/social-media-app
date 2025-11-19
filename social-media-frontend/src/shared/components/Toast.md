# Toast.tsx - Documentación

## Descripción
Componente de notificación tipo toast que muestra mensajes temporales al usuario. Se posiciona arriba a la derecha de la pantalla y se oculta automáticamente después de un tiempo determinado. Ideal para mostrar errores, mensajes de éxito, información o advertencias.

## Props

### `ToastProps`

#### `id: string` (requerido)
- **Tipo**: string
- **Descripción**: Identificador único del toast. Se usa para eliminarlo cuando se cierra.
- **Ejemplo**: `"toast-1234567890-0.123"`

#### `message: string` (requerido)
- **Tipo**: string
- **Descripción**: Mensaje a mostrar en el toast.
- **Ejemplo**: `"Credenciales inválidas"`

#### `type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING'` (requerido)
- **Tipo**: String literal union
- **Descripción**: Tipo de notificación que determina el color y el icono.
- **Opciones**:
  - `SUCCESS`: Fondo verde claro, icono CheckCircle (Lucide React)
  - `ERROR`: Fondo rojo claro, icono XCircle (Lucide React)
  - `INFO`: Fondo azul claro, icono Info (Lucide React)
  - `WARNING`: Fondo amarillo claro, icono AlertTriangle (Lucide React)
- **Ejemplo**: `<Toast type="SUCCESS" message="Operación exitosa" />`

**Nota**: La duración se maneja en el `toastStore`, no en el componente Toast individual.

#### `onClose: (id: string) => void` (requerido)
- **Tipo**: Función
- **Descripción**: Callback que se ejecuta cuando el toast se cierra (automáticamente o manualmente).
- **Parámetros**: `id` - El identificador del toast a cerrar
- **Ejemplo**: `onClose={(id) => removeToast(id)}`

## Características

### Auto-cierre
El auto-cierre se maneja en el `toastStore` usando `setTimeout`. El componente Toast solo recibe el callback `onClose` para cerrarse manualmente.

### Cierre Manual
El usuario puede cerrar el toast manualmente haciendo clic en el botón "✕" en la esquina superior derecha.

### Estilos por Tipo
Cada tipo de toast tiene su propio esquema de colores:
- **Error**: `bg-red-50 border-red-200 text-red-800`
- **Success**: `bg-green-50 border-green-200 text-green-800`
- **Info**: `bg-[#eafffd] border-[#9efff9] text-[#0d6f7d]` (cyan-50, cyan-200, cyan-800)
- **Warning**: `bg-yellow-50 border-yellow-200 text-yellow-800`

### Iconos
Cada tipo muestra un icono de Lucide React correspondiente:
- `XCircle` para ERROR (rojo)
- `CheckCircle` para SUCCESS (verde)
- `Info` para INFO (azul)
- `AlertTriangle` para WARNING (amarillo)

## Estructura Visual

```
┌─────────────────────────────────────┐
│ ⚠️  Mensaje de notificación     ✕ │
└─────────────────────────────────────┘
```

- **Icono**: A la izquierda, icono de Lucide React que indica el tipo
- **Mensaje**: En el centro, texto del mensaje
- **Botón cerrar**: A la derecha, icono X de Lucide React para cerrar manualmente

## Ejemplo de Uso

```tsx
import { Toast } from '@/shared/components/Toast';

function MyComponent() {
  const [toasts, setToasts] = useState([]);

  const handleClose = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <Toast
      id="toast-1"
      message="Operación completada exitosamente"
      type="success"
      duration={3000}
      onClose={handleClose}
    />
  );
}
```

## Uso con useToast Hook

Normalmente no se usa directamente, sino a través del hook `useToast`:

```tsx
import { useToast } from '@/shared/hooks/useToast';

function MyComponent() {
  const { showError, showSuccess } = useToast();

  const handleAction = () => {
    try {
      // operación
      showSuccess('Operación exitosa');
    } catch (error) {
      showError('Algo salió mal');
    }
  };
}
```

## Accesibilidad

- **role="alert"**: Indica que es un mensaje importante para lectores de pantalla
- **aria-label**: El botón de cerrar tiene un label descriptivo
- **Contraste**: Los colores cumplen con estándares de contraste para legibilidad

## Notas Técnicas

- El componente usa `useEffect` para manejar el auto-cierre
- Se limpia el timer cuando el componente se desmonta para evitar memory leaks
- Usa `cn()` de `@/lib/utils` para combinar clases de Tailwind
- El ancho mínimo es 300px y máximo 400px para mantener legibilidad

## Personalización

### Cambiar la duración por defecto
```tsx
<Toast duration={10000} message="Mensaje" /> // 10 segundos
```

### Cambiar el estilo
Puedes modificar los estilos en el objeto `styles` dentro del componente:
```tsx
const styles = {
  error: 'bg-red-100 border-red-300 text-red-900', // Más oscuro
  // ...
};
```

## Integración

Este componente se usa junto con:
- **ToastContainer**: Para posicionar y mostrar múltiples toasts (lee del store automáticamente)
- **toastStore**: Store global de Zustand que gestiona el estado de los toasts
- **useToast**: Hook para gestionar el estado de los toasts (wrapper del store)
- **ToastProvider**: Provider que renderiza el ToastContainer en MainLayout

