# RegisterForm.tsx - Documentación

## Descripción
Componente de formulario de registro que permite crear una nueva cuenta de usuario. Utiliza React Hook Form para el manejo del formulario, Yup para validación, y el hook `useAuth` para realizar la petición de registro. Incluye validación de contraseñas coincidentes y campos opcionales.

## Dependencias

### Librerías
- **react-hook-form**: Para manejo del formulario y estado
- **@hookform/resolvers**: Para integrar Yup con React Hook Form
- **yup**: Para esquemas de validación
- **useAuth**: Hook personalizado para autenticación (usa TanStack Query)
- **authApi**: Servicio API para validación de unicidad en tiempo real (NUEVO)

### Componentes
- `Form`: Componente wrapper de formulario
- `Input`: Componente de input reutilizable
- `PasswordInput`: Componente de input de contraseña con toggle de visibilidad (NUEVO)
- `Button`: Componente de botón reutilizable

## Esquema de Validación

### `registerSchema`
Esquema de validación Yup que define las reglas para los campos del formulario:

```typescript
{
  name: string
    - Mínimo 2 caracteres
    - Es requerido
  
  email: string
    - Debe ser un email válido
    - Es requerido
  
  password: string
    - Mínimo 6 caracteres
    - Es requerido
  
  confirmPassword: string
    - Debe coincidir con password
    - Es requerido
  
  username: string
    - Opcional
}
```

**Validaciones**:
- **Name**: 
  - Mínimo 2 caracteres usando `.min(2)`
  - Campo requerido usando `.required()`
- **Email**: 
  - Formato de email válido usando `.email()`
  - Campo requerido usando `.required()`
  - **Validación de unicidad en tiempo real** usando `.test()` con `validateEmailUniqueness()`
  - Valida mientras se escribe con debounce de 500ms
  - Solo valida si el email contiene '@' (formato básico)
- **Password**:
  - Mínimo 6 caracteres usando `.min(6)`
  - Campo requerido usando `.required()`
- **Confirm Password**:
  - Debe coincidir con `password` usando `.oneOf([yup.ref('password')])`
  - Campo requerido usando `.required()`
- **Username**:
  - Campo requerido usando `.required()`
  - Mínimo 3 caracteres usando `.min(3)`
  - **Validación de unicidad en tiempo real** usando `.test()` con `validateUsernameUniqueness()`
  - Valida mientras se escribe con debounce de 500ms (igual que el email)
  - Solo valida si tiene al menos 3 caracteres (mínimo requerido)

## Componente

### `RegisterForm`
Componente funcional que renderiza el formulario de registro.

## Estado y Hooks

### `useAuth()`
Hook personalizado que proporciona:
- `registerAsync(data)`: Función asíncrona para registrar usuario (retorna Promise)
- `isRegistering`: Estado booleano que indica si el registro está en progreso
- `registerError`: Objeto de error si el registro falló

### `useForm<RegisterFormData>()`
Hook de React Hook Form configurado con:
- **Tipo genérico**: `RegisterFormData` (tipo local que extiende `RegisterDto` con `confirmPassword`)
- **Resolver**: `yupResolver(registerSchema)` para validación con Yup
- **Mode**: `'onBlur'` - Valida al perder el foco para mejor UX y menos peticiones al servidor (NUEVO)
- **Nota**: `RegisterFormData = RegisterDto & { confirmPassword: string }` se define localmente para evitar conflictos de tipos
- **Esquema dinámico**: El esquema se crea con `useMemo` para optimización (NUEVO)

### `formState.errors`
Objeto que contiene errores de validación por campo.

## Flujo de Datos

