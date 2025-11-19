# useToast.ts - Documentación

## Descripción
Hook personalizado para gestionar notificaciones toast en la aplicación. Proporciona funciones para mostrar diferentes tipos de notificaciones (SUCCESS, ERROR, INFO, WARNING). **Usa el store global de Zustand (`toastStore`) para estado compartido**, por lo que las notificaciones están disponibles en toda la aplicación sin necesidad de pasar props.

## Retorno del Hook

El hook retorna un objeto con las siguientes propiedades y métodos:

### Estado

#### `toasts: Toast[]`
- **Tipo**: Array de `Toast` (del toastStore)
- **Descripción**: Lista de todos los toasts activos actualmente.
- **Uso**: Normalmente no se usa directamente, ya que `ToastContainer` lee del store automáticamente.
- **Nota**: El estado se lee directamente del `toastStore` de Zustand.

### Métodos

#### `showToast(message: string, type: ToastType, duration?: number): string`
- **Tipo**: Función
- **Parámetros**:
  - `message`: Mensaje a mostrar (string, requerido)
  - `type`: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING' (requerido)
  - `duration`: Duración en milisegundos (opcional, default: 4000)
- **Retorna**: `string` - ID único del toast creado
- **Descripción**: Método genérico para mostrar cualquier tipo de toast.
- **Ejemplo**:
  ```tsx
  const { showToast } = useToast();
  showToast('Mensaje personalizado', 'INFO', 3000);
  ```

#### `showError(message: string, duration?: number): string`
- **Tipo**: Función
- **Parámetros**:
  - `message`: Mensaje de error (string, requerido)
  - `duration`: Duración en milisegundos (opcional, default: 4000)
- **Retorna**: `string` - ID único del toast
- **Descripción**: Muestra un toast de tipo ERROR (rojo).
- **Ejemplo**:
  ```tsx
  const { showError } = useToast();
  showError('Credenciales inválidas');
  ```

#### `showSuccess(message: string, duration?: number): string`
- **Tipo**: Función
- **Parámetros**:
  - `message`: Mensaje de éxito (string, requerido)
  - `duration`: Duración en milisegundos (opcional, default: 4000)
- **Retorna**: `string` - ID único del toast
- **Descripción**: Muestra un toast de tipo SUCCESS (verde).
- **Ejemplo**:
  ```tsx
  const { showSuccess } = useToast();
  showSuccess('Operación completada exitosamente');
  ```

#### `showInfo(message: string, duration?: number): string`
- **Tipo**: Función
- **Parámetros**:
  - `message`: Mensaje informativo (string, requerido)
  - `duration`: Duración en milisegundos (opcional, default: 4000)
- **Retorna**: `string` - ID único del toast
- **Descripción**: Muestra un toast de tipo INFO (azul).
- **Ejemplo**:
  ```tsx
  const { showInfo } = useToast();
  showInfo('Nueva actualización disponible');
  ```

#### `showWarning(message: string, duration?: number): string`
- **Tipo**: Función
- **Parámetros**:
  - `message`: Mensaje de advertencia (string, requerido)
  - `duration`: Duración en milisegundos (opcional, default: 4000)
- **Retorna**: `string` - ID único del toast
- **Descripción**: Muestra un toast de tipo WARNING (amarillo).
- **Ejemplo**:
  ```tsx
  const { showWarning } = useToast();
  showWarning('Esta acción no se puede deshacer');
  ```

#### `hideToast(id: string): void`
- **Tipo**: Función
- **Parámetros**:
  - `id`: ID del toast a ocultar (string, requerido)
- **Retorna**: `void`
- **Descripción**: Oculta un toast específico de la lista.
- **Nota**: Normalmente no se usa directamente, ya que `ToastContainer` maneja el cierre automáticamente.

#### `clearAll(): void`
- **Tipo**: Función
- **Parámetros**: Ninguno
- **Retorna**: `void`
- **Descripción**: Limpia todos los toasts activos.
- **Ejemplo**:
  ```tsx
  const { clearAll } = useToast();
  clearAll(); // Limpia todos los toasts
  ```

