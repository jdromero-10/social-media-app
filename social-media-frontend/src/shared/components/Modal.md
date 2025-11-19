# Modal.tsx - Documentación

## Descripción
Componente de modal (ventana emergente) **reutilizable y global** con overlay semitransparente, header, body y footer opcionales. Incluye funcionalidades como cerrar con tecla Escape, cerrar al hacer click en el overlay, y prevención de scroll del body. El overlay tiene una opacidad del 40% con efecto de desenfoque sutil para una mejor experiencia visual. Está construido con Tailwind CSS y sigue mejores prácticas de accesibilidad.

**Este componente es global y debe usarse en toda la aplicación para mantener consistencia visual.**

## Props

### `isOpen: boolean` (requerido)
- **Tipo**: Boolean
- **Descripción**: Controla si el modal está visible o no
- **Uso**: Debe ser manejado por el componente padre (usualmente con useState)
- **Ejemplo**: `<Modal isOpen={showModal} onClose={() => setShowModal(false)}>`

### `onClose: () => void` (requerido)
- **Tipo**: Función sin parámetros
- **Descripción**: Función que se ejecuta cuando el modal debe cerrarse
- **Uso**: Actualiza el estado `isOpen` a `false`
- **Ejemplo**: `onClose={() => setIsOpen(false)}`

### `title?: string`
- **Tipo**: String (opcional)
- **Descripción**: Título que aparece en el header del modal
- **Efecto**: Si se proporciona, crea un header con el título y un botón de cerrar
- **Ejemplo**: `<Modal title="Confirmar acción">`

### `children: ReactNode` (requerido)
- **Tipo**: ReactNode
- **Descripción**: Contenido principal del modal (body)
- **Ejemplo**: `<Modal>Contenido del modal</Modal>`

### `footer?: ReactNode`
- **Tipo**: ReactNode (opcional)
- **Descripción**: Contenido que aparece en el footer del modal
- **Uso**: Útil para botones de acción (Confirmar, Cancelar, etc.)
- **Ejemplo**: `<Modal footer={<Button>Confirmar</Button>}>`

### `size?: 'sm' | 'md' | 'lg' | 'xl'`
- **Tipo**: String literal union
- **Default**: `'md'`
- **Descripción**: Tamaño máximo del ancho del modal
- **Opciones**:
  - `sm`: Pequeño (`max-w-sm` - ~384px)
  - `md`: Mediano (`max-w-md` - ~448px) - por defecto
  - `lg`: Grande (`max-w-lg` - ~512px)
  - `xl`: Extra grande (`max-w-xl` - ~576px)
- **Ejemplo**: `<Modal size="lg">`

### `closeOnOverlayClick?: boolean`
- **Tipo**: Boolean
- **Default**: `true`
- **Descripción**: Si es `true`, el modal se cierra al hacer click en el overlay (fondo oscuro)
- **Uso**: Útil para modales informativos. Para modales críticos (como confirmaciones), puedes ponerlo en `false`
- **Ejemplo**: `<Modal closeOnOverlayClick={false}>`

### `closeOnEscape?: boolean`
- **Tipo**: Boolean
- **Default**: `true`
- **Descripción**: Si es `true`, el modal se cierra al presionar la tecla Escape
- **Uso**: Comportamiento estándar de modales. Puedes deshabilitarlo si necesitas que el usuario complete una acción
- **Ejemplo**: `<Modal closeOnEscape={false}>`

## Funcionalidades

### Cerrar con Tecla Escape
- Se agrega un event listener para la tecla `Escape`
- Solo funciona cuando `closeOnEscape` es `true` y el modal está abierto
- Se limpia automáticamente cuando el modal se cierra o se desmonta

### Prevención de Scroll
- Cuando el modal está abierto, se establece `document.body.style.overflow = 'hidden'`
- Esto previene que el usuario haga scroll en la página de fondo
- Se restaura automáticamente cuando el modal se cierra

### Overlay Click
- El overlay (fondo semitransparente con opacidad del 40%) puede cerrar el modal si `closeOnOverlayClick` es `true`
- El contenido del modal tiene `stopPropagation` para evitar que se cierre al hacer click dentro
- El overlay incluye un efecto de desenfoque (`backdrop-blur-sm`) para mejorar la separación visual entre el modal y el contenido de fondo

## Estructura Visual

