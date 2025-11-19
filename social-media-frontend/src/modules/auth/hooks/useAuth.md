# useAuth.ts - Documentación

## Descripción
Este hook personalizado encapsula toda la lógica de autenticación usando TanStack Query mutations. Proporciona una API simple y reactiva para login, registro y logout, manejando automáticamente el almacenamiento del token y el estado de las operaciones.

## Hook Exportado

### `useAuth()`
Hook personalizado que retorna un objeto con métodos y estados relacionados con la autenticación.

## Retorno del Hook

El hook retorna un objeto con las siguientes propiedades:

### Login (Inicio de Sesión)

#### `login(credentials: LoginDto): void`
- **Tipo**: Función de mutación
- **Parámetros**: `credentials` - Objeto con `email` y `password`
- **Propósito**: Inicia sesión de forma asíncrona (fire and forget)
- **Uso**: Para formularios donde no necesitas esperar la respuesta
- **Ejemplo**:
  ```tsx
  const { login } = useAuth();
  login({ email: 'user@example.com', password: 'pass123' });
  ```

#### `loginAsync(credentials: LoginDto): Promise<AuthResponse>`
- **Tipo**: Función asíncrona
- **Parámetros**: `credentials` - Objeto con `email` y `password`
- **Retorna**: `Promise<AuthResponse>`
- **Propósito**: Inicia sesión y retorna una promesa que puedes await
- **Uso**: Cuando necesitas esperar la respuesta o manejar el resultado directamente
- **Ejemplo**:
  ```tsx
  const { loginAsync } = useAuth();
  try {
    const response = await loginAsync({ email, password });
    console.log('Usuario autenticado:', response.user);
  } catch (error) {
    console.error('Error:', error);
  }
  ```

#### `isLoggingIn: boolean`
- **Tipo**: Booleano
- **Propósito**: Indica si el login está en progreso
- **Uso**: Para mostrar spinners o deshabilitar botones durante el login
- **Ejemplo**:
  ```tsx
  const { login, isLoggingIn } = useAuth();
  <button disabled={isLoggingIn} onClick={() => login(credentials)}>
    {isLoggingIn ? 'Iniciando sesión...' : 'Iniciar sesión'}
  </button>
  ```

#### `loginError: ApiError | null`
- **Tipo**: `ApiError | null`
- **Propósito**: Contiene el error si el login falló, o `null` si fue exitoso
- **Uso**: Para mostrar mensajes de error al usuario
- **Ejemplo**:
  ```tsx
  const { loginError } = useAuth();
  {loginError && <p className="error">{loginError.message}</p>}
  ```

#### `loginSuccess: boolean`
- **Tipo**: Booleano
- **Propósito**: Indica si el último login fue exitoso
- **Uso**: Para redirigir después de login exitoso o mostrar mensajes de éxito

### Register (Registro)

Todas las propiedades de registro siguen el mismo patrón que login:

- `register(userData: RegisterDto): void` - Mutación fire and forget
- `registerAsync(userData: RegisterDto): Promise<AuthResponse>` - Mutación con promesa
- `isRegistering: boolean` - Estado de carga
- `registerError: ApiError | null` - Error si falló
- `registerSuccess: boolean` - Éxito del registro

### Logout (Cerrar Sesión)

#### `logout(): void`
- **Tipo**: Función de mutación
- **Propósito**: Cierra la sesión del usuario
- **Funcionalidad**:
  - Llama al endpoint `/auth/logout` del backend
  - El backend limpia la cookie HTTP-only `access_token`
  - Opcionalmente puede invalidar queries relacionadas (comentado en el código)
- **Uso**: Para botones de logout
- **Ejemplo**:
  ```tsx
  const { logout, isLoggingOut } = useAuth();
  <button onClick={logout} disabled={isLoggingOut}>
    {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
  </button>
  ```

#### `logoutAsync(): Promise<{ message: string }>`
- **Tipo**: Función asíncrona
- **Propósito**: Cierra sesión y retorna una promesa
- **Uso**: Cuando necesitas esperar la confirmación del logout
- **Ejemplo**:
  ```tsx
  const { logoutAsync } = useAuth();
  await logoutAsync();
  // Redirigir o limpiar estado
  ```

#### `isLoggingOut: boolean`
- **Tipo**: Booleano
- **Propósito**: Indica si el logout está en progreso
- **Uso**: Para mostrar estados de carga durante el logout

#### `logoutError: ApiError | null`
- **Tipo**: `ApiError | null`
- **Propósito**: Contiene el error si el logout falló

#### `logoutSuccess: boolean`
- **Tipo**: Booleano
- **Propósito**: Indica si el último logout fue exitoso

## Flujo de Autenticación

### Login Flow:
```
Usuario envía formulario
    ↓
login() o loginAsync()
    ↓
TanStack Query mutation
    ↓
authApi.login()
    ↓
apiClient.post('/auth/login') (con credentials: 'include')
    ↓
Backend valida credenciales
    ↓
Backend establece cookie HTTP-only con token
    ↓
onSuccess: 
  - Token guardado automáticamente en cookie
  - Invalidar queries ['auth-check'] y ['currentUser']
    ↓
Usuario autenticado y queries actualizadas
```

