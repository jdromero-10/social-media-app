# PasswordInput.tsx - Documentación

## Descripción
Componente de input de contraseña reutilizable con funcionalidad de toggle de visibilidad. Permite a los usuarios mostrar u ocultar la contraseña haciendo clic en un icono de ojo. Está construido con Tailwind CSS, utiliza iconos de Lucide React (`Eye` y `EyeOff`), y usa `forwardRef` para permitir el uso con React Hook Form.

## Características Principales

- **Toggle de Visibilidad**: Botón con icono que alterna entre mostrar y ocultar la contraseña
- **Iconos Dinámicos**: Usa `Eye` cuando la contraseña está oculta y `EyeOff` cuando está visible
- **Estado Local**: Gestiona la visibilidad con `useState` dentro del componente
- **Compatibilidad con React Hook Form**: Usa `forwardRef` para integración perfecta
- **Estilos Consistentes**: Mantiene el mismo diseño visual que el componente `Input` base
- **Accesibilidad**: Incluye aria-labels y roles apropiados

## Props

### Props Extendidas
El componente extiende `InputHTMLAttributes<HTMLInputElement>` (excepto `type`), por lo que acepta todas las props nativas de un input HTML como `placeholder`, `value`, `onChange`, `required`, etc. **Nota**: El `type` está excluido porque el componente siempre maneja `type="password"` o `type="text"` internamente.

### Props Personalizadas

#### `label?: string`
- **Tipo**: String (opcional)
- **Descripción**: Texto del label que aparece arriba del input
- **Uso**: Para identificar el campo en formularios
- **Ejemplo**: `<PasswordInput label="Contraseña" />`

#### `error?: string`
- **Tipo**: String (opcional)
- **Descripción**: Mensaje de error que se muestra debajo del input
- **Efecto**: Cuando se proporciona, el input se muestra con borde rojo y el mensaje aparece en rojo
- **Uso**: Para mostrar errores de validación
- **Ejemplo**: `<PasswordInput error="La contraseña debe tener al menos 6 caracteres" />`

#### `helperText?: string`
- **Tipo**: String (opcional)
- **Descripción**: Texto de ayuda que aparece debajo del input
- **Nota**: Solo se muestra si no hay error (los errores tienen prioridad)
- **Uso**: Para proporcionar instrucciones o información adicional
- **Ejemplo**: `<PasswordInput helperText="Mínimo 8 caracteres con mayúsculas y números" />`

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
- `px-4 py-2.5 pr-10`: Padding interno (padding-right aumentado para el icono)
- `border rounded-lg`: Borde y esquinas redondeadas
- `transition-all duration-200`: Transiciones suaves para todos los cambios
- `focus:outline-none focus:ring-2 focus:ring-offset-0`: Estilos de focus
- `bg-white`: Fondo blanco
- `text-gray-900 placeholder:text-gray-400`: Colores de texto y placeholder

### Estados

#### Estado Normal
- Borde: `border-gray-300`
- Hover: `hover:border-gray-400` (borde más oscuro al pasar el mouse)
- Focus ring: `ring-[#00dde5]` (cyan-500)
- Focus border: `border-[#00b1c0]` (cyan-600)

#### Estado de Error
- Borde: `border-red-500`
- Focus ring: `ring-red-500`
- Focus border: `border-red-500`

### Botón de Toggle
- Posición: `absolute right-3 top-1/2 -translate-y-1/2` (centrado verticalmente)
- Estilos: `text-gray-500 hover:text-gray-700`
- Hover background: `hover:bg-gray-100`
- Padding: `p-1.5` para área de clic cómoda
- Transiciones: `transition-colors` para cambios suaves

### Label
- `block text-sm font-medium text-gray-700 mb-1.5`
- Aparece arriba del input con un margen inferior de 1.5

### Mensajes
- **Error**: `text-sm text-red-600` con `role="alert"` para accesibilidad
- **Helper text**: `text-sm text-gray-500`

## Estado Interno

El componente usa `useState` para gestionar la visibilidad de la contraseña:

```typescript
const [showPassword, setShowPassword] = useState(false);
```

- `showPassword`: Boolean que indica si la contraseña está visible
- `setShowPassword`: Función para alternar el estado
- **Inicial**: `false` (contraseña oculta por defecto)

## Toggle de Visibilidad

La función `togglePasswordVisibility` alterna el estado:

```typescript
const togglePasswordVisibility = () => {
  setShowPassword((prev) => !prev);
};
```

El tipo del input cambia dinámicamente:
- `type={showPassword ? 'text' : 'password'}`

## Iconos

El componente utiliza iconos de **Lucide React**:

- **Eye**: Se muestra cuando `showPassword` es `false` (contraseña oculta)
- **EyeOff**: Se muestra cuando `showPassword` es `true` (contraseña visible)

