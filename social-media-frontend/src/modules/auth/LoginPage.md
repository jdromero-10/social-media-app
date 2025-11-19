# LoginPage.tsx - Documentación

## Descripción
Página completa de login que incluye el layout, título, enlace a registro y el formulario de login envuelto en una Card. Está diseñada para ser una página independiente con su propio layout centrado.

## Dependencias

### Componentes
- `LoginForm`: Formulario de login
- `Card`: Componente de tarjeta para contener el formulario
- `AuthLayout`: Layout compartido para páginas de autenticación (NUEVO)
- `LandingPageInfo`: Componente de información de landing (usado dentro de AuthLayout) (NUEVO)
- `ToastContainer`: Contenedor para notificaciones toast

## Estructura

### Layout Principal
La página ahora usa `AuthLayout` que proporciona:
- **Desktop (lg+)**: Diseño de pantalla dividida (50/50)
  - Lado izquierdo: `LandingPageInfo` con información de la plataforma
  - Lado derecho: Formulario de login
- **Móvil (< lg)**: Layout vertical
  - `LandingPageInfo` oculto
  - Formulario ocupa todo el ancho

### Contenido
1. **ToastContainer**: Contenedor para notificaciones
2. **AuthLayout**: Layout compartido que incluye:
   - Header con título, descripción y enlace
   - `LandingPageInfo` (solo desktop)
   - Formulario envuelto en Card

## Componentes Utilizados

### Header Section
```tsx
<div className="text-center">
  <h2>Iniciar Sesión</h2>
  <p>O <Link to="/register">crea una cuenta nueva</Link></p>
</div>
```

- **Título**: "Iniciar Sesión" con estilo grande y bold
- **Enlace**: Link a la página de registro con estilos de hover

### Card con Formulario
```tsx
<Card className="shadow-xl border-0">
  <LoginForm />
</Card>
```

- El formulario está envuelto en una Card para mejor presentación visual
- La Card ahora usa `shadow-xl border-0` para sombra más pronunciada y sin borde (mejorado)

## Estilos

### Contenedor Principal
- `min-h-screen`: Altura mínima de toda la pantalla
- `flex items-center justify-center`: Centrado perfecto
- `bg-gradient-to-br from-gray-50 via-[#eafffd]/30 to-[#cbfffb]/30`: Fondo con gradiente cyan (mejorado)
- `py-12 px-4 sm:px-6 lg:px-8`: Padding responsive

### Contenedor de Contenido
- `max-w-md`: Ancho máximo mediano
- `w-full`: Ancho completo hasta el máximo
- `space-y-8`: Espaciado vertical entre elementos

### Header Section
- **Icono circular**: `w-16 h-16 rounded-full bg-[#00b1c0] mb-4 shadow-lg` (cyan-600) con icono de usuario SVG
- **Título**: `text-4xl font-bold text-gray-900 mb-2` (mejorado - más grande)
- **Descripción**: `text-gray-600 mb-6` (texto descriptivo agregado)
- **Enlace**: `font-semibold text-[#00b1c0] hover:text-[#038c9b] transition-colors` (cyan-600/700)

### Enlace
- `font-medium text-[#00b1c0] hover:text-[#00dde5]`: Estilo de enlace con hover (cyan)

## Responsive Design

La página es responsive gracias a:
- Padding que se ajusta según el tamaño de pantalla
- `max-w-md` que limita el ancho en pantallas grandes
- `w-full` que permite que ocupe todo el ancho disponible en móviles

## Navegación

### Enlace a Registro
- Usa `Link` de React Router para navegación sin recargar la página
- Ruta: `/register`
- Estilo consistente con el diseño de la aplicación

## Ejemplo de Uso

Para usar esta página, debes configurarla en tu router:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from '@/modules/auth/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* otras rutas */}
      </Routes>
    </BrowserRouter>
  );
}
```

## Flujo de Usuario

1. Usuario visita `/login`
2. Ve el título "Iniciar Sesión"
3. Puede hacer click en "crea una cuenta nueva" para ir a registro
4. Completa el formulario de login
5. Al hacer submit, se autentica y puede ser redirigido (depende de tu lógica)

## Personalización

### Cambiar el título
```tsx
<h2 className="text-3xl font-extrabold text-gray-900">
  Bienvenido de vuelta
</h2>
```

### Cambiar el fondo
```tsx
<div className="min-h-screen flex items-center justify-center bg-[#eafffd]">
```

### Agregar logo
```tsx
<div className="text-center">
  <img src="/logo.png" alt="Logo" className="h-12 mx-auto mb-4" />
  <h2>Iniciar Sesión</h2>
  {/* ... */}
</div>
```

### Agregar más información
```tsx
<Card>
  <LoginForm />
  <div className="mt-4 text-center text-sm text-gray-600">
    <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
  </div>
</Card>
```

## Mejoras Implementadas (2024)

- ✅ **Diseño moderno con gradiente**: Fondo con gradiente cyan (`from-gray-50 via-[#eafffd]/30 to-[#cbfffb]/30`) para un aspecto más profesional
- ✅ **Icono visual**: Agregado icono circular con SVG de usuario en el header para mejor identidad visual
- ✅ **Título mejorado**: Cambio de `text-3xl` a `text-4xl` y de `font-extrabold` a `font-bold` para mejor legibilidad
- ✅ **Texto descriptivo**: Agregado texto descriptivo "Inicia sesión en tu cuenta para continuar"
- ✅ **Card mejorada**: Sombra más pronunciada (`shadow-xl`) y sin borde (`border-0`) para efecto flotante
- ✅ **Enlaces mejorados**: Mejor contraste y transiciones suaves en los enlaces
- ✅ **Layout de pantalla dividida**: Implementado `AuthLayout` con diseño de 2 columnas en desktop (NUEVO)
- ✅ **LandingPageInfo**: Sección informativa atractiva con características de la plataforma (solo desktop) (NUEVO)
- ✅ **Mejor responsive**: Prioriza formulario en móvil, muestra información completa en desktop (NUEVO)

## Notas Técnicas

- La página usa `min-h-screen` para asegurar que ocupe toda la altura incluso con poco contenido
- El centrado con flexbox funciona perfectamente en todos los tamaños de pantalla
- El `space-y-8` crea un espaciado consistente entre el header y la card
- La Card mejorada proporciona mayor elevación visual y mejor separación del fondo
- El gradiente de fondo es sutil y no interfiere con la legibilidad del contenido

## Accesibilidad

- El título usa un `<h2>` semántico
- El enlace tiene texto descriptivo
- La estructura es clara y navegable con teclado