### Register Flow:
Similar al login, pero usa `authApi.register()` y el endpoint `/auth/register`. El token también se guarda automáticamente en una cookie HTTP-only.

### Logout Flow:
```
Usuario hace clic en logout
    ↓
logout() o logoutAsync()
    ↓
TanStack Query mutation
    ↓
authApi.logout()
    ↓
apiClient.post('/auth/logout') (con credentials: 'include')
    ↓
Backend limpia cookie access_token
    ↓
onSuccess: Sesión cerrada
    ↓
Usuario desautenticado
```

## Callbacks Internos

### `onSuccess` (Login/Register)
- Se ejecuta automáticamente cuando la mutación es exitosa
- **Importante**: Ya no guarda el token manualmente. El token se maneja automáticamente mediante cookies HTTP-only establecidas por el backend.
- **Invalidación de Queries**: Después del login/registro exitoso, invalida automáticamente las queries `['auth-check']` y `['currentUser']` para forzar una nueva verificación de autenticación. Esto asegura que `ProtectedRoute` y otros componentes obtengan los datos actualizados del usuario.
- Usa `await Promise.all()` para esperar que se complete la invalidación antes de continuar, garantizando que la redirección funcione correctamente en el primer intento.
- Puedes extender esto para actualizar un store global con los datos del usuario (Zustand, Context, etc.)

**Implementación:**
```typescript
onSuccess: async () => {
  console.log('Login exitoso, token guardado en cookie');
  
  // Invalidar queries de autenticación para forzar una nueva verificación
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ['auth-check'] }),
    queryClient.invalidateQueries({ queryKey: ['currentUser'] }),
  ]);
}
```

### `onSuccess` (Logout)
- Se ejecuta automáticamente cuando el logout es exitoso
- El backend ya ha limpiado la cookie, no es necesario hacer nada más
- Puedes extender esto para limpiar el estado del usuario en el store global

### `onError`
- Se ejecuta automáticamente cuando la mutación falla
- Actualmente solo hace console.error, pero puedes extenderlo para mostrar notificaciones
- El error siempre es del tipo `ApiError` gracias a los helpers `getErrorMessage()` y `toApiError()`

## Helpers de Manejo de Errores

El hook incluye funciones helper para manejar errores de forma segura:

### `getErrorMessage(error: unknown): string`
- **Propósito**: Extrae el mensaje de error de manera segura.
- **Funcionalidad**:
  - Si es un `ApiError`, retorna `error.message`
  - Si es un `Error` estándar, retorna `error.message`
  - Si no puede determinar el tipo, retorna un mensaje genérico

### `toApiError(error: unknown): ApiError`
- **Propósito**: Normaliza cualquier error a formato `ApiError`.
- **Funcionalidad**:
  - Si ya es un `ApiError`, lo retorna tal cual
  - Si no, crea un nuevo `ApiError` con el mensaje extraído
  - Garantiza que todos los errores tengan el formato consistente

### Uso en Mutations

Las mutations usan try-catch para asegurar que los errores siempre sean del tipo `ApiError`:

```typescript
mutationFn: async (credentials: LoginDto) => {
  try {
    return await authApi.login(credentials);
  } catch (error) {
    // Asegurar que el error sea del tipo ApiError
    throw toApiError(error);
  }
}
```

## Ejemplo de Uso Completo

```tsx
import { useAuth } from '@/modules/auth/hooks/useAuth';

function LoginForm() {
  const { login, isLoggingIn, loginError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      {loginError && <p className="error">{loginError.message}</p>}
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button type="submit" disabled={isLoggingIn}>
        {isLoggingIn ? 'Iniciando...' : 'Iniciar sesión'}
      </button>
    </form>
  );
}
```

## Ventajas

1. **API simple**: Un solo hook para toda la lógica de autenticación
2. **Estado reactivo**: Los estados se actualizan automáticamente
3. **Manejo automático de tokens**: Los tokens se manejan mediante cookies HTTP-only, no necesitas guardarlos manualmente
4. **Seguridad mejorada**: Las cookies HTTP-only previenen ataques XSS
5. **Tipado fuerte**: TypeScript garantiza tipos correctos
6. **Reutilizable**: Puede ser usado en cualquier componente

## Invalidación de Queries

### Después del Login/Registro
El hook invalida automáticamente las siguientes queries después de un login o registro exitoso:
- `['auth-check']`: Query usada por `ProtectedRoute` para verificar autenticación
- `['currentUser']`: Query usada para obtener datos del usuario actual

**Propósito**: Asegurar que todos los componentes que dependen del estado de autenticación obtengan datos actualizados inmediatamente después del login, evitando problemas de redirección o datos en caché obsoletos.

**Implementación**:
```typescript
const queryClient = useQueryClient();

onSuccess: async () => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ['auth-check'] }),
    queryClient.invalidateQueries({ queryKey: ['currentUser'] }),
  ]);
}
```

## Extensión Futura

Puedes extender este hook para:
- Guardar datos del usuario en un store global
- Invalidar queries relacionadas al hacer logout
- Agregar refresh token logic
- Manejar redirecciones automáticas después de login/register