```
Usuario completa formulario
    ↓
onSubmit() se ejecuta (async)
    ↓
React Hook Form valida con Yup
    ↓
Si es válido → Se remueve confirmPassword
    ↓
await registerAsync(data) → useAuth
    ↓
TanStack Query mutation
    ↓
authApi.register() → apiClient.post()
    ↓
Backend crea usuario
    ↓
Backend establece cookie HTTP-only con token
    ↓
await se resuelve (registro exitoso)
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

1. **Mensaje de error global**: Se muestra si `registerError` existe
2. **Campo Name**: Nombre completo del usuario
3. **Campo Email**: Email del usuario
4. **Campo Username**: Requerido, mínimo 3 caracteres, único
5. **Campo Password**: Contraseña del usuario
6. **Campo Confirm Password**: Confirmación de contraseña
7. **Botón Submit**: Deshabilitado durante el registro

## Validación Especial

### Confirmación de Contraseña
El campo `confirmPassword` usa `.oneOf([yup.ref('password')])` para validar que coincida con el campo `password`. Esto es una validación cross-field que Yup maneja automáticamente.

### Campo Requerido
El campo `username` es **requerido** y debe tener al menos 3 caracteres. Debe ser único en el sistema.

### Validación de Unicidad en Tiempo Real (NUEVO)

El formulario ahora incluye validación asíncrona de unicidad para `email` y `username`:

#### Email
- **Función**: `validateEmailUniqueness()`
- **Validación**: Usa `yup.test()` con validación asíncrona
- **Endpoint**: `POST /auth/validate` con `{ field: 'email', value: email }`
- **Mensaje de error**: "El correo electrónico ya está en uso"
- **Cuándo se valida**: 
  - Mientras se escribe (`onChange`) - validación en tiempo real
  - Con debounce de 500ms para evitar demasiadas peticiones
  - Solo valida si el email contiene '@' (formato básico)
- **Comportamiento**: 
  - Valida automáticamente mientras el usuario escribe
  - Espera 500ms después de que el usuario deje de escribir antes de validar
  - Muestra el error inmediatamente si el email ya está en uso

#### Username
- **Función**: `validateUsernameUniqueness()`
- **Validación**: Usa `yup.test()` con validación asíncrona
- **Endpoint**: `POST /auth/validate` con `{ field: 'username', value: username }`
- **Mensaje de error**: "El nombre de usuario ya está en uso"
- **Cuándo se valida**: 
  - Mientras se escribe (`onChange`) - validación en tiempo real
  - Al perder el foco (`onBlur`) - validación adicional cuando el usuario sale del campo
  - Con debounce de 500ms para validación de unicidad (si tiene 3+ caracteres)
  - Con debounce de 300ms para validación de longitud mínima (si tiene menos de 3 caracteres)
  - Solo valida unicidad si tiene al menos 3 caracteres (mínimo requerido)
- **Comportamiento**: 
  - Valida automáticamente mientras el usuario escribe (igual que el email)
  - Valida también cuando el usuario sale del campo (onBlur)
  - Si tiene menos de 3 caracteres: muestra error de longitud mínima después de 300ms
  - Si tiene 3+ caracteres: valida unicidad después de 500ms de inactividad
  - Muestra el error inmediatamente si el username ya está en uso
  - Campo requerido: debe tener al menos 3 caracteres

#### Implementación

**Funciones de Validación:**
```typescript
// Función de validación de email
const validateEmailUniqueness = async (email: string | undefined): Promise<boolean> => {
  if (!email || email.trim().length === 0) {
    return true; // Si está vacío, la validación de required se encargará
  }

  try {
    const result = await authApi.validateField('email', email);
    return result.isUnique;
  } catch (error) {
    // Si hay error de red, permitimos que continúe (se validará en el submit)
    console.error('Error validando email:', error);
    return true;
  }
};

// Función de validación de username
const validateUsernameUniqueness = async (username: string | undefined): Promise<boolean> => {
  // Si está vacío o es muy corto, retornar true para dejar que otras validaciones manejen el error
  if (!username || username.trim().length < 3) {
    return true; // Dejar que .required() y .min() manejen estos casos
  }

  try {
    const result = await authApi.validateField('username', username.trim());
    return result.isUnique;
  } catch (error) {
    // Si hay error de red, permitimos que continúe (se validará en el submit)
    console.error('Error validando username:', error);
    return true;
  }
};
```

**Esquema Yup:**
```typescript
email: yup
  .string()
  .email('El email debe ser válido')
  .required('El email es requerido')
  .test(
    'unique-email',
    'El correo electrónico ya está en uso',
    async (value) => {
      return await validateEmailUniqueness(value);
    },
  ),