## Ejemplo de Uso Completo

### En un Componente

```tsx
import { useToast } from '@/shared/hooks/useToast';

function LoginPage() {
  const { showError, showSuccess } = useToast();

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      showSuccess('Sesión iniciada correctamente');
    } catch (error) {
      showError('Error al iniciar sesión');
    }
  };

  return (
    <div>
      {/* ToastProvider ya está en MainLayout, no necesitas ToastContainer */}
      <LoginForm onLogin={handleLogin} />
    </div>
  );
}
```

**Nota**: El `ToastProvider` ya está renderizado en `MainLayout`, por lo que no necesitas renderizar `ToastContainer` manualmente.

### En un Formulario

```tsx
import { useToast } from '@/shared/hooks/useToast';
import { useAuth } from './hooks/useAuth';

function LoginForm({ onError }: { onError?: (msg: string) => void }) {
  const { login, loginError } = useAuth();
  const { showError: showErrorLocal } = useToast();
  
  const showError = onError || showErrorLocal;

  useEffect(() => {
    if (loginError) {
      showError(loginError.message);
    }
  }, [loginError, showError]);

  // ...
}
```

## Gestión de Estado

El hook usa el **store global de Zustand (`toastStore`)** para mantener la lista de toasts. Esto significa:

- **Estado Compartido**: Todos los componentes comparten el mismo estado de toasts
- **Reactivo**: Los componentes se actualizan automáticamente cuando cambia el estado
- **Sin Props**: No necesitas pasar toasts como props entre componentes
- **Global**: Las notificaciones están disponibles en toda la aplicación

## Flujo de Trabajo

```
1. Usuario realiza acción (ej: crear post)
   ↓
2. Se llama a showSuccess/showError/etc. desde cualquier componente
   ↓
3. toastStore.showToast() crea un nuevo toast con ID único
   ↓
4. Se agrega al array de toasts en el store
   ↓
5. ToastContainer (en ToastProvider) se actualiza automáticamente
   ↓
6. Toast se muestra en pantalla
   ↓
7. Timer en el store auto-cierra después de duration
   ↓
8. toastStore.hideToast() elimina el toast del array
   ↓
9. ToastContainer se actualiza y oculta el toast
```

## Ventajas

1. **API Simple**: Funciones claras para cada tipo de notificación
2. **Tipado Fuerte**: TypeScript garantiza tipos correctos
3. **Estado Global**: Compartido en toda la aplicación sin props
4. **Reactivo**: Se actualiza automáticamente cuando cambia el store
5. **Flexible**: Permite personalizar duración y tipo
6. **Reutilizable**: Se puede usar en cualquier componente
7. **No Bloqueante**: Las notificaciones no interfieren con la UI

## Notas Técnicas

- El hook es un wrapper del `toastStore` de Zustand
- El estado se gestiona globalmente en el store, no localmente
- Los toasts se eliminan automáticamente después de su duración (manejado en el store)
- El `ToastProvider` debe estar renderizado en `MainLayout` para que funcione
- Los tipos de toast son en mayúsculas: 'SUCCESS', 'ERROR', 'INFO', 'WARNING'

## Integración con Otros Hooks y Stores

Este hook se usa comúnmente junto con:
- **useAuth**: Para mostrar errores de autenticación
- **useMutation** (TanStack Query): Para mostrar resultados de mutaciones
- **useForm**: Para mostrar errores de validación del servidor
- **usePostStore**: Integrado automáticamente para mostrar notificaciones de CRUD de posts

## Ejemplo con TanStack Query

```tsx
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/shared/hooks/useToast';

function MyComponent() {
  const { showSuccess, showError } = useToast();
  
  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      showSuccess('Usuario creado exitosamente');
    },
    onError: (error) => {
      showError(error.message);
    },
  });
}
```

