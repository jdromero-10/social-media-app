# ConfirmModal.tsx - Documentación

## Descripción
Componente modal de confirmación reutilizable para acciones importantes o destructivas. Proporciona una interfaz consistente para confirmar acciones como eliminar, actualizar o realizar cambios críticos. Usa el componente `Modal` base y añade funcionalidad específica para confirmaciones.

## Características

- **Reutilizable**: Puede usarse para cualquier tipo de confirmación
- **Variantes**: Soporta diferentes estilos (danger, warning, info)
- **Estado de carga**: Muestra indicador de carga durante la acción
- **Personalizable**: Títulos, mensajes y textos de botones configurables
- **Accesible**: Usa el componente Modal base con todas sus características de accesibilidad

## Props

```tsx
interface ConfirmModalProps {
  isOpen: boolean;                    // Controla si el modal está abierto
  onClose: () => void;                 // Callback al cerrar el modal
  onConfirm: () => void | Promise<void>; // Callback al confirmar (puede ser async)
  title?: string;                      // Título del modal (default: "Confirmar acción")
  message: string;                     // Mensaje de confirmación (requerido)
  confirmText?: string;                // Texto del botón de confirmar (default: "Confirmar")
  cancelText?: string;                 // Texto del botón de cancelar (default: "Cancelar")
  variant?: 'danger' | 'warning' | 'info'; // Variante visual (default: "danger")
  isLoading?: boolean;                 // Estado de carga (default: false)
  closeOnOverlayClick?: boolean;       // Cerrar al hacer clic en overlay (default: false)
}
```

## Variantes

### Danger (Rojo)
- **Uso**: Para acciones destructivas como eliminar
- **Color**: Rojo (`text-red-600`)
- **Botón**: Variante `danger` (rojo)

### Warning (Amarillo)
- **Uso**: Para advertencias importantes
- **Color**: Amarillo (`text-yellow-600`)
- **Botón**: Variante `secondary` (gris)

### Info (Azul)
- **Uso**: Para confirmaciones informativas
- **Color**: Cyan (`text-[#00b1c0]` - cyan-600)
- **Botón**: Variante `primary` (azul)

## Uso Básico

```tsx
import { ConfirmModal } from '../../shared/components/ConfirmModal';
import { useState } from 'react';

const MyComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = async () => {
    // Realizar acción
    await deleteItem();
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Eliminar</button>
      
      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        message="¿Estás seguro de que deseas eliminar este elemento?"
        variant="danger"
      />
    </>
  );
};
```

## Uso con Estado de Carga

```tsx
const [isOpen, setIsOpen] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);

const handleConfirm = async () => {
  setIsDeleting(true);
  try {
    await deleteItem();
    setIsOpen(false);
  } finally {
    setIsDeleting(false);
  }
};

<ConfirmModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={handleConfirm}
  message="¿Estás seguro?"
  isLoading={isDeleting}
  closeOnOverlayClick={!isDeleting}
/>
```

## Ejemplo Completo: Eliminar Post

```tsx
import { useState } from 'react';
import { ConfirmModal } from '../../shared/components/ConfirmModal';

const HomePage = () => {
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenDeleteModal = (postId: string) => {
    setPostToDelete(postId);
    setIsDeleteModalOpen(true);
  };

  const handleDeletePost = async () => {
    if (!postToDelete) return;
    
    setIsDeleting(true);
    try {
      await deletePost(postToDelete);
      setIsDeleteModalOpen(false);
      setPostToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button onClick={() => handleOpenDeleteModal(post.id)}>
        Eliminar
      </button>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setPostToDelete(null);
        }}
        onConfirm={handleDeletePost}
        title="Eliminar Post"
        message="¿Estás seguro de que deseas eliminar este post? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
        closeOnOverlayClick={!isDeleting}
      />
    </>
  );
};
```

## Estructura Visual

```
┌─────────────────────────────────┐
│ Eliminar Post              [X]   │
├─────────────────────────────────┤
│  ⚠️  ¿Estás seguro de que      │
│     deseas eliminar este post?  │
│     Esta acción no se puede     │
│     deshacer.                   │
├─────────────────────────────────┤
│        [Cancelar]  [Eliminar]  │
└─────────────────────────────────┘
```

## Componentes Utilizados

- **Modal**: Componente base para la estructura del modal
- **Button**: Botones de acción (confirmar y cancelar)
- **AlertTriangle**: Icono de Lucide React para advertencia

## Comportamiento

### Al Confirmar
1. Se ejecuta `onConfirm` (puede ser async)
2. Si `isLoading` es true, los botones se deshabilitan
3. El modal se cierra cuando la acción se completa (manejado por el componente padre)

### Al Cancelar
1. Se ejecuta `onClose`
2. El modal se cierra inmediatamente
3. No se ejecuta ninguna acción

### Durante la Carga
- Los botones se deshabilitan
- El botón de confirmar muestra un spinner
- `closeOnOverlayClick` se desactiva automáticamente si `isLoading` es true
- No se puede cerrar con Escape si está cargando

## Mejores Prácticas

1. **Mensajes claros**: Usa mensajes descriptivos que expliquen la acción
2. **Variantes apropiadas**: Usa `danger` para acciones destructivas
3. **Estado de carga**: Siempre maneja el estado de carga para evitar múltiples clics
4. **Prevenir cierre accidental**: Usa `closeOnOverlayClick={false}` para acciones críticas
5. **Limpieza de estado**: Limpia el estado relacionado al cerrar el modal

## Accesibilidad

- Hereda todas las características de accesibilidad del componente `Modal` base
- Usa `role="dialog"` y `aria-modal="true"`
- Soporte para teclado (Escape para cerrar, cuando no está cargando)
- Focus management automático
- Contraste adecuado en todos los estados

## Notas Técnicas

- El componente usa `Modal` como base, por lo que hereda todas sus características
- El icono `AlertTriangle` cambia de color según la variante
- Los botones usan el componente `Button` global con las variantes apropiadas
- El callback `onConfirm` puede ser síncrono o asíncrono

## Mejoras Futuras

- Agregar más variantes (success, info personalizado)
- Soporte para iconos personalizados
- Animaciones de entrada/salida
- Soporte para acciones secundarias
- Historial de confirmaciones

