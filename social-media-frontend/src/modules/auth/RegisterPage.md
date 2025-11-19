# RegisterPage.tsx - Documentación

## Descripción
Página completa de registro que incluye el layout, título, enlace a login y el formulario de registro envuelto en una Card. Está diseñada para ser una página independiente con su propio layout centrado, similar a LoginPage pero para registro de nuevos usuarios.

## Dependencias

### Componentes
- `RegisterForm`: Formulario de registro
- `Card`: Componente de tarjeta para contener el formulario
- `AuthLayout`: Layout compartido para páginas de autenticación (NUEVO)
- `LandingPageInfo`: Componente de información de landing (usado dentro de AuthLayout) (NUEVO)
- `ToastContainer`: Contenedor para notificaciones toast

## Estructura

### Layout Principal
La página ahora usa `AuthLayout` que proporciona:
- **Desktop (lg+)**: Diseño de pantalla dividida (50/50)
  - Lado izquierdo: `LandingPageInfo` con información de la plataforma
  - Lado derecho: Formulario de registro
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
  <h2>Crear Cuenta</h2>
  <p>O <Link to="/login">inicia sesión si ya tienes cuenta</Link></p>
</div>
```

- **Título**: "Crear Cuenta" con estilo grande y bold
- **Enlace**: Link a la página de login con estilos de hover

### Card con Formulario
```tsx
<Card className="shadow-xl border-0">
  <RegisterForm />
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
- **Icono circular**: `w-16 h-16 rounded-full bg-indigo-600 mb-4 shadow-lg` con icono de usuario agregando SVG
- **Título**: `text-4xl font-bold text-gray-900 mb-2` (mejorado - más grande)
- **Descripción**: `text-gray-600 mb-6` (texto descriptivo agregado)
- **Enlace**: `font-semibold text-indigo-600 hover:text-indigo-700 transition-colors` (mejorado)

### Enlace
- `font-medium text-[#00b1c0] hover:text-[#00dde5]`: Estilo de enlace con hover (cyan)

## Responsive Design

La página es responsive gracias a:
- Padding que se ajusta según el tamaño de pantalla
- `max-w-md` que limita el ancho en pantallas grandes
- `w-full` que permite que ocupe todo el ancho disponible en móviles

## Navegación

### Enlace a Login
- Usa `Link` de React Router para navegación sin recargar la página
- Ruta: `/login`
- Estilo consistente con el diseño de la aplicación

## Ejemplo de Uso

Para usar esta página, debes configurarla en tu router:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RegisterPage } from '@/modules/auth/RegisterPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        {/* otras rutas */}
      </Routes>
    </BrowserRouter>
  );
}
```

## Flujo de Usuario

1. Usuario visita `/register`
2. Ve el título "Crear Cuenta"
3. Puede hacer click en "inicia sesión si ya tienes cuenta" para ir a login
4. Completa el formulario de registro
5. Al hacer submit, se crea la cuenta, se autentica automáticamente y puede ser redirigido

## Diferencias con LoginPage

1. **Título diferente**: "Crear Cuenta" vs "Iniciar Sesión"
2. **Enlace diferente**: Va a `/login` en lugar de `/register`
3. **Formulario diferente**: Usa `RegisterForm` en lugar de `LoginForm`
4. **Más campos**: El formulario de registro tiene más campos (name, username, confirmPassword)

## Personalización

### Cambiar el título
```tsx
<h2 className="text-3xl font-extrabold text-gray-900">
  Únete a nosotros
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
  <h2>Crear Cuenta</h2>
  {/* ... */}
</div>
```

### Agregar términos y condiciones
```tsx
<Card>
  <RegisterForm />
  <div className="mt-4 text-center text-xs text-gray-500">
    Al registrarte, aceptas nuestros{' '}
    <Link to="/terms" className="text-[#00b1c0] hover:underline">
      Términos y Condiciones
    </Link>
  </div>
</Card>
```

## Mejoras Implementadas (2024)

- ✅ **Diseño moderno con gradiente**: Fondo con gradiente cyan (`from-gray-50 via-[#eafffd]/30 to-[#cbfffb]/30`) para diferenciarse del login
- ✅ **Icono visual**: Agregado icono circular con SVG de usuario agregando en el header para mejor identidad visual
- ✅ **Título mejorado**: Cambio de `text-3xl` a `text-4xl` y de `font-extrabold` a `font-bold` para mejor legibilidad
- ✅ **Texto descriptivo**: Agregado texto descriptivo "Únete a nuestra comunidad hoy mismo"
- ✅ **Card mejorada**: Sombra más pronunciada (`shadow-xl`) y sin borde (`border-0`) para efecto flotante
- ✅ **Enlaces mejorados**: Mejor contraste y transiciones suaves en los enlaces con colores índigo
- ✅ **Layout de pantalla dividida**: Implementado `AuthLayout` con diseño de 2 columnas en desktop (NUEVO)
- ✅ **LandingPageInfo**: Sección informativa atractiva con características de la plataforma (solo desktop) (NUEVO)
- ✅ **Mejor responsive**: Prioriza formulario en móvil, muestra información completa en desktop (NUEVO)

## Notas Técnicas

- La página usa `min-h-screen` para asegurar que ocupe toda la altura incluso con poco contenido
- El centrado con flexbox funciona perfectamente en todos los tamaños de pantalla
- El `space-y-8` crea un espaciado consistente entre el header y la card
- La Card mejorada proporciona mayor elevación visual y mejor separación del fondo
- El gradiente de fondo es sutil y no interfiere con la legibilidad del contenido
- El formulario de registro es más largo que el de login, pero la Card se ajusta automáticamente

## Accesibilidad

- El título usa un `<h2>` semántico
- El enlace tiene texto descriptivo
- La estructura es clara y navegable con teclado
- El formulario incluye labels y mensajes de error accesibles

