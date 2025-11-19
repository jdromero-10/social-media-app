# Card.tsx - Documentación

## Descripción
Componente de tarjeta (card) reutilizable con estructura de header, body y footer opcionales. Proporciona un contenedor visual consistente para agrupar contenido relacionado. Está construido con Tailwind CSS.

## Props

### `children: ReactNode` (requerido)
- **Tipo**: ReactNode
- **Descripción**: Contenido principal de la tarjeta (body)
- **Ejemplo**: `<Card>Contenido aquí</Card>`

### `title?: string`
- **Tipo**: String (opcional)
- **Descripción**: Título que aparece en el header de la tarjeta
- **Efecto**: Si se proporciona, crea un header con fondo gris claro y borde inferior
- **Ejemplo**: `<Card title="Mi Tarjeta">Contenido</Card>`

### `footer?: ReactNode`
- **Tipo**: ReactNode (opcional)
- **Descripción**: Contenido que aparece en el footer de la tarjeta
- **Efecto**: Si se proporciona, crea un footer con fondo gris claro y borde superior
- **Uso**: Útil para botones de acción, enlaces, o información adicional
- **Ejemplo**: `<Card footer={<Button>Acción</Button>}>Contenido</Card>`

### `className?: string`
- **Tipo**: String
- **Default**: `''`
- **Descripción**: Clases CSS adicionales para personalización del contenedor principal
- **Nota**: Se combinan con las clases base del componente

### `padding?: 'none' | 'sm' | 'md' | 'lg'`
- **Tipo**: String literal union
- **Default**: `'md'`
- **Descripción**: Tamaño del padding interno del body
- **Opciones**:
  - `none`: Sin padding
  - `sm`: Padding pequeño (`p-4`)
  - `md`: Padding mediano (`p-6`) - por defecto
  - `lg`: Padding grande (`p-8`)
- **Ejemplo**: `<Card padding="lg">Contenido con mucho espacio</Card>`

## Estructura Visual

```
┌─────────────────────────┐
│  Header (si hay title)  │ ← Fondo gris, borde inferior
├─────────────────────────┤
│                         │
│   Body (children)       │ ← Padding configurable
│                         │
├─────────────────────────┤
│  Footer (si hay footer) │ ← Fondo gris, borde superior
└─────────────────────────┘
```

## Estilos

### Contenedor Principal
- `bg-white`: Fondo blanco
- `rounded-xl`: Esquinas más redondeadas (mejorado de `rounded-lg`)
- `shadow-lg`: Sombra más pronunciada para mejor efecto de elevación (mejorado de `shadow-md`)
- `border border-gray-100`: Borde más sutil (mejorado de `border-gray-200`)
- `overflow-hidden`: Oculta contenido que se desborde (útil para imágenes)

### Header (cuando hay title)
- `px-6 py-4`: Padding interno
- `border-b border-gray-200`: Borde inferior
- `bg-gray-50`: Fondo gris claro
- Título: `text-lg font-semibold text-gray-900`

### Body
- Padding configurable según la prop `padding`
- Contiene el `children` del componente

### Footer (cuando hay footer)
- `px-6 py-4`: Padding interno
- `border-t border-gray-200`: Borde superior
- `bg-gray-50`: Fondo gris claro

## Ejemplos de Uso

### Card básica
```tsx
<Card>
  <p>Contenido simple de la tarjeta</p>
</Card>
```

### Card con título
```tsx
<Card title="Información del Usuario">
  <p>Email: user@example.com</p>
  <p>Nombre: John Doe</p>
</Card>
```

### Card con footer
```tsx
<Card
  title="Configuración"
  footer={
    <div className="flex justify-end gap-2">
      <Button variant="outline">Cancelar</Button>
      <Button>Guardar</Button>
    </div>
  }
>
  <Input label="Nombre" />
  <Input label="Email" />
</Card>
```

### Card con padding personalizado
```tsx
<Card padding="lg" title="Artículo">
  <h2>Mi artículo</h2>
  <p>Contenido del artículo...</p>
</Card>
```

### Card sin padding
```tsx
<Card padding="none" title="Galería">
  <img src="image1.jpg" alt="Imagen 1" />
  <img src="image2.jpg" alt="Imagen 2" />
</Card>
```

### Card completa (header, body, footer)
```tsx
<Card
  title="Formulario de Contacto"
  footer={
    <Button fullWidth>Enviar</Button>
  }
>
  <div className="space-y-4">
    <Input label="Nombre" />
    <Input label="Email" type="email" />
    <Input label="Mensaje" />
  </div>
</Card>
```

### Card con clases personalizadas
```tsx
<Card className="max-w-md mx-auto">
  <p>Card centrada con ancho máximo</p>
</Card>
```

## Casos de Uso Comunes

1. **Formularios**: Agrupar campos de formulario con título y botones de acción
2. **Perfiles de usuario**: Mostrar información con título y acciones
3. **Listas de contenido**: Tarjetas en grid para mostrar múltiples elementos
4. **Modales**: Contenedor para contenido de modales
5. **Dashboards**: Widgets y paneles de información

## Mejoras Implementadas (2024)

- ✅ **Bordes más redondeados**: Cambio de `rounded-lg` a `rounded-xl` para un aspecto más moderno
- ✅ **Sombra mejorada**: Cambio de `shadow-md` a `shadow-lg` para mejor efecto de elevación
- ✅ **Borde más sutil**: Cambio de `border-gray-200` a `border-gray-100` para un aspecto más limpio

## Notas Técnicas

- El header y footer solo se renderizan si se proporcionan `title` o `footer` respectivamente
- El padding solo se aplica al body, no al header ni footer (ellos tienen su propio padding)
- `overflow-hidden` es útil si incluyes imágenes o contenido que pueda desbordarse
- La sombra mejorada (`shadow-lg`) proporciona mayor profundidad visual y mejor separación del fondo
- Los bordes más redondeados (`rounded-xl`) dan un aspecto más moderno y suave

## Accesibilidad

- El título usa un `<h3>` semántico, lo cual es bueno para SEO y accesibilidad
- La estructura es semánticamente correcta con divs apropiados
- Si necesitas más semántica, puedes envolver el Card en un `<article>` o `<section>`

