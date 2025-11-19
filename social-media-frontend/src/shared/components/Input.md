# Input.tsx - Documentación

## Descripción
Componente de input reutilizable con soporte para label, mensajes de error, texto de ayuda y todas las props nativas de un elemento `<input>` HTML. Está construido con Tailwind CSS y utiliza `forwardRef` para permitir el uso con React Hook Form.

## Props

### Props Extendidas
El componente extiende `InputHTMLAttributes<HTMLInputElement>`, por lo que acepta todas las props nativas de un input HTML como `type`, `placeholder`, `value`, `onChange`, `required`, etc.

### Props Personalizadas

#### `label?: string`
- **Tipo**: String (opcional)
- **Descripción**: Texto del label que aparece arriba del input
- **Uso**: Para identificar el campo en formularios
- **Ejemplo**: `<Input label="Email" />`

#### `error?: string`
- **Tipo**: String (opcional)
- **Descripción**: Mensaje de error que se muestra debajo del input
- **Efecto**: Cuando se proporciona, el input se muestra con borde rojo y el mensaje aparece en rojo
- **Uso**: Para mostrar errores de validación
- **Ejemplo**: `<Input error="El email es requerido" />`

#### `helperText?: string`
- **Tipo**: String (opcional)
- **Descripción**: Texto de ayuda que aparece debajo del input
- **Nota**: Solo se muestra si no hay error (los errores tienen prioridad)
- **Uso**: Para proporcionar instrucciones o información adicional
- **Ejemplo**: `<Input helperText="Ingresa tu email de registro" />`

#### `className?: string`
- **Tipo**: String
- **Default**: `''`
- **Descripción**: Clases CSS adicionales para personalización
- **Nota**: Se combinan con las clases base del componente

#### `id?: string`
- **Tipo**: String (opcional)
- **Descripción**: ID del input. Si no se proporciona, se genera automáticamente
- **Uso**: Útil para asociar el label con el input (se hace automáticamente)

## Estilos

### Clases Base del Input
- `w-full`: Ancho completo del contenedor
- `px-4 py-2.5`: Padding interno mejorado (padding vertical aumentado)
- `border rounded-lg`: Borde y esquinas redondeadas
- `transition-all duration-200`: Transiciones suaves para todos los cambios (mejorado)
- `focus:outline-none focus:ring-2 focus:ring-offset-0`: Estilos de focus
- `bg-white`: Fondo blanco explícito
- `text-gray-900 placeholder:text-gray-400`: Colores de texto y placeholder mejorados

### Estados

#### Estado Normal
- Borde: `border-gray-300`
- Hover: `hover:border-gray-400` (borde más oscuro al pasar el mouse) - **NUEVO**
- Focus ring: `ring-[#00dde5]` (cyan-500)
- Focus border: `border-[#00b1c0]` (cyan-600)

#### Estado de Error
- Borde: `border-red-500`
- Focus ring: `ring-red-500`
- Focus border: `border-red-500`

### Label
- `block text-sm font-medium text-gray-700 mb-1.5`
- Aparece arriba del input con un margen inferior mejorado (1.5 en lugar de 1)

### Mensajes
- **Error**: `text-sm text-red-600 font-medium` con `role="alert"` para accesibilidad (font-medium agregado)
- **Helper text**: `text-sm text-gray-500`
- **Espaciado**: `mt-1.5` para mejor separación visual (mejorado de `mt-1`)

## forwardRef

El componente usa `forwardRef` para permitir que React Hook Form (u otras librerías) puedan acceder directamente a la referencia del input. Esto es necesario para validación y manejo de formularios.

## Accesibilidad

### Atributos ARIA
- `aria-invalid`: Se establece en `'true'` cuando hay error, `'false'` en caso contrario
- `aria-describedby`: Se establece para asociar el input con el mensaje de error o helper text
- `role="alert"`: En el mensaje de error para que los lectores de pantalla lo anuncien

### Asociación Label-Input
- El label se asocia automáticamente con el input usando `htmlFor` y `id`
- Si no se proporciona un `id`, se genera uno único automáticamente

## Ejemplos de Uso

### Input básico
```tsx
<Input
  type="text"
  placeholder="Ingresa tu nombre"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

### Input con label
```tsx
<Input
  label="Email"
  type="email"
  placeholder="tu@email.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

### Input con error
```tsx
<Input
  label="Contraseña"
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  error="La contraseña debe tener al menos 8 caracteres"
/>
```

### Input con helper text
```tsx
<Input
  label="Username"
  type="text"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  helperText="Solo letras, números y guiones bajos"
/>
```

### Input con React Hook Form
```tsx
import { useForm } from 'react-hook-form';
import { Input } from '@/shared/components/Input';

function MyForm() {
  const { register, formState: { errors } } = useForm();

  return (
    <Input
      label="Email"
      type="email"
      {...register('email', { required: 'El email es requerido' })}
      error={errors.email?.message}
    />
  );
}
```

### Input con ref personalizado
```tsx
import { useRef } from 'react';
import { Input } from '@/shared/components/Input';

function MyComponent() {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <>
      <Input ref={inputRef} label="Nombre" />
      <button onClick={focusInput}>Focus input</button>
    </>
  );
}
```

## Generación de ID

Si no se proporciona un `id`, el componente genera uno automáticamente usando:
```typescript
`input-${Math.random().toString(36).substr(2, 9)}`
```

Esto garantiza que cada input tenga un ID único para asociación con el label.

## Mejoras Implementadas (2024)

- ✅ **Transiciones mejoradas**: Cambio de `transition-colors` a `transition-all duration-200` para transiciones más suaves
- ✅ **Hover effects**: Agregado `hover:border-gray-400` para mejor feedback visual
- ✅ **Padding mejorado**: Cambio de `py-2` a `py-2.5` para mejor proporción visual
- ✅ **Colores explícitos**: Agregado `bg-white`, `text-gray-900` y `placeholder:text-gray-400` para mejor control
- ✅ **Espaciado mejorado**: Labels y mensajes ahora usan `mb-1.5` y `mt-1.5` respectivamente
- ✅ **Tipografía mejorada**: Mensajes de error ahora usan `font-medium` para mejor legibilidad

## Notas Técnicas

- El componente usa `displayName` para facilitar el debugging en React DevTools
- Los mensajes de error y helper text tienen IDs únicos basados en el ID del input
- El helper text solo se muestra si no hay error (los errores tienen prioridad)
- Las clases se combinan usando `trim()` para limpiar espacios en blanco
- Las transiciones mejoradas (`transition-all`) proporcionan una experiencia de usuario más fluida

