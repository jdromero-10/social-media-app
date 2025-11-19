# Bar.tsx - Documentación

## Descripción
Componente de barra (bar) reutilizable para crear barras fijas en la parte superior o inferior de la pantalla. Útil para navegación, notificaciones, banners informativos, etc. Está construido con Tailwind CSS.

## Props

### `children: ReactNode` (requerido)
- **Tipo**: ReactNode
- **Descripción**: Contenido de la barra
- **Ejemplo**: `<Bar>Contenido de la barra</Bar>`

### `className?: string`
- **Tipo**: String
- **Default**: `''`
- **Descripción**: Clases CSS adicionales para personalización
- **Nota**: Se combinan con las clases base del componente

### `variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'`
- **Tipo**: String literal union
- **Default**: `'default'`
- **Descripción**: Estilo visual de la barra
- **Opciones**:
  - `default`: Fondo blanco con borde inferior gris (para navegación)
  - `primary`: Fondo azul con texto blanco
  - `success`: Fondo verde con texto blanco (para notificaciones de éxito)
  - `warning`: Fondo amarillo con texto blanco (para advertencias)
  - `danger`: Fondo rojo con texto blanco (para errores o alertas críticas)
- **Ejemplo**: `<Bar variant="success">Operación exitosa</Bar>`

### `position?: 'top' | 'bottom'`
- **Tipo**: String literal union
- **Default**: `'top'`
- **Descripción**: Posición de la barra en la pantalla
- **Opciones**:
  - `top`: Barra fija en la parte superior
  - `bottom`: Barra fija en la parte inferior
- **Ejemplo**: `<Bar position="bottom">Footer bar</Bar>`

## Estilos

### Clases Base
- `fixed`: Posición fija en la pantalla
- `left-0 right-0`: Ocupa todo el ancho
- `z-40`: Z-index medio-alto (por encima del contenido pero debajo de modales)
- `top-0` o `bottom-0`: Según la posición

### Variantes de Color

#### Default
- `bg-white`: Fondo blanco
- `border-b border-gray-200`: Borde inferior gris
- Texto: Color por defecto (negro)

#### Primary
- `bg-[#00b1c0]`: Fondo cyan (cyan-600)
- `text-white`: Texto blanco

#### Success
- `bg-green-600`: Fondo verde
- `text-white`: Texto blanco

#### Warning
- `bg-yellow-500`: Fondo amarillo
- `text-white`: Texto blanco

#### Danger
- `bg-red-600`: Fondo rojo
- `text-white`: Texto blanco

### Contenedor Interno
- `container mx-auto`: Centra el contenido y limita el ancho máximo
- `px-4 py-3`: Padding interno

## Ejemplos de Uso

### Barra de navegación (default)
```tsx
<Bar>
  <div className="flex items-center justify-between">
    <h1 className="text-xl font-bold">Mi App</h1>
    <nav>
      <a href="/">Inicio</a>
      <a href="/about">Acerca de</a>
    </nav>
  </div>
</Bar>
```

### Barra de notificación de éxito
```tsx
<Bar variant="success">
  <div className="flex items-center justify-between">
    <span>¡Operación completada exitosamente!</span>
    <button onClick={handleClose}>×</button>
  </div>
</Bar>
```

### Barra de advertencia
```tsx
<Bar variant="warning">
  <p>⚠️ Esta es una advertencia importante</p>
</Bar>
```

### Barra de error
```tsx
<Bar variant="danger">
  <div className="flex items-center justify-between">
    <span>Error: No se pudo completar la operación</span>
    <button onClick={handleDismiss}>Cerrar</button>
  </div>
</Bar>
```

### Barra en la parte inferior
```tsx
<Bar position="bottom" variant="primary">
  <p className="text-center">© 2024 Mi App. Todos los derechos reservados.</p>
</Bar>
```

### Barra con contenido complejo
```tsx
<Bar>
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <img src="/logo.png" alt="Logo" className="h-8" />
      <nav className="flex gap-4">
        <a href="/">Inicio</a>
        <a href="/products">Productos</a>
        <a href="/contact">Contacto</a>
      </nav>
    </div>
    <div className="flex items-center gap-2">
      <Button size="sm">Login</Button>
      <Button size="sm" variant="primary">Registro</Button>
    </div>
  </div>
</Bar>
```

## Casos de Uso Comunes

1. **Navegación principal**: Barra superior con logo y menú
2. **Notificaciones**: Barras temporales para mostrar mensajes al usuario
3. **Banners informativos**: Información importante que debe ser visible
4. **Footer**: Barra inferior con información de copyright, enlaces, etc.
5. **Alertas globales**: Mensajes de error o advertencia que afectan toda la app

## Notas Técnicas

- La barra es `fixed`, por lo que permanece visible al hacer scroll
- El `z-40` asegura que esté por encima del contenido normal pero debajo de modales (z-50)
- El contenedor interno usa `container mx-auto` de Tailwind para centrar y limitar el ancho
- El `role="banner"` ayuda con la accesibilidad semántica

## Consideraciones de Layout

Cuando uses una barra `position="top"`, asegúrate de agregar padding al contenido principal para que no quede oculto detrás de la barra:

```tsx
<div className="pt-16"> {/* Ajusta según la altura de tu barra */}
  <main>Contenido principal</main>
</div>
```

O usa un layout con flexbox:

```tsx
<div className="flex flex-col min-h-screen">
  <Bar>Navegación</Bar>
  <main className="flex-1">Contenido</main>
</div>
```

## Accesibilidad

- El `role="banner"` indica que es una región de banner (útil para navegación principal)
- Para barras de notificación, considera usar `role="alert"` o `role="status"`
- Asegúrate de que el contraste de colores sea suficiente según las variantes