```
┌─────────────────────────────────┐
│  Overlay (fondo oscuro)         │
│  ┌───────────────────────────┐  │
│  │ Header (título + cerrar X) │  │
│  ├───────────────────────────┤  │
│  │                           │  │
│  │  Body (children)          │  │
│  │  (scrollable si es largo) │  │
│  │                           │  │
│  ├───────────────────────────┤  │
│  │ Footer (opcional)         │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

## Estilos

### Contenedor Principal
- `fixed inset-0`: Cubre toda la pantalla
- `z-50`: Z-index alto para estar sobre otros elementos
- `flex items-center justify-center`: Centra el modal
- `p-4`: Padding para evitar que toque los bordes en móviles

### Overlay
- `absolute inset-0`: Cubre toda la pantalla
- `bg-black/40`: Fondo negro con 40% de opacidad (sutil, no completamente negro)
- `backdrop-blur-sm`: Efecto de desenfoque sutil en el fondo
- `transition-opacity`: Transición suave al abrir/cerrar

### Modal Content
- `relative`: Para posicionar elementos internos
- `bg-white rounded-lg shadow-xl`: Estilo de tarjeta elevada
- `max-h-[90vh]`: Altura máxima del 90% de la ventana
- `overflow-hidden flex flex-col`: Layout flexbox vertical

### Header
- `px-6 py-4`: Padding
- `border-b`: Borde inferior
- Botón cerrar: Icono X con hover y focus states

### Body
- `px-6 py-4`: Padding
- `overflow-y-auto`: Scroll vertical si el contenido es largo
- `flex-1`: Ocupa el espacio disponible

### Footer
- `px-6 py-4`: Padding
- `border-t`: Borde superior
- `bg-gray-50`: Fondo gris claro

## Accesibilidad

### Atributos ARIA
- `role="dialog"`: Indica que es un diálogo modal
- `aria-modal="true"`: Indica que es un modal (bloquea interacción con el fondo)
- `aria-labelledby`: Asocia el modal con su título (si existe)
- `aria-label="Cerrar modal"`: Label para el botón de cerrar

### Navegación por Teclado
- Tecla `Escape` cierra el modal
- El botón de cerrar es focusable y se puede activar con Enter/Space

### Focus Management
- **Nota**: Este componente no maneja el focus automáticamente. Para una mejor accesibilidad, considera:
  - Enfocar el modal cuando se abre
  - Devolver el focus al elemento que abrió el modal cuando se cierra
  - Atrapar el focus dentro del modal (TAB no sale del modal)

## Uso Global y Reutilizable

Este componente Modal está diseñado para ser **reutilizable en toda la aplicación**. Debe importarse desde `shared/components`:

```tsx
import { Modal } from '../../shared/components/Modal';
// o
import { Modal } from '../../shared/components';
```

**Ventajas de usar este componente global:**
- ✅ Consistencia visual en toda la aplicación
- ✅ Overlay con opacidad del 40% y efecto de desenfoque
- ✅ Comportamiento uniforme (Escape, overlay click, etc.)
- ✅ Accesibilidad estándar
- ✅ Fácil mantenimiento (cambios en un solo lugar)

**Casos de uso comunes:**
- Formularios de creación/edición
- Confirmaciones de acciones
- Información adicional
- Alertas y notificaciones
- Cualquier contenido que requiera atención del usuario

## Ejemplos de Uso

### Modal básico
```tsx
const [isOpen, setIsOpen] = useState(false);

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <p>Contenido del modal</p>
</Modal>
```

### Modal con título
```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirmar acción"
>
  <p>¿Estás seguro de que quieres continuar?</p>
</Modal>
```

### Modal con footer
```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Eliminar item"
  footer={
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancelar
      </Button>
      <Button variant="danger" onClick={handleDelete}>
        Eliminar
      </Button>
    </div>
  }
>
  <p>Esta acción no se puede deshacer.</p>
</Modal>
```

### Modal de tamaño grande
```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Formulario"
  size="lg"
>
  <div className="space-y-4">
    <Input label="Nombre" />
    <Input label="Email" />
  </div>
</Modal>
```

### Modal que no se cierra con overlay
```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Acción crítica"
  closeOnOverlayClick={false}
  closeOnEscape={false}
>
  <p>Debes completar esta acción antes de continuar.</p>
</Modal>
```

## Notas Técnicas

- El modal no se renderiza en el DOM cuando `isOpen` es `false` (usando early return)
- Los event listeners se limpian correctamente en el cleanup de useEffect
- El `stopPropagation` en el contenido previene cierres accidentales
- El scroll del body se restaura incluso si el componente se desmonta inesperadamente

## Mejoras Futuras

Para una mejor accesibilidad, considera agregar:
1. **Focus trap**: Atrapar el focus dentro del modal
2. **Focus inicial**: Enfocar el primer elemento interactivo al abrir
3. **Focus restoration**: Devolver el focus al elemento que abrió el modal
4. **Portal**: Renderizar el modal en un portal (fuera del árbol DOM normal)