username: yup
  .string()
  .required('El username es requerido')
  .min(3, 'El username debe tener al menos 3 caracteres')
  .test(
    'unique-username',
    'El nombre de usuario ya está en uso',
    async function (value) {
      // La función validateUsernameUniqueness ya maneja la verificación de longitud
      return await validateUsernameUniqueness(value);
    },
  ),
```

**Configuración de React Hook Form:**
```typescript
const {
  register,
  handleSubmit,
  formState: { errors },
  trigger,
  watch, // Para observar cambios en los campos
} = useForm<RegisterFormData>({
  resolver: yupResolver(registerSchema),
  mode: 'onChange', // Validar mientras se escribe para mejor feedback en tiempo real
  reValidateMode: 'onChange', // Revalidar mientras se escribe
});
```

**Validación en Tiempo Real con Debounce:**
```typescript
// Observar cambios en email y username
const emailValue = watch('email');
const usernameValue = watch('username');

// Validar email cuando cambia (con debounce de 500ms)
useEffect(() => {
  if (emailValue && emailValue.trim().length > 0 && emailValue.includes('@')) {
    const timeoutId = setTimeout(() => {
      trigger('email');
    }, 500); // Esperar 500ms después de que el usuario deje de escribir
    
    return () => clearTimeout(timeoutId);
  }
}, [emailValue, trigger]);