Ambos iconos tienen:
- Tamaño: `h-5 w-5`
- Color: Hereda del color del botón (gris por defecto)

## forwardRef

El componente usa `forwardRef` para permitir que React Hook Form (u otras librerías) puedan acceder directamente a la referencia del input. Esto es necesario para validación y manejo de formularios.

## Accesibilidad

### Atributos ARIA
- `aria-invalid`: Se establece en `'true'` cuando hay error, `'false'` en caso contrario
- `aria-describedby`: Se establece para asociar el input con el mensaje de error o helper text
- `aria-label`: En el botón de toggle con texto descriptivo ("Mostrar contraseña" / "Ocultar contraseña")
- `role="alert"`: En el mensaje de error para que los lectores de pantalla lo anuncien

### Asociación Label-Input
- El label se asocia automáticamente con el input usando `htmlFor` y `id`
- Si no se proporciona un `id`, se genera uno único automáticamente

### Navegación por Teclado
- El botón de toggle tiene `tabIndex={-1}` para evitar que reciba foco en la navegación por teclado (el input es el elemento principal)
- El botón sigue siendo accesible mediante clic del mouse

## Ejemplos de Uso

### PasswordInput básico
```tsx
<PasswordInput
  label="Contraseña"
  placeholder="••••••••"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
```

### PasswordInput con error
```tsx
<PasswordInput
  label="Contraseña"
  placeholder="••••••••"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  error="La contraseña debe tener al menos 8 caracteres"
/>
```

### PasswordInput con helper text
```tsx
<PasswordInput
  label="Nueva Contraseña"
  placeholder="••••••••"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  helperText="Mínimo 8 caracteres, incluye mayúsculas y números"
/>
```

### PasswordInput con React Hook Form
```tsx
import { useForm } from 'react-hook-form';
import { PasswordInput } from '@/shared/components/PasswordInput';

function LoginForm() {
  const { register, formState: { errors } } = useForm();

  return (
    <PasswordInput
      label="Contraseña"
      placeholder="••••••••"
      {...register('password', { required: 'La contraseña es requerida' })}
      error={errors.password?.message}
    />
  );
}
```

### PasswordInput con validación Yup
```tsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { PasswordInput } from '@/shared/components/PasswordInput';

const schema = yup.object({
  password: yup
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida'),
});

function MyForm() {
  const { register, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <PasswordInput
      label="Contraseña"
      placeholder="••••••••"
      {...register('password')}
      error={errors.password?.message}
    />
  );
}
```

### PasswordInput con ref personalizado
```tsx
import { useRef } from 'react';
import { PasswordInput } from '@/shared/components/PasswordInput';

function MyComponent() {
  const passwordRef = useRef<HTMLInputElement>(null);

  const focusPassword = () => {
    passwordRef.current?.focus();
  };

  return (
    <>
      <PasswordInput ref={passwordRef} label="Contraseña" />
      <button onClick={focusPassword}>Focus password</button>
    </>
  );
}
```

## Generación de ID

Si no se proporciona un `id`, el componente genera uno automáticamente usando:
```typescript
`password-input-${Math.random().toString(36).substr(2, 9)}`
```

Esto garantiza que cada input tenga un ID único para asociación con el label.

## Diferencias con Input

Aunque `PasswordInput` está basado en `Input`, tiene las siguientes diferencias:

1. **Tipo de Input**: Siempre maneja `type="password"` o `type="text"` internamente
2. **Padding Derecho**: Tiene `pr-10` para hacer espacio al icono de toggle
3. **Botón de Toggle**: Incluye un botón con iconos Eye/EyeOff
4. **Estado Interno**: Gestiona la visibilidad con `useState`
5. **Dependencia**: Requiere `lucide-react` para los iconos

## Notas Técnicas

- El componente usa `displayName` para facilitar el debugging en React DevTools
- Los mensajes de error y helper text tienen IDs únicos basados en el ID del input
- El helper text solo se muestra si no hay error (los errores tienen prioridad)
- Las clases se combinan usando `trim()` para limpiar espacios en blanco
- El botón de toggle no interfiere con el funcionamiento normal del input
- El estado de visibilidad se resetea cuando el componente se desmonta (comportamiento estándar de React)
- **Import type**: `InputHTMLAttributes` se importa como tipo usando `import type` para cumplir con `verbatimModuleSyntax` de TypeScript

## Mejoras Implementadas (2024)

- ✅ Toggle de visibilidad con iconos Eye/EyeOff de Lucide React
- ✅ Estado local con `useState` para gestionar visibilidad
- ✅ Estilos mejorados con transiciones suaves
- ✅ Mejor accesibilidad con aria-labels descriptivos
- ✅ Hover effects en el botón de toggle
- ✅ Padding ajustado para acomodar el icono
- ✅ Compatibilidad completa con React Hook Form

