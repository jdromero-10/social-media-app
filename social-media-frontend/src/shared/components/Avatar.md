# Avatar.tsx - Documentación

## Descripción
Componente reutilizable para mostrar avatares de usuario. Soporta imágenes personalizadas, iniciales generadas automáticamente, y diferentes tamaños. Incluye manejo de errores para imágenes que fallan al cargar.

## Props

### `src?: string`
- **Tipo**: String (URL de imagen) opcional
- **Descripción**: URL de la imagen del avatar
- **Ejemplo**: `src="/images/user-avatar.jpg"`

### `alt?: string`
- **Tipo**: String opcional
- **Default**: `'Avatar'`
- **Descripción**: Texto alternativo para la imagen
- **Uso**: Accesibilidad

### `name?: string`
- **Tipo**: String opcional
- **Descripción**: Nombre del usuario para generar iniciales
- **Comportamiento**: 
  - Si hay 2+ palabras: toma la primera letra de la primera y última palabra
  - Si hay 1 palabra: toma las primeras 2 letras
- **Ejemplo**: `name="John Doe"` → "JD"

### `size?: 'sm' | 'md' | 'lg'`
- **Tipo**: String literal union
- **Default**: `'md'`
- **Descripción**: Tamaño del avatar
- **Opciones**:
  - `sm`: 32px (w-8 h-8)
  - `md`: 40px (w-10 h-10)
  - `lg`: 48px (w-12 h-12)

### `fallback?: string`
- **Tipo**: String opcional
- **Descripción**: Texto de respaldo si no hay imagen ni nombre
- **Default**: `'?'` si no se proporciona

### `className?: string`
- **Tipo**: String opcional
- **Descripción**: Clases CSS adicionales
- **Uso**: Para estilos personalizados

## Características

### Generación de Iniciales
El componente genera automáticamente iniciales basadas en el nombre:

```tsx
// Ejemplos:
name="John Doe" → "JD"
name="María García López" → "ML"
name="Alice" → "AL"
```

### Manejo de Errores de Imagen
Si la imagen falla al cargar:
1. Se oculta la imagen (`display: none`)
2. Se muestra el fallback (iniciales o texto proporcionado)

### Colores Aleatorios de Fondo
El componente asigna colores de forma determinística basados en el nombre del usuario. Esto garantiza que el mismo usuario siempre tenga el mismo color.

**Colores disponibles:**
1. **Cyan** (`from-[#00b1c0] to-[#038c9b]`) - Color principal de la aplicación
2. **Rojo** (`from-red-500 to-red-600`)
3. **Verde** (`from-green-500 to-green-600`)
4. **Naranja** (`from-orange-500 to-orange-600`)

El color se selecciona usando un hash determinístico del nombre, por lo que:
- El mismo nombre siempre produce el mismo color
- Diferentes nombres se distribuyen uniformemente entre los 4 colores
- Si no hay nombre, se usa cyan por defecto

## Estilos

### Tamaños
```css
sm: w-8 h-8 text-xs    (32px)
md: w-10 h-10 text-sm  (40px)
lg: w-12 h-12 text-base (48px)
```

### Estilos Base
- `rounded-full`: Forma circular
- `bg-gradient-to-br`: Gradiente de fondo (color asignado aleatoriamente basado en el nombre)
- `text-white`: Texto blanco
- `font-semibold`: Fuente semibold
- `overflow-hidden`: Oculta desbordamiento
- `flex-shrink-0`: No se encoge

**Sistema de Colores:**
El color del avatar se determina mediante una función hash que convierte el nombre del usuario en un índice (0-3), garantizando consistencia visual para cada usuario.

## Ejemplos de Uso

### Avatar con Imagen
```tsx
<Avatar 
  src="/images/user.jpg" 
  alt="Usuario" 
  name="John Doe"
/>
```

### Avatar con Iniciales
```tsx
<Avatar 
  name="John Doe"
  size="lg"
/>
```

### Avatar con Fallback Personalizado
```tsx
<Avatar 
  fallback="?"
  size="sm"
/>
```

### Avatar en NavBar
```tsx
<Avatar 
  name={userName}
  size="md"
/>
```

## Casos de Uso

1. **NavBar**: Mostrar avatar del usuario actual
2. **Perfil**: Avatar grande en la página de perfil
3. **Posts**: Avatares pequeños de los autores
4. **Comentarios**: Avatares de los comentaristas
5. **Listas de Usuarios**: Avatares en listas y grids

## Accesibilidad

- Soporta `alt` para imágenes
- Texto legible con buen contraste
- Tamaños apropiados para diferentes contextos

## Notas Técnicas

- Usa `forwardRef` para compatibilidad con refs
- Extiende `HTMLAttributes<HTMLDivElement>` para props nativas
- Manejo de errores de imagen con `onError`
- Generación de iniciales con lógica personalizada
- Acepta `className` para estilos personalizados, incluyendo efectos hover

## Efectos Hover

El componente Avatar puede recibir clases personalizadas para efectos hover. Un ejemplo común es usarlo con `group-hover:` en un contenedor padre:

```tsx
<button className="group">
  <Avatar 
    name="John Doe"
    className="transition-all duration-200 group-hover:scale-110 group-hover:ring-2 group-hover:ring-[#00dde5] cursor-pointer"
  />
</button>
```

**Efectos comunes:**
- `group-hover:scale-110`: Aumenta el tamaño al hacer hover
- `group-hover:ring-2 group-hover:ring-[#00dde5]`: Muestra un anillo cyan alrededor
- `group-hover:ring-offset-2`: Espacio entre el avatar y el anillo
- `cursor-pointer`: Cambia el cursor a pointer
- `transition-all duration-200`: Transición suave

**Uso en NavBar:**
El avatar en el NavBar usa estos efectos para proporcionar feedback visual cuando el usuario pasa el cursor sobre el botón del menú de usuario.

## Sistema de Colores Aleatorios

El componente Avatar implementa un sistema de asignación de colores determinístico basado en el nombre del usuario. Esto garantiza:

- **Consistencia**: El mismo usuario siempre tendrá el mismo color
- **Distribución uniforme**: Los usuarios se distribuyen uniformemente entre los 4 colores disponibles
- **Sin dependencias**: No requiere almacenar preferencias de color en la base de datos

### Implementación Técnica

```typescript
const getAvatarColor = (name: string): string => {
  const colors = [
    'from-[#00b1c0] to-[#038c9b]', // Cyan (color principal)
    'from-red-500 to-red-600',      // Rojo
    'from-green-500 to-green-600', // Verde
    'from-orange-500 to-orange-600', // Naranja
  ];

  // Hash determinístico basado en el nombre
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};
```

### Ejemplos de Asignación

```tsx
// Mismo nombre = mismo color
<Avatar name="John Doe" />  // Siempre el mismo color
<Avatar name="John Doe" />  // Siempre el mismo color

// Diferentes nombres = diferentes colores (distribuidos)
<Avatar name="Alice" />     // Color 1
<Avatar name="Bob" />       // Color 2
<Avatar name="Charlie" />   // Color 3
<Avatar name="Diana" />     // Color 4
```

## Mejoras Futuras

- Soporte para imágenes lazy loading
- Animaciones al cargar
- Soporte para diferentes formas (cuadrado, redondeado)
- Soporte para badges/indicadores
- Integración con servicios de avatar (Gravatar, etc.)
- Opción para que los usuarios elijan su color de avatar personalizado

