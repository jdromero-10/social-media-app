# apiClient.ts - Documentación

## Descripción
Este archivo contiene la clase `ApiClient` que centraliza toda la lógica para realizar peticiones HTTP al backend. Proporciona métodos para GET, POST, PUT, PATCH y DELETE, maneja automáticamente la autenticación mediante tokens JWT, y gestiona errores de forma consistente.

## Configuración

### URL Base
- La URL base se obtiene de la variable de entorno `VITE_API_BASE_URL` o por defecto usa `http://localhost:3006`
- Para cambiar la URL en producción, crea un archivo `.env` con: `VITE_API_BASE_URL=https://tu-backend.com`

## Clase ApiClient

### Constructor
```typescript
constructor(baseURL: string)
```
- Inicializa el cliente con la URL base del backend.

### Métodos Privados

#### `getHeaders(): HeadersInit`
- **Propósito**: Genera los headers necesarios para cada petición.
- **Incluye**:
  - `Content-Type: application/json` (siempre)
- **Nota**: Ya no incluye el header `Authorization` ya que los tokens se manejan mediante cookies HTTP-only.
- **Retorna**: Objeto con los headers configurados.

#### `handleResponse<T>(response: Response): Promise<T>`
- **Propósito**: Procesa la respuesta de la API de forma uniforme.
- **Funcionalidad**:
  - Si la respuesta no es exitosa (status >= 400), lanza un error con formato `ApiError`
  - Si la respuesta es exitosa y es JSON, parsea y retorna los datos
  - Si no es JSON, retorna un objeto vacío
- **Manejo de errores**: Convierte errores HTTP en objetos `ApiError` con `message`, `statusCode` y opcionalmente `error`.
- **Try-catch interno**: Maneja errores de parseo JSON de forma segura.

#### `getDefaultErrorMessage(statusCode: number): string`
- **Propósito**: Proporciona mensajes de error legibles según el código de estado HTTP.
- **Códigos manejados**:
  - `400`: "Solicitud inválida. Por favor, verifica los datos enviados."
  - `401`: "Credenciales inválidas. Verifica tu email y contraseña."
  - `403`: "No tienes permisos para realizar esta acción."
  - `404`: "Recurso no encontrado."
  - `409`: "El correo electrónico ya está en uso."
  - `422`: "Los datos proporcionados no son válidos."
  - `500`: "Error interno del servidor. Por favor, intenta más tarde."
  - `503`: "Servicio no disponible. Por favor, intenta más tarde."
  - `default`: Mensaje genérico con el código de estado.

#### `handleNetworkError(error: unknown): ApiError`
- **Propósito**: Maneja errores de red y otros errores inesperados.
- **Funcionalidad**:
  - Detecta errores de red (TypeError con mensaje "fetch")
  - Convierte errores desconocidos a formato `ApiError`
  - Retorna mensajes claros para errores de conexión
- **Mensaje de red**: "No se pudo conectar con el servidor. Verifica tu conexión a internet."

### Métodos Públicos

Todos los métodos públicos siguen el mismo patrón y retornan una `Promise<T>` donde `T` es el tipo de datos esperado.

**Importante**: Todos los métodos incluyen `credentials: 'include'` para enviar cookies HTTP-only automáticamente en cada petición.

#### `get<T>(endpoint: string): Promise<T>`
- Realiza una petición GET al endpoint especificado.
- **Incluye cookies**: Automáticamente envía cookies HTTP-only
- **Ejemplo**: `apiClient.get<User>('/users/1')`

#### `post<T>(endpoint: string, data?: unknown): Promise<T>`
- Realiza una petición POST con datos en el body (JSON).
- **Incluye cookies**: Automáticamente envía cookies HTTP-only
- **Ejemplo**: `apiClient.post<AuthResponse>('/auth/login', { email, password })`

#### `put<T>(endpoint: string, data?: unknown): Promise<T>`
- Realiza una petición PUT para actualizar recursos.
- **Incluye cookies**: Automáticamente envía cookies HTTP-only
- **Ejemplo**: `apiClient.put<User>('/users/1', userData)`

