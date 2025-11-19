# utils.ts - Documentación

## Descripción
Este archivo contiene utilidades generales para la aplicación. Actualmente incluye la función `cn()` que es esencial para combinar clases de Tailwind CSS de manera inteligente, especialmente útil cuando se trabaja con shadcn/ui o cuando necesitas combinar clases condicionalmente.

## Función Exportada

### `cn(...inputs: ClassValue[]): string`

#### Descripción
Combina clases de Tailwind CSS de manera inteligente. Esta función es una combinación de `clsx` (para manejar clases condicionales) y `twMerge` (para resolver conflictos entre clases de Tailwind).

#### Parámetros
- `...inputs: ClassValue[]` - Argumentos variables que pueden ser:
  - Strings: Clases CSS normales
  - Objetos: Clases condicionales `{ 'clase': condicion }`
  - Arrays: Arrays de clases
  - `null` o `undefined`: Se ignoran automáticamente

#### Retorna
- `string` - Cadena de clases CSS combinadas y optimizadas

#### Características

1. **Combina clases condicionales**: Usa `clsx` para manejar objetos y arrays
2. **Resuelve conflictos**: Usa `twMerge` para eliminar clases conflictivas de Tailwind
3. **Ignora valores falsy**: `null`, `undefined`, `false` se ignoran automáticamente

#### Ejemplo de Uso

##### Uso Básico
```tsx
import { cn } from '@/lib/utils';

const className = cn('base-class', 'another-class');
// Resultado: 'base-class another-class'
```

##### Con Clases Condicionales
```tsx
const isActive = true;
const className = cn('btn', {
  'btn-active': isActive,
  'btn-disabled': !isActive
});
// Resultado: 'btn btn-active'
```

##### Resolviendo Conflictos de Tailwind
```tsx
// Sin cn(): Las clases conflictivas se mantienen
const className = 'p-4 p-6'; // Ambas clases se aplican (conflicto)

// Con cn(): Se resuelve el conflicto, gana la última
const className = cn('p-4', 'p-6');
// Resultado: 'p-6' (solo la última, que es más específica)
```

##### Ejemplo Real con Componente
```tsx
import { cn } from '@/lib/utils';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  className?: string;
}

function Button({ variant = 'primary', className }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded', // Clases base
        {
          'bg-blue-500 text-white': variant === 'primary',
          'bg-gray-200 text-gray-800': variant === 'secondary',
        },
        className // Clases adicionales del usuario
      )}
    >
      Click me
    </button>
  );
}
```

##### Con Props de Componentes
```tsx
import { cn } from '@/lib/utils';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-md p-6', // Clases base
        className // Permite personalización desde fuera
      )}
    >
      {children}
    </div>
  );
}

// Uso:
<Card className="border-2 border-blue-500">
  Contenido
</Card>
```

## Dependencias

### `clsx`
- **Propósito**: Maneja la combinación de clases condicionales
- **Uso**: Convierte objetos y arrays en strings de clases
- **Ejemplo**: `clsx({ 'active': true, 'disabled': false })` → `'active'`

### `twMerge`
- **Propósito**: Resuelve conflictos entre clases de Tailwind CSS
- **Uso**: Elimina clases conflictivas, manteniendo la más específica
- **Ejemplo**: `twMerge('p-4 p-6')` → `'p-6'`

## Por qué es Necesario

### Problema sin `cn()`

```tsx
// ❌ Problema: Clases conflictivas
<div className={`p-4 ${isActive ? 'p-6' : ''}`}>
  {/* p-4 y p-6 se aplican ambas, causando conflicto */}
</div>

// ❌ Problema: Código verboso
<div className={[
  'base-class',
  condition1 ? 'class-1' : '',
  condition2 ? 'class-2' : '',
  className
].filter(Boolean).join(' ')}>
```

### Solución con `cn()`

```tsx
// ✅ Limpio y resuelve conflictos
<div className={cn('p-4', { 'p-6': isActive })}>
  {/* Solo se aplica p-6 si isActive es true */}
</div>
```

## Casos de Uso Comunes

### 1. Componentes con Variantes
```tsx
function Badge({ variant, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'px-2 py-1 rounded text-sm',
        {
          'bg-red-100 text-red-800': variant === 'error',
          'bg-green-100 text-green-800': variant === 'success',
          'bg-blue-100 text-blue-800': variant === 'info',
        },
        className
      )}
    >
      Badge
    </span>
  );
}
```

### 2. Estados de Componentes
```tsx
function Button({ disabled, loading, className }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded',
        {
          'opacity-50 cursor-not-allowed': disabled || loading,
          'hover:bg-blue-600': !disabled && !loading,
        },
        className
      )}
      disabled={disabled || loading}
    >
      {loading ? 'Cargando...' : 'Enviar'}
    </button>
  );
}
```

### 3. Personalización desde Props
```tsx
function Container({ className, children }: ContainerProps) {
  return (
    <div
      className={cn(
        'max-w-7xl mx-auto px-4', // Clases base
        className // Permite override desde fuera
      )}
    >
      {children}
    </div>
  );
}
```

## Integración con shadcn/ui

Esta función es esencial cuando usas componentes de shadcn/ui, ya que todos los componentes de shadcn/ui aceptan `className` como prop y usan `cn()` internamente para combinar clases.

```tsx
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/lib/utils';

<Button className={cn('w-full', { 'mt-4': showMargin })}>
  Click me
</Button>
```

## Notas Técnicas

- La función es una composición de `twMerge(clsx(...inputs))`
- `clsx` se ejecuta primero para combinar todas las clases
- `twMerge` se ejecuta después para resolver conflictos de Tailwind
- Es completamente type-safe gracias a TypeScript
- No tiene efectos secundarios, es una función pura

## Instalación

Las dependencias ya están instaladas en el proyecto:
- `clsx`: Para combinar clases condicionales
- `tailwind-merge`: Para resolver conflictos de Tailwind

Si necesitas instalarlas en otro proyecto:
```bash
npm install clsx tailwind-merge
```

## Referencias

- [clsx Documentation](https://github.com/lukeed/clsx)
- [tailwind-merge Documentation](https://github.com/dcastil/tailwind-merge)
- [shadcn/ui Utils](https://ui.shadcn.com/docs/installation#add-cn-helper)

