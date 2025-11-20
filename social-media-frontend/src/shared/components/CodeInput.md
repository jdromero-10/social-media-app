# CodeInput.tsx - Documentación

## Descripción
Componente reutilizable para ingresar códigos de verificación de 6 dígitos. Proporciona una experiencia de usuario mejorada con movimiento automático del foco entre inputs y soporte para pegar códigos completos.

## Props

### `length?: number`
- **Tipo**: `number`
- **Requerido**: No
- **Valor por defecto**: `6`
- **Descripción**: Número de dígitos del código

### `value: string`
- **Tipo**: `string`
- **Requerido**: Sí
- **Descripción**: Valor actual del código (string de dígitos)
- **Ejemplo**: `"123456"`

### `onChange: (value: string) => void`
- **Tipo**: Función callback
- **Requerido**: Sí
- **Descripción**: Función que se llama cuando cambia el valor
- **Parámetros**: `value` - Nuevo valor del código

### `error?: string`
- **Tipo**: `string | undefined`
- **Requerido**: No
- **Descripción**: Mensaje de error a mostrar

### `disabled?: boolean`
- **Tipo**: `boolean`
- **Requerido**: No
- **Valor por defecto**: `false`
- **Descripción**: Si el componente está deshabilitado

### `autoFocus?: boolean`
- **Tipo**: `boolean`
- **Requerido**: No
- **Valor por defecto**: `false`
- **Descripción**: Si el primer input debe tener foco automáticamente

## Funcionalidades

### Movimiento Automático de Foco
- Al ingresar un dígito, el foco se mueve automáticamente al siguiente input
- Al presionar Backspace en un input vacío, el foco se mueve al input anterior
- Soporte para flechas izquierda/derecha para navegar entre inputs

### Pegar Código Completo
- Permite pegar un código completo desde el portapapeles
- Extrae automáticamente solo los números
- Limita a la longitud máxima del código
- Mueve el foco al último dígito ingresado

### Validación
- Solo acepta números (0-9)
- Rechaza caracteres no numéricos automáticamente
- Cada input solo acepta un carácter

## Estilos

### Inputs Individuales
- Tamaño: `w-12 h-14` en móvil, `w-14 h-16` en desktop
- Texto: `text-2xl sm:text-3xl font-bold` (grande y fácil de leer)
- Borde: `border-2` con colores según estado
- Estados:
  - Normal: `border-gray-300`
  - Focus: `border-[#00b1c0]` con ring cyan
  - Error: `border-red-500` con ring rojo

### Layout
- Inputs centrados con gap de `gap-2 sm:gap-3`
- Responsive: se adapta a móvil y desktop

## Ejemplo de Uso

```tsx
import { CodeInput } from '../../shared/components/CodeInput';
import { useState } from 'react';

function VerifyCodeForm() {
  const [code, setCode] = useState('');

  return (
    <CodeInput
      length={6}
      value={code}
      onChange={setCode}
      autoFocus
      error={code.length === 6 && !isValid ? 'Código inválido' : undefined}
    />
  );
}
```

## Accesibilidad

- Cada input tiene `aria-label` descriptivo: "Dígito X de Y"
- El mensaje de error tiene `role="alert"` para lectores de pantalla
- Soporte completo para navegación con teclado

## Mejoras Futuras

- Animación al completar el código
- Soporte para códigos alfanuméricos
- Modo oscuro
- Efectos visuales al ingresar dígitos

