# Button.tsx - Documentación

## Descripción
Componente de botón reutilizable con múltiples variantes, tamaños y estados. Está construido con Tailwind CSS y soporta todas las props nativas de un elemento `<button>` HTML, además de props personalizadas para estilos y estados de carga.

## Props

### Props Extendidas
El componente extiende `ButtonHTMLAttributes<HTMLButtonElement>`, por lo que acepta todas las props nativas de un botón HTML como `onClick`, `type`, `form`, etc.

### Props Personalizadas

#### `children: ReactNode` (requerido)
- **Tipo**: ReactNode
- **Descripción**: Contenido del botón (texto, iconos, etc.)
- **Ejemplo**: `<Button>Click me</Button>`

#### `variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'purple'`
- **Tipo**: String literal union
- **Default**: `'primary'`
- **Descripción**: Estilo visual del botón
- **Opciones**:
  - `primary`: Botón azul (estilo principal)
  - `secondary`: Botón gris
  - `danger`: Botón rojo (para acciones destructivas)
  - `outline`: Botón con borde y fondo transparente
  - `purple`: Botón violeta (usado en formularios de autenticación)
- **Ejemplo**: `<Button variant="purple">Iniciar sesión</Button>`

#### `size?: 'sm' | 'md' | 'lg'`
- **Tipo**: String literal union
- **Default**: `'md'`
- **Descripción**: Tamaño del botón
- **Opciones**:
  - `sm`: Pequeño (padding reducido, texto pequeño)
  - `md`: Mediano (tamaño estándar)
  - `lg`: Grande (padding aumentado, texto grande)
- **Ejemplo**: `<Button size="lg">Grande</Button>`

#### `isLoading?: boolean`
- **Tipo**: Boolean
- **Default**: `false`
- **Descripción**: Muestra un spinner y deshabilita el botón cuando está cargando
- **Uso**: Útil para indicar que una operación asíncrona está en progreso
- **Ejemplo**: `<Button isLoading={isSubmitting}>Enviar</Button>`

#### `fullWidth?: boolean`
- **Tipo**: Boolean
- **Default**: `false`
- **Descripción**: Hace que el botón ocupe el 100% del ancho disponible
- **Uso**: Útil para botones en formularios o modales
- **Ejemplo**: `<Button fullWidth>Enviar formulario</Button>`

#### `className?: string`
- **Tipo**: String
- **Default**: `''`
- **Descripción**: Clases CSS adicionales para personalización
- **Nota**: Se combinan con las clases base del componente

## Estilos

### Clases Base
- `inline-flex items-center justify-center`: Layout flexbox centrado
- `font-medium rounded-lg`: Tipografía y bordes redondeados
- `transition-all duration-200`: Transición suave para todos los cambios (mejorado)
- `focus:outline-none focus:ring-2 focus:ring-offset-2`: Estilos de focus accesibles
- `disabled:opacity-50 disabled:cursor-not-allowed`: Estilos para estado deshabilitado
- `shadow-sm hover:shadow-md`: Sombras para efecto de elevación (NUEVO)
- `active:scale-[0.98]`: Efecto de presión al hacer clic (NUEVO)

### Variantes de Color

#### Primary (Cyan/Aqua)
- Fondo: `bg-[#00b1c0]` (cyan-600)
- Hover: `bg-[#038c9b]` (cyan-700)
- Active: `active:bg-[#0d6f7d]` (cyan-800)
- Focus ring: `ring-[#00dde5]` (cyan-500)

#### Secondary (Gris)
- Fondo: `bg-gray-600`
- Hover: `bg-gray-700`
- Active: `active:bg-gray-800` (NUEVO)
- Focus ring: `ring-gray-500`

#### Danger (Rojo)
- Fondo: `bg-red-600`
- Hover: `bg-red-700`
- Active: `active:bg-red-800` (NUEVO)
- Focus ring: `ring-red-500`

#### Outline
- Borde: `border-2 border-[#00b1c0]` (cyan-600)
- Texto: `text-[#00b1c0]` (cyan-600)
- Fondo: `bg-white` (NUEVO - fondo explícito)
- Hover: `bg-[#eafffd]` (cyan-50)
- Active: `active:bg-[#cbfffb]` (NUEVO - cyan-100)
- Focus ring: `ring-[#00dde5]` (cyan-500)

#### Purple (Violeta)
- Fondo: `bg-violet-600`
- Hover: `bg-violet-700`
- Active: `active:bg-violet-800`
- Focus ring: `ring-violet-500`
- **Uso**: Formularios de autenticación (Login y Register)

### Tamaños

#### Small (sm)
- Padding: `px-3 py-1.5`
- Texto: `text-sm`

#### Medium (md)
- Padding: `px-5 py-2.5` (mejorado - padding aumentado)
- Texto: `text-base`

#### Large (lg)
- Padding: `px-6 py-3`
- Texto: `text-lg`

## Spinner de Carga

Cuando `isLoading` es `true`, se muestra un spinner animado (SVG) antes del contenido del botón. El spinner usa la clase `animate-spin` de Tailwind CSS.

## Ejemplos de Uso

### Botón básico
```tsx
<Button onClick={handleClick}>Click me</Button>
```

### Botón con variante
```tsx
<Button variant="danger" onClick={handleDelete}>
  Eliminar
</Button>
```

### Botón con estado de carga
```tsx
<Button isLoading={isSubmitting} onClick={handleSubmit}>
  Enviar
</Button>
```

### Botón de ancho completo
```tsx
<Button fullWidth onClick={handleSubmit}>
  Enviar formulario
</Button>
```

### Botón pequeño con outline
```tsx
<Button variant="outline" size="sm" onClick={handleCancel}>
  Cancelar
</Button>
```

### Botón deshabilitado
```tsx
<Button disabled onClick={handleClick}>
  No disponible
</Button>
```

### Combinando props
```tsx
<Button
  variant="primary"
  size="lg"
  fullWidth
  isLoading={isLoading}
  onClick={handleSubmit}
>
  Guardar cambios
</Button>
```

## Accesibilidad

- Soporta navegación por teclado (Tab, Enter, Space)
- Incluye estilos de focus visibles para usuarios de teclado
- Se deshabilita automáticamente cuando `isLoading` es `true`
- Respeta el atributo `disabled` nativo del HTML

## Mejoras Implementadas (2024)

- ✅ **Transiciones mejoradas**: Cambio de `transition-colors` a `transition-all duration-200` para animaciones más fluidas
- ✅ **Sombras dinámicas**: Agregado `shadow-sm` base y `hover:shadow-md` para efecto de elevación
- ✅ **Efecto de presión**: Agregado `active:scale-[0.98]` para feedback táctil al hacer clic
- ✅ **Estados active**: Agregados estados `active:bg-*` para todas las variantes
- ✅ **Padding mejorado**: Cambio de `px-4 py-2` a `px-5 py-2.5` en tamaño mediano
- ✅ **Fondo explícito**: Agregado `bg-white` a la variante outline para mejor contraste

## Notas Técnicas

- El componente usa `trim()` para limpiar espacios en blanco de las clases combinadas
- Las clases de Tailwind se combinan de forma que las personalizadas (`className`) pueden sobrescribir las base si es necesario
- El spinner es un SVG inline para evitar dependencias externas
- El efecto `active:scale-[0.98]` proporciona feedback visual inmediato al hacer clic
- Las sombras mejoran la percepción de profundidad y jerarquía visual

