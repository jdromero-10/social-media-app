# Form.tsx - Documentación

## Descripción
Componente wrapper para formularios HTML que proporciona estilos consistentes y espaciado entre campos. Es un componente simple pero útil para mantener la consistencia visual en todos los formularios de la aplicación.

## Props

### Props Extendidas
El componente extiende `FormHTMLAttributes<HTMLFormElement>`, por lo que acepta todas las props nativas de un elemento `<form>` HTML como `action`, `method`, `encType`, etc.

### Props Personalizadas

#### `children: ReactNode` (requerido)
- **Tipo**: ReactNode
- **Descripción**: Contenido del formulario (inputs, botones, etc.)
- **Ejemplo**: `<Form>Contenido del formulario</Form>`

#### `onSubmit: (e: React.FormEvent<HTMLFormElement>) => void` (requerido)
- **Tipo**: Función que recibe el evento de submit
- **Descripción**: Función que se ejecuta cuando se envía el formulario
- **Nota**: Debes prevenir el comportamiento por defecto si es necesario (`e.preventDefault()`)
- **Ejemplo**: `onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}`

#### `className?: string`
- **Tipo**: String
- **Default**: `''`
- **Descripción**: Clases CSS adicionales para personalización
- **Nota**: Se combinan con las clases base del componente

## Estilos

### Clases Base
- `space-y-5`: Agrega espaciado vertical (`1.25rem` / `20px`) entre elementos hijos (mejorado de `space-y-4`)
- Esto crea un espaciado consistente y más generoso entre campos del formulario automáticamente

## Ejemplos de Uso

### Formulario básico
```tsx
<Form onSubmit={(e) => {
  e.preventDefault();
  handleSubmit();
}}>
  <Input label="Email" type="email" />
  <Input label="Contraseña" type="password" />
  <Button type="submit">Enviar</Button>
</Form>
```

### Formulario con React Hook Form
```tsx
import { useForm } from 'react-hook-form';
import { Form } from '@/shared/components/Form';
import { Input } from '@/shared/components/Input';
import { Button } from '@/shared/components/Button';

function MyForm() {
  const { handleSubmit, register, formState: { errors } } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Nombre"
        {...register('name', { required: 'El nombre es requerido' })}
        error={errors.name?.message}
      />
      <Input
        label="Email"
        type="email"
        {...register('email', { required: 'El email es requerido' })}
        error={errors.email?.message}
      />
      <Button type="submit">Enviar</Button>
    </Form>
  );
}
```

### Formulario con clases personalizadas
```tsx
<Form
  onSubmit={handleSubmit}
  className="max-w-md mx-auto"
>
  <Input label="Campo 1" />
  <Input label="Campo 2" />
  <Button type="submit">Enviar</Button>
</Form>
```

### Formulario con múltiples secciones
```tsx
<Form onSubmit={handleSubmit}>
  <div>
    <h3 className="text-lg font-semibold mb-2">Información Personal</h3>
    <Input label="Nombre" />
    <Input label="Apellido" />
  </div>
  
  <div>
    <h3 className="text-lg font-semibold mb-2">Información de Contacto</h3>
    <Input label="Email" type="email" />
    <Input label="Teléfono" type="tel" />
  </div>
  
  <Button type="submit">Guardar</Button>
</Form>
```

## Ventajas

1. **Consistencia**: Todos los formularios tienen el mismo espaciado
2. **Simplicidad**: No necesitas agregar `space-y-4` manualmente en cada formulario
3. **Extensibilidad**: Puedes agregar más estilos base en el futuro
4. **Compatibilidad**: Funciona perfectamente con React Hook Form y otras librerías

## Mejoras Implementadas (2024)

- ✅ **Espaciado mejorado**: Cambio de `space-y-4` (16px) a `space-y-5` (20px) para mejor separación visual entre campos
- ✅ **Mejor legibilidad**: El espaciado aumentado mejora la legibilidad y reduce la fatiga visual

## Notas Técnicas

- El componente es muy simple y actúa principalmente como un wrapper con estilos
- El `space-y-5` de Tailwind solo funciona con elementos hijos directos
- Si necesitas más control sobre el espaciado, puedes usar `gap-5` con flexbox o grid en lugar de `space-y-5`
- El espaciado aumentado proporciona mejor separación visual, especialmente útil en formularios largos

## Uso con React Hook Form

Este componente es especialmente útil con React Hook Form:

```tsx
const { handleSubmit, register } = useForm();

<Form onSubmit={handleSubmit(onSubmit)}>
  {/* Campos del formulario */}
</Form>
```

El `handleSubmit` de React Hook Form ya previene el comportamiento por defecto automáticamente, así que no necesitas llamar a `e.preventDefault()` manualmente.

