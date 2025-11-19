# LandingPageInfo.tsx - Documentación

## Descripción
Componente de información de landing para páginas de autenticación. Muestra la misión, propósito y características principales de la red social con un diseño atractivo y profesional. Está diseñado para ser usado en el lado izquierdo de las páginas de login y registro en pantallas de escritorio.

## Características Principales

- **Diseño Visual Atractivo**: Gradiente de colores azul, índigo y púrpura con efectos de fondo
- **Información Clara**: Título, descripción y características principales de la plataforma
- **Iconos Visuales**: Usa iconos de Lucide React para representar cada característica
- **Responsive**: Se oculta automáticamente en pantallas móviles (usando `hidden lg:flex`)
- **Efectos Visuales**: Patrones de fondo decorativos y efectos de hover en las características

## Estructura

### Contenido Principal

1. **Logo/Icono Principal**: Icono de usuarios en un contenedor con fondo semitransparente
2. **Título**: "Conecta y comparte tu arte" - Título principal de la plataforma
3. **Descripción**: Texto descriptivo sobre la misión y propósito de la red social
4. **Lista de Características**: 4 características principales con iconos y descripciones

### Características Incluidas

1. **Publicaciones con fotos**: Comparte momentos con imágenes de alta calidad
2. **Comentarios en tiempo real**: Interactúa con la comunidad mediante comentarios instantáneos
3. **Notificaciones**: Mantente al día con actualizaciones importantes
4. **Conecta con amigos**: Encuentra y conecta con personas que comparten tus intereses

## Props

Este componente no acepta props. El contenido está definido internamente para mantener consistencia.

## Estilos

### Contenedor Principal
- `hidden lg:flex`: Oculto en móvil, visible en desktop (lg breakpoint y superior)
- `lg:flex-col lg:justify-center`: Layout vertical centrado en desktop
- `lg:px-8 xl:px-12`: Padding horizontal responsive
- `bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600`: Gradiente de fondo
- `text-white`: Texto blanco para contraste
- `relative overflow-hidden`: Para efectos de fondo decorativos

### Patrón de Fondo
- Círculos blancos con blur para efecto decorativo
- Opacidad reducida (`opacity-10`) para no interferir con el contenido
- Posicionados en esquinas opuestas

### Logo/Icono
- `w-20 h-20`: Tamaño grande
- `rounded-2xl`: Esquinas muy redondeadas
- `bg-white/20 backdrop-blur-sm`: Fondo semitransparente con blur
- `shadow-xl`: Sombra pronunciada

### Título
- `text-5xl font-bold`: Tamaño grande y negrita
- `mb-4`: Margen inferior
- `leading-tight`: Interlineado ajustado

### Descripción
- `text-xl`: Tamaño de texto grande
- `text-[#eafffd]`: Color cyan claro (cyan-50) para contraste
- `mb-10`: Margen inferior generoso
- `leading-relaxed`: Interlineado relajado

### Características
- `space-y-6`: Espaciado vertical entre características
- Cada característica tiene:
  - `flex items-start gap-4`: Layout horizontal con gap
  - `p-4 rounded-xl`: Padding y esquinas redondeadas
  - `bg-white/10 backdrop-blur-sm`: Fondo semitransparente
  - `hover:bg-white/20`: Efecto hover
  - `transition-all duration-200`: Transiciones suaves

### Iconos de Características
- `w-12 h-12`: Tamaño mediano
- `rounded-lg`: Esquinas redondeadas
- `bg-white/20`: Fondo semitransparente
- `flex items-center justify-center`: Centrado perfecto

## Responsive Design

### Desktop (lg breakpoint y superior)
- Visible y ocupa la mitad izquierda de la pantalla
- Layout vertical centrado
- Todas las características visibles

### Móvil (sm, md breakpoints)
- Completamente oculto usando `hidden lg:flex`
- No ocupa espacio en el layout
- El formulario tiene prioridad y ocupa todo el ancho

## Uso

Este componente está diseñado para ser usado dentro de `AuthLayout`:

```tsx
import { LandingPageInfo } from '@/shared/components/LandingPageInfo';

// Dentro de AuthLayout
<LandingPageInfo />
```

## Personalización

### Cambiar el título
Edita el texto dentro del componente:
```tsx
<h1 className="text-5xl font-bold mb-4 leading-tight">
  Tu nuevo título aquí
</h1>
```

### Cambiar la descripción
Edita el párrafo de descripción:
```tsx
<p className="text-xl text-blue-100 mb-10 leading-relaxed">
  Tu nueva descripción aquí
</p>
```

### Agregar o modificar características
Edita el array `features` al inicio del componente:
```tsx
const features = [
  {
    icon: Image,
    title: 'Nueva característica',
    description: 'Descripción de la nueva característica',
  },
  // ... más características
];
```

### Cambiar colores del gradiente
Modifica las clases del contenedor principal:
```tsx
<div className="... bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 ...">
```

### Cambiar iconos
Importa nuevos iconos de Lucide React y actualiza el array `features`:
```tsx
import { Heart, Star, Share2 } from 'lucide-react';

const features = [
  {
    icon: Heart,
    // ...
  },
];
```

## Dependencias

- **lucide-react**: Para los iconos (Users, Image, MessageCircle, Bell)
- **Tailwind CSS**: Para todos los estilos

## Notas Técnicas

- El componente usa `hidden lg:flex` para ocultarse en móvil y mostrarse en desktop
- Los efectos de fondo decorativos usan `absolute` positioning con `blur-3xl`
- El `backdrop-blur-sm` crea un efecto de vidrio esmerilado moderno
- Las transiciones en hover mejoran la interacción del usuario
- El z-index (`relative z-10`) asegura que el contenido esté sobre los efectos de fondo

## Accesibilidad

- El texto tiene buen contraste (blanco sobre gradiente oscuro)
- Los iconos son descriptivos y ayudan a entender el contenido
- La estructura semántica es clara (h1 para título, p para descripción)
- El contenido es legible y bien espaciado

## Mejoras Implementadas (2024)

- ✅ Diseño moderno con gradiente atractivo
- ✅ Efectos visuales decorativos de fondo
- ✅ Iconos de Lucide React para mejor identidad visual
- ✅ Efectos hover en características para mejor interacción
- ✅ Diseño responsive que se oculta en móvil
- ✅ Backdrop blur para efecto moderno de vidrio esmerilado