#### `patch<T>(endpoint: string, data?: unknown): Promise<T>`
- Realiza una petición PATCH para actualizaciones parciales.
- **Incluye cookies**: Automáticamente envía cookies HTTP-only
- **Ejemplo**: `apiClient.patch<User>('/users/1', { name: 'Nuevo nombre' })`

#### `delete<T>(endpoint: string): Promise<T>`
- Realiza una petición DELETE para eliminar recursos.
- **Incluye cookies**: Automáticamente envía cookies HTTP-only
- **Ejemplo**: `apiClient.delete('/users/1')`

## Tipos Exportados

### `ApiError`
```typescript
interface ApiError {
  message: string;        // Mensaje de error legible
  statusCode: number;     // Código HTTP de error
  error?: string;         // Tipo de error (opcional)
}
```

### `ApiResponse<T>`
```typescript
interface ApiResponse<T> {
  data: T;               // Datos de la respuesta
  message?: string;       // Mensaje opcional del servidor
}
```

## Instancia Exportada

### `apiClient`
- Instancia única (singleton) del cliente API lista para usar.
- Se importa directamente: `import { apiClient } from '@/api/apiClient'`

## Flujo de Autenticación con Cookies HTTP-Only

1. Cuando el usuario hace login o registro, el backend establece una cookie HTTP-only con el token JWT.
2. En cada petición posterior, el navegador envía automáticamente la cookie gracias a `credentials: 'include'`.
3. El backend extrae el token de la cookie y valida la autenticación.
4. Si el token es inválido o expiró, el backend retornará un 401, que será manejado como `ApiError`.

### Ventajas de Cookies HTTP-Only

- **Seguridad mejorada**: Los tokens no son accesibles desde JavaScript, previniendo ataques XSS.
- **Envío automático**: No necesitas manejar manualmente el token en cada petición.
- **Protección CSRF**: Las cookies están configuradas con `sameSite: 'lax'` para protección adicional.

## Manejo de Errores

El `apiClient` implementa un sistema robusto de manejo de errores con try-catch en todos los métodos HTTP.

### Tipos de Errores Manejados

1. **Errores de Red** (statusCode: 0)
   - Ocurren cuando no hay conexión al servidor
   - Mensaje: "No se pudo conectar con el servidor. Verifica tu conexión a internet."
   - Se detectan automáticamente cuando `fetch` falla

2. **Errores HTTP del Backend** (statusCode: 400-599)
   - Errores con códigos de estado HTTP estándar
   - Mensajes personalizados según el código de estado
   - Si el backend envía un mensaje, se usa ese; si no, se usa un mensaje por defecto

3. **Errores de Parseo**
   - Cuando la respuesta no es JSON válido
   - Se manejan de forma segura sin romper la aplicación

### Ejemplo de Uso

```typescript
try {
  const data = await apiClient.post('/auth/login', credentials);
  // Manejar éxito
} catch (error) {
  // error es de tipo ApiError
  if (error.statusCode === 0) {
    // Error de red - servidor no disponible
    console.error('Error de conexión:', error.message);
  } else if (error.statusCode === 401) {
    // Credenciales inválidas
    console.error('Credenciales incorrectas:', error.message);
  } else {
    // Otro error HTTP
    console.error('Error:', error.message, 'Status:', error.statusCode);
  }
}
```

### Características del Manejo de Errores

- ✅ **Try-catch en todos los métodos**: GET, POST, PUT, PATCH, DELETE
- ✅ **Mensajes claros y útiles**: No más "failed to fetch" genéricos
- ✅ **Detección automática de errores de red**: Distingue entre errores de red y errores del servidor
- ✅ **Mensajes por defecto**: Proporciona mensajes legibles incluso si el backend no envía uno
- ✅ **Tipado fuerte**: Todos los errores son del tipo `ApiError`

## Buenas Prácticas

1. **Centralización**: Todas las peticiones HTTP pasan por este cliente, facilitando el mantenimiento.
2. **Autenticación automática**: No necesitas agregar el token manualmente en cada petición.
3. **Tipado fuerte**: Usa TypeScript para garantizar tipos correctos en las respuestas.
4. **Manejo consistente de errores**: Todos los errores tienen el mismo formato.

