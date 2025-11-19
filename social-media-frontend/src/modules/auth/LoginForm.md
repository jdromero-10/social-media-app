# LoginForm.tsx - Documentación

## Descripción
Componente de formulario de login que utiliza React Hook Form para el manejo del formulario, Yup para validación, y el hook `useAuth` para realizar la petición de autenticación. Incluye validación en tiempo real y manejo de errores.

## Dependencias

### Librerías
- **react-hook-form**: Para manejo del formulario y estado
- **@hookform/resolvers**: Para integrar Yup con React Hook Form
- **yup**: Para esquemas de validación
- **useAuth**: Hook personalizado para autenticación (usa TanStack Query)

### Componentes
- `Form`: Componente wrapper de formulario
- `Input`: Componente de input reutilizable
- `PasswordInput`: Componente de input de contraseña con toggle de visibilidad (NUEVO)
- `Button`: Componente de botón reutilizable

## Esquema de Validación

### `loginSchema`
Esquema de validación Yup que define las reglas para los campos del formulario:

```typescript
{
  email: string
    - Debe ser un email válido
    - Es requerido
  
  password: string
    - Mínimo 6 caracteres
    - Es requerido
}
```

**Validaciones**:
- **Email**: 
  - Formato de email válido usando `.email()`
  - Campo requerido usando `.required()`
- **Password**:
  - Mínimo 6 caracteres usando `.min(6)`
  - Campo requerido usando `.required()`

## Componente

### `LoginForm`
Componente funcional que renderiza el formulario de login.

## Estado y Hooks

### `useAuth()`
Hook personalizado que proporciona:
- `loginAsync(data)`: Función asíncrona para iniciar sesión (retorna Promise)
- `isLoggingIn`: Estado booleano que indica si el login está en progreso
- `loginError`: Objeto de error si el login falló

### `useForm<LoginDto>()`
Hook de React Hook Form configurado con:
- **Tipo genérico**: `LoginDto` para tipado fuerte
- **Resolver**: `yupResolver(loginSchema)` para validación con Yup

### `formState.errors`
Objeto que contiene errores de validación por campo:
- `errors.email?.message`: Mensaje de error del campo email
- `errors.password?.message`: Mensaje de error del campo password

## Flujo de Datos

```
Usuario completa formulario
    ↓
onSubmit() se ejecuta (async)
    ↓
React Hook Form valida con Yup
    ↓
Si es válido → await loginAsync(data)
    ↓
useAuth → TanStack Query mutation
    ↓
authApi.login() → apiClient.post()
    ↓
Backend valida credenciales
    ↓
Backend establece cookie HTTP-only con token
    ↓
await se resuelve (login exitoso)
    ↓
onSuccess invalida queries ['auth-check'] y ['currentUser']
    ↓
navigate('/home') - Redirección inmediata
    ↓
ProtectedRoute verifica autenticación (sin caché)
    ↓
Usuario autenticado y en home
```

## Estructura del Formulario

1. **Mensaje de error global**: Se muestra si `loginError` existe (error del servidor)
2. **Campo Email**: Input con validación y mensaje de error
3. **Campo Password**: Input tipo password con validación
4. **Botón Submit**: Deshabilitado durante el login, muestra spinner

## Validación

### Validación en Tiempo Real
React Hook Form valida los campos automáticamente cuando:
- El usuario sale del campo (onBlur)
- El usuario escribe (onChange) - después del primer submit

### Mensajes de Error
- Los errores de validación se muestran debajo de cada input
- Los errores del servidor se muestran en un banner rojo arriba del formulario

## Ejemplo de Uso

```tsx
import { LoginForm } from '@/modules/auth/LoginForm';

function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Iniciar Sesión</h1>
      <LoginForm />
    </div>
  );
}
```

## Manejo de Errores

### Errores de Validación (Frontend)
- Se muestran debajo de cada campo
- Provienen de Yup según el esquema de validación
- Ejemplo: "El email debe ser válido", "La contraseña debe tener al menos 6 caracteres"