// Validar username cuando cambia (con debounce para evitar demasiadas peticiones)
useEffect(() => {
  // Validar solo si tiene al menos 3 caracteres (mínimo requerido)
  if (usernameValue && usernameValue.trim().length >= 3) {
    const timeoutId = setTimeout(() => {
      // Forzar validación del campo username
      // Usar trigger sin await para no bloquear, pero asegurar que se ejecute
      trigger('username', { shouldFocus: false }).catch((error) => {
        console.error('Error al validar username:', error);
      });
    }, 500); // Esperar 500ms después de que el usuario deje de escribir
    
    return () => clearTimeout(timeoutId);
  } else if (usernameValue && usernameValue.trim().length > 0 && usernameValue.trim().length < 3) {
    // Si tiene menos de 3 caracteres, también validar para mostrar el error de min
    const timeoutId = setTimeout(() => {
      trigger('username', { shouldFocus: false });
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }
}, [usernameValue, trigger]);
```

**Handler onBlur para Username:**
```typescript
<Input
  label="Username"
  type="text"
  placeholder="juanperez"
  {...register('username', {
    onBlur: async () => {
      // Validar cuando el usuario sale del campo
      const usernameValue = watch('username');
      if (usernameValue && usernameValue.trim().length >= 3) {
        await trigger('username', { shouldFocus: false });
      }
    },
  })}
  error={errors.username?.message}
  helperText="Mínimo 3 caracteres. Debe ser único."
/>
```

#### Ventajas
- **Mejor UX**: Los usuarios saben inmediatamente si su email/username está disponible
- **Menos frustración**: Evita errores al enviar el formulario
- **Validación eficiente**: Usa debounce de 500ms para evitar demasiadas peticiones al servidor
- **Validación en tiempo real**: Ambos campos (email y username) se validan mientras se escribe
- **Manejo de errores**: Si hay error de red, permite continuar (se validará en el submit)
- **Consistencia**: Email y username se validan exactamente de la misma manera

#### Notas Técnicas
- **Debounce**: 
  - Se usa un timeout de 500ms para validación de unicidad (username con 3+ caracteres)
  - Se usa un timeout de 300ms para validación de longitud mínima (username con menos de 3 caracteres)
  - Esto evita validar en cada tecla presionada y reduce peticiones al servidor
- **Watch**: Se usa `watch()` de React Hook Form para observar cambios en los campos
- **Trigger**: 
  - Se usa `trigger()` para disparar la validación manualmente después del debounce
  - Se usa `shouldFocus: false` para evitar que el campo pierda el foco durante la validación
- **Orden de Validaciones**: 
  - El username primero valida `.required()` y `.min(3)`, luego ejecuta el test asíncrono de unicidad
  - Si el valor es muy corto (< 3 caracteres), la función `validateUsernameUniqueness` retorna `true` y deja que otras validaciones muestren el error
- **Username Requerido**: El username ahora es requerido (no opcional) con mínimo de 3 caracteres y debe ser único
- **Modo onChange**: El formulario usa `mode: 'onChange'` para validar mientras se escribe, no solo al perder el foco
- **Validación onBlur**: El campo username también tiene un handler `onBlur` que valida cuando el usuario sale del campo, asegurando validación incluso si el debounce no se completó
- **Manejo de Errores**: 
  - El test asíncrono maneja errores de red internamente, permitiendo que el formulario continúe (se validará en el submit)
  - El `useEffect` usa `.catch()` para manejar errores al llamar `trigger()`

## Manejo de Datos

### Remover confirmPassword
Antes de enviar los datos al backend, se remueve `confirmPassword` porque no es parte del `RegisterDto`:

```typescript
const { confirmPassword, ...registerData } = data;
await registerAsync(registerData);
```

Esto asegura que solo se envíen los campos requeridos por el backend. La función usa `await` para esperar la respuesta antes de redirigir.

## Ejemplo de Uso

```tsx
import { RegisterForm } from '@/modules/auth/RegisterForm';

function RegisterPage() {
  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Crear Cuenta</h1>
      <RegisterForm />
    </div>
  );
}
```

## Manejo de Errores

### Errores de Validación (Frontend)
- Se muestran debajo de cada campo
- Provienen de Yup según el esquema de validación
- Ejemplo: "Las contraseñas deben coincidir", "El email debe ser válido"

### Errores del Servidor (Backend)
- Se muestran en un banner rojo arriba del formulario
- Provienen de la respuesta del backend (ApiError)
- Ejemplo: "El email ya está registrado", "Error al crear usuario"
- **Mensaje adicional**: Si el error es de red (statusCode === 0), se muestra un mensaje adicional sugiriendo verificar la conexión y el servidor

## Estados del Botón

- **Normal**: "Registrarse"
- **Cargando**: "Registrando..." + spinner
- **Deshabilitado**: Cuando `isRegistering` es `true` o hay errores de validación
- **Variante**: Usa `variant="primary"` con la paleta de colores cyan/aqua (`bg-[#00b1c0]`)

## Integración con Backend

El formulario envía los datos al endpoint:
- **URL**: `POST http://localhost:3006/auth/register`
- **Body**: `{ name: string, email: string, password: string, username?: string }`
- **Respuesta exitosa**: `{ user: User }` (el token se guarda en cookie HTTP-only)
- **Token**: Se guarda automáticamente en cookie HTTP-only por el backend

## Redirección Después del Registro

Después de un registro exitoso:
- El formulario usa `registerAsync()` con `await` para esperar la respuesta
- El hook `useAuth` invalida automáticamente las queries `['auth-check']` y `['currentUser']` en el callback `onSuccess`
- Una vez que el registro es exitoso y las queries se invalidan, redirige inmediatamente usando `navigate()`
- Redirige a `/home`
- Usa `useNavigate` de React Router para la navegación
- La redirección ocurre directamente en `onSubmit` después de `await registerAsync()`, no en un `useEffect`
- **Importante**: La invalidación de queries asegura que `ProtectedRoute` verifique la autenticación con datos actualizados, evitando problemas de redirección en el primer intento

**Implementación:**
```typescript
const onSubmit = async (data: RegisterFormData) => {
  try {
    // Remover confirmPassword antes de enviar (no va al backend)
    const { confirmPassword, ...registerData } = data;
    await registerAsync(registerData);
    // Las queries se invalidan automáticamente en onSuccess del hook useAuth
    // Redirigir después de registro exitoso
    navigate('/home', { replace: true });
  } catch {
    // El error ya se maneja en el useEffect de registerError
  }
};
```

**Nota sobre la invalidación de queries**: El hook `useAuth` invalida las queries de autenticación automáticamente después del registro exitoso. Esto asegura que cuando `ProtectedRoute` verifica la autenticación, obtiene datos actualizados y no datos en caché obsoletos, permitiendo que la redirección funcione correctamente en el primer intento.

## Diferencias con LoginForm

1. **Más campos**: Name, Username (opcional), Confirm Password
2. **Validación de confirmación**: Las contraseñas deben coincidir
3. **Helper text**: El campo username tiene texto de ayuda
4. **Diferente endpoint**: Usa `/auth/register` en lugar de `/auth/login`

## Personalización

Puedes personalizar el formulario:

### Cambiar validaciones
```typescript
const registerSchema = yup.object({
  password: yup.string().min(8).required(), // Cambiar a 8 caracteres
  // ...
});
```

### Hacer username requerido
```typescript
username: yup.string().required('El username es requerido'),
```

### Agregar más campos
```tsx
<Input
  label="Teléfono"
  type="tel"
  {...register('phone')}
/>
```

## Mejoras Implementadas (2024)

- ✅ **PasswordInput con toggle de visibilidad**: Ambos campos de contraseña (password y confirmPassword) ahora usan `PasswordInput` en lugar de `Input` con `type="password"`
- ✅ **Mejor UX**: Los usuarios pueden mostrar/ocultar ambas contraseñas haciendo clic en los iconos de ojo
- ✅ **Iconos de Lucide React**: Usa iconos `Eye` y `EyeOff` para indicar el estado de visibilidad
- ✅ **Compatibilidad mantenida**: Sigue funcionando perfectamente con React Hook Form
- ✅ **Mejor experiencia de registro**: Los usuarios pueden verificar que ambas contraseñas coinciden visualmente
- ✅ **Validación en tiempo real**: Validación asíncrona de unicidad para email y username usando `yup.test()` (NUEVO)
- ✅ **Validación onChange y onBlur**: El formulario valida mientras se escribe (`onChange`) y también cuando el usuario sale del campo (`onBlur`) para username (NUEVO)
- ✅ **Optimización con useMemo**: El esquema de validación se crea con `useMemo` para evitar recreaciones innecesarias (NUEVO)
- ✅ **Manejo robusto de errores**: Si hay error de red durante la validación, permite continuar (se validará en el submit) (NUEVO)
- ✅ **Simplificación de validación**: La función `validateUsernameUniqueness` ahora maneja internamente la verificación de longitud, simplificando el test de Yup (NUEVO)

## Notas Técnicas

- Se usa `registerAsync` en lugar de `register` para evitar conflicto con el hook `register` de React Hook Form
- El tipo del formulario incluye `confirmPassword` aunque no se envía al backend
- La validación de contraseñas coincidentes se hace en el frontend antes de enviar
- El helper text solo se muestra si no hay error en el campo
- La función `onSubmit` es `async` y usa `await` para esperar la respuesta antes de redirigir
- Esto asegura que la redirección ocurra inmediatamente después del registro exitoso, de forma más confiable que usando `useEffect` con estados
- Los `PasswordInput` usan `forwardRef` para compatibilidad completa con React Hook Form
- **Validación asíncrona**: Las funciones `validateEmailUniqueness` y `validateUsernameUniqueness` son asíncronas y llaman al endpoint `/auth/validate`
- **Modo de validación**: `mode: 'onChange'` valida mientras se escribe para mejor feedback en tiempo real
- **Validación onBlur adicional**: El campo username tiene un handler `onBlur` que valida cuando el usuario sale del campo, asegurando validación incluso si el debounce no se completó
- **Esquema optimizado**: El esquema Yup se crea con `useMemo` para evitar recreaciones en cada render
- **Manejo de errores de red**: Si la validación falla por error de red, retorna `true` para permitir continuar (se validará en el submit del backend)
- **Función simplificada**: `validateUsernameUniqueness` ahora retorna `true` para valores vacíos o muy cortos, dejando que `.required()` y `.min()` manejen esos casos, lo que simplifica el test de Yup

