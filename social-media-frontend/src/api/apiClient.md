# apiClient.ts - Documentación

## Descripción
Cliente HTTP centralizado para realizar peticiones al backend. Maneja autenticación, errores y conversión de respuestas.

## Métodos

### `get<T>(endpoint: string): Promise<T>`
Realiza una petición GET.

### `post<T>(endpoint: string, data?: unknown): Promise<T>`
Realiza una petición POST con JSON.

### `put<T>(endpoint: string, data?: unknown): Promise<T>`
Realiza una petición PUT con JSON.

### `patch<T>(endpoint: string, data?: unknown): Promise<T>`
Realiza una petición PATCH con JSON.

### `delete<T>(endpoint: string): Promise<T>`
Realiza una petición DELETE.

### `uploadFile<T>(endpoint: string, file: File, fieldName?: string): Promise<T>`
Sube un archivo usando FormData.

**Parámetros**:
- `endpoint`: Ruta del endpoint (ej: `/upload/user-avatar`)
- `file`: Archivo a subir
- `fieldName`: Nombre del campo en FormData (default: `'image'`)

**Retorna**: Respuesta del servidor (típicamente `{ imageUrl: string }`)

**Ejemplo**:
```typescript
const file = // ... archivo seleccionado
const response = await apiClient.uploadFile<{ imageUrl: string }>(
  '/upload/user-avatar',
  file,
  'image'
);
// response.imageUrl = "/images/users/uuid.jpg"
```

### `getImageUrl(imageUrl: string | null | undefined): string | null`
Construye la URL completa de una imagen a partir de una URL relativa.

**Parámetros**:
- `imageUrl`: URL relativa (ej: `/images/users/uuid.jpg`) o URL completa

**Retorna**: URL completa de la imagen o `null`

**Comportamiento**:
- Si es `null` o `undefined`, retorna `null`
- Si ya es una URL completa (`http://`, `https://`) o base64 (`data:`), la retorna tal cual
- Si es una URL relativa (`/images/...`), construye la URL completa usando `baseURL`

**Ejemplo**:
```typescript
// URL relativa
const fullUrl = apiClient.getImageUrl('/images/users/uuid.jpg');
// Retorna: "http://localhost:3006/images/users/uuid.jpg"

// URL completa (no modifica)
const fullUrl2 = apiClient.getImageUrl('https://example.com/image.jpg');
// Retorna: "https://example.com/image.jpg"

// Base64 (no modifica)
const fullUrl3 = apiClient.getImageUrl('data:image/jpeg;base64,...');
// Retorna: "data:image/jpeg;base64,..."
```

## Manejo de Errores

El cliente convierte errores HTTP en objetos `ApiError`:

```typescript
interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
```

**Tipos de errores manejados**:
- **Errores HTTP**: Errores de respuesta del servidor (400, 401, 404, etc.)
- **Errores de red**: Errores de conexión (ERR_CONNECTION_REFUSED, Failed to fetch, etc.)
  - Detecta específicamente `ERR_CONNECTION_REFUSED` y otros errores de red
  - Muestra mensaje: "No se pudo conectar con el servidor. Verifica que el servidor esté funcionando y que la URL sea correcta."
- **Errores desconocidos**: Cualquier otro error inesperado

## Autenticación

Todas las peticiones incluyen cookies automáticamente (`credentials: 'include'`).

## Variables de Entorno

- `VITE_API_BASE_URL`: URL base del backend (default: `http://localhost:3006`)