### Errores del Servidor (Backend)
- Se muestran en un banner rojo arriba del formulario
- Provienen de la respuesta del backend (ApiError)
- Ejemplo: "Credenciales inválidas", "Usuario no encontrado"
- **Mensaje adicional**: Si el error es de red (statusCode === 0), se muestra un mensaje adicional sugiriendo verificar la conexión y el servidor

## Estados del Botón

- **Normal**: "Iniciar sesión"
- **Cargando**: "Iniciando sesión..." + spinner
- **Deshabilitado**: Cuando `isLoggingIn` es `true` o hay errores de validación
- **Variante**: Usa `variant="primary"` con la paleta de colores cyan/aqua (`bg-[#00b1c0]`)

## Integración con Backend

El formulario envía los datos al endpoint:
- **URL**: `POST http://localhost:3006/auth/login`
- **Body**: `{ email: string, password: string }`
- **Respuesta exitosa**: `{ user: User }` (el token se guarda en cookie HTTP-only)
- **Token**: Se guarda automáticamente en cookie HTTP-only por el backend

## Redirección Después del Login

Después de un login exitoso:
- El formulario usa `loginAsync()` con `await` para esperar la respuesta
- El hook `useAuth` invalida automáticamente las queries `['auth-check']` y `['currentUser']` en el callback `onSuccess`
- Una vez que el login es exitoso y las queries se invalidan, redirige inmediatamente usando `navigate()`
- Redirige a `/home` por defecto
- Si el usuario intentaba acceder a una ruta protegida (guardada en `location.state.from`), redirige a esa ruta
- Usa `useNavigate` de React Router para la navegación
- La redirección ocurre directamente en `onSubmit` después de `await loginAsync()`, no en un `useEffect`
- **Importante**: La invalidación de queries asegura que `ProtectedRoute` verifique la autenticación con datos actualizados, evitando problemas de redirección en el primer intento

**Implementación:**
```typescript
const onSubmit = async (data: LoginDto) => {
  try {
    await loginAsync(data);
    // Las queries se invalidan automáticamente en onSuccess del hook useAuth
    // Redirigir después de login exitoso
    const from = location.state?.from?.pathname || '/home';
    navigate(from, { replace: true });
  } catch (error) {
    // El error ya se maneja en el useEffect de loginError
  }
};
```

**Nota sobre la invalidación de queries**: El hook `useAuth` invalida las queries de autenticación automáticamente después del login exitoso. Esto asegura que cuando `ProtectedRoute` verifica la autenticación, obtiene datos actualizados y no datos en caché obsoletos, permitiendo que la redirección funcione correctamente en el primer intento.

## Personalización

Puedes personalizar el formulario:

### Cambiar validaciones
```typescript
const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(), // Cambiar a 8 caracteres
});
```

### Agregar más campos
```tsx
<Input
  label="Recordarme"
  type="checkbox"
  {...register('rememberMe')}
/>
```

### Cambiar el mensaje de error
```tsx
{loginError && (
  <div className="custom-error-style">
    {loginError.message}
  </div>
)}
```

## Mejoras Implementadas (2024)

- ✅ **PasswordInput con toggle de visibilidad**: El campo de contraseña ahora usa `PasswordInput` en lugar de `Input` con `type="password"`
- ✅ **Mejor UX**: Los usuarios pueden mostrar/ocultar la contraseña haciendo clic en el icono de ojo
- ✅ **Iconos de Lucide React**: Usa iconos `Eye` y `EyeOff` para indicar el estado de visibilidad
- ✅ **Compatibilidad mantenida**: Sigue funcionando perfectamente con React Hook Form

## Notas Técnicas

- El `{...register('fieldName')}` de React Hook Form registra el campo automáticamente
- El `yupResolver` valida los datos antes de llamar a `onSubmit`
- El botón se deshabilita automáticamente cuando `isLoggingIn` es `true`
- El `fullWidth` en el botón hace que ocupe todo el ancho del formulario
- El `PasswordInput` usa `forwardRef` para compatibilidad completa con React Hook Form

