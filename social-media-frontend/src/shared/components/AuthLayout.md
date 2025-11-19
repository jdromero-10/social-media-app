# AuthLayout.tsx - Documentación

## Descripción
Componente de layout compartido para páginas de autenticación (Login y Register). Implementa un diseño de pantalla dividida en escritorio donde un lado muestra información de la landing page y el otro muestra el formulario. En móvil, prioriza el formulario y oculta o mueve la información de landing.

## Características Principales

- **Diseño de Pantalla Dividida**: En desktop, divide la pantalla en dos columnas (50/50)
- **Responsive**: Adapta el layout según el tamaño de pantalla
- **Reutilizable**: Un solo componente para Login y Register
- **Consistente**: Mantiene el mismo diseño visual en ambas páginas
- **Flexible**: Permite personalizar título, descripción, icono y enlaces

## Props

### `children: ReactNode` (requerido)
- **Tipo**: ReactNode
- **Descripción**: Contenido del formulario (LoginForm o RegisterForm envuelto en Card)
- **Ejemplo**: `<Card><LoginForm /></Card>`

### `title: string` (requerido)
- **Tipo**: String
- **Descripción**: Título principal de la página
- **Ejemplo**: `"Bienvenido de nuevo"` o `"Crea tu cuenta"`

### `description: string` (requerido)
- **Tipo**: String
- **Descripción**: Descripción breve debajo del título
- **Ejemplo**: `"Inicia sesión en tu cuenta para continuar"`

### `linkText: string` (requerido)
- **Tipo**: String
- **Descripción**: Texto antes del enlace de navegación
- **Ejemplo**: `"¿No tienes una cuenta?"` o `"¿Ya tienes una cuenta?"`

### `linkTo: string` (requerido)
- **Tipo**: String
- **Descripción**: Ruta a la que apunta el enlace
- **Ejemplo**: `"/register"` o `"/login"`

### `icon: ReactNode` (requerido)
- **Tipo**: ReactNode
- **Descripción**: Icono SVG o componente de icono para mostrar en el header
- **Ejemplo**: `<User className="w-8 h-8 text-white" />`

### `showLandingInfo?: boolean` (opcional)
- **Tipo**: Boolean
- **Default**: `true`
- **Descripción**: Controla si se muestra el componente LandingPageInfo
- **Uso**: Útil si quieres ocultar la información de landing en ciertos casos

## Estructura del Layout

### Desktop (lg breakpoint y superior)

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  ┌─────────────────┐  ┌──────────────────┐   │
│  │                 │  │                  │   │
│  │ LandingPageInfo │  │   Formulario    │   │
│  │                 │  │                  │   │
│  │  (Gradiente)    │  │   (Card + Form) │   │
│  │                 │  │                  │   │
│  └─────────────────┘  └──────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

- **Grid de 2 columnas**: `lg:grid lg:grid-cols-2`
- **Lado izquierdo**: LandingPageInfo (50% del ancho)
- **Lado derecho**: Formulario (50% del ancho)

### Móvil (sm, md breakpoints)

```
┌─────────────────────┐
│                     │
│   Header (Título)   │
│                     │
│   Formulario        │
│   (Card + Form)     │
│                     │
│   (LandingInfo      │
│    oculto)          │
│                     │
└─────────────────────┘
```

- **Layout vertical**: Todo apilado verticalmente
- **LandingPageInfo**: Oculto (`hidden lg:flex` en LandingPageInfo)
- **Formulario**: Ocupa todo el ancho disponible

## Estilos

### Contenedor Principal
- `min-h-screen`: Altura mínima de toda la pantalla
- `bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30`: Fondo con gradiente sutil
- `lg:grid lg:grid-cols-2`: Grid de 2 columnas en desktop

### Sección del Formulario
- `flex items-center justify-center`: Centrado vertical y horizontal
- `py-12 px-4 sm:px-6 lg:px-8`: Padding responsive
- `w-full max-w-md`: Ancho completo hasta máximo mediano

### Header del Formulario
- `text-center`: Texto centrado
- Icono circular con `bg-[#00b1c0]` (cyan-600)
- Título con `text-4xl font-bold`
- Descripción con `text-gray-600`
- Enlace con estilos de hover

## Ejemplos de Uso

### LoginPage
```tsx
import { AuthLayout } from '@/shared/components/AuthLayout';
import { Card } from '@/shared/components/Card';
import { LoginForm } from './LoginForm';
import { User } from 'lucide-react';

export const LoginPage = () => {
  return (
    <AuthLayout
      title="Bienvenido de nuevo"
      description="Inicia sesión en tu cuenta para continuar"
      linkText="¿No tienes una cuenta?"
      linkTo="/register"
      icon={<User className="w-8 h-8 text-white" />}
    >
      <Card className="shadow-xl border-0">
        <LoginForm />
      </Card>
    </AuthLayout>
  );
};
```

### RegisterPage
```tsx
import { AuthLayout } from '@/shared/components/AuthLayout';
import { Card } from '@/shared/components/Card';
import { RegisterForm } from './RegisterForm';
import { UserPlus } from 'lucide-react';

export const RegisterPage = () => {
  return (
    <AuthLayout
      title="Crea tu cuenta"
      description="Únete a nuestra comunidad hoy mismo"
      linkText="¿Ya tienes una cuenta?"
      linkTo="/login"
      icon={<UserPlus className="w-8 h-8 text-white" />}
    >
      <Card className="shadow-xl border-0">
        <RegisterForm />
      </Card>
    </AuthLayout>
  );
};
```

### Sin LandingPageInfo
```tsx
<AuthLayout
  title="Login"
  description="Inicia sesión"
  linkText="¿No tienes cuenta?"
  linkTo="/register"
  icon={<User />}
  showLandingInfo={false}
>
  <Card>
    <LoginForm />
  </Card>
</AuthLayout>
```

## Responsive Design

### Breakpoints

- **Móvil (< lg)**: 
  - Layout vertical
  - LandingPageInfo oculto
  - Formulario ocupa todo el ancho
  - Padding reducido

- **Desktop (≥ lg)**:
  - Layout de 2 columnas
  - LandingPageInfo visible a la izquierda
  - Formulario a la derecha
  - Cada columna ocupa 50% del ancho

### Clases Responsive Utilizadas

- `lg:grid lg:grid-cols-2`: Grid de 2 columnas solo en desktop
- `px-4 sm:px-6 lg:px-8`: Padding horizontal que aumenta con el tamaño de pantalla
- `max-w-md`: Ancho máximo del formulario (mediano)

## Integración con LandingPageInfo

El componente `LandingPageInfo` se renderiza automáticamente dentro de `AuthLayout` cuando `showLandingInfo` es `true` (por defecto). El componente `LandingPageInfo` maneja su propia visibilidad usando `hidden lg:flex`.

## Navegación

El componente usa `Link` de React Router para la navegación entre Login y Register:

```tsx
<Link
  to={linkTo}
  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
>
  {linkTo === '/register' ? 'Regístrate aquí' : 'Inicia sesión aquí'}
</Link>
```

El texto del enlace se determina automáticamente basado en la ruta (`linkTo`).

## Dependencias

- **react-router-dom**: `Link` para navegación
- **LandingPageInfo**: Componente de información de landing
- **Tailwind CSS**: Para todos los estilos

## Ventajas de este Diseño

1. **Reutilización**: Un solo componente para Login y Register
2. **Consistencia**: Mismo diseño visual en ambas páginas
3. **Responsive**: Se adapta perfectamente a todos los tamaños de pantalla
4. **Mantenibilidad**: Cambios en un solo lugar afectan ambas páginas
5. **UX Mejorada**: Información atractiva en desktop, formulario prioritario en móvil

## Notas Técnicas

- El layout usa CSS Grid en desktop (`lg:grid lg:grid-cols-2`)
- En móvil, el grid no se aplica, resultando en un layout vertical natural
- `LandingPageInfo` se oculta automáticamente en móvil usando sus propias clases
- El formulario siempre está centrado verticalmente usando flexbox
- El fondo tiene un gradiente sutil que no interfiere con la legibilidad

## Mejoras Implementadas (2024)

- ✅ Diseño de pantalla dividida para desktop
- ✅ Layout responsive que prioriza formulario en móvil
- ✅ Componente reutilizable para Login y Register
- ✅ Integración con LandingPageInfo
- ✅ Navegación fluida entre páginas de autenticación
- ✅ Diseño consistente y profesional

