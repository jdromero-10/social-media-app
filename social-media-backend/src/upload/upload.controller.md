# UploadController - Documentación

## Descripción
Controlador que expone endpoints HTTP para la subida de imágenes (avatares de usuario e imágenes de posts).

## Rutas

### POST /upload/user-avatar

Sube un avatar de usuario.

**Autenticación**: Requerida (`@UseGuards(JwtAuthGuard)`)

**Request**:
- Content-Type: `multipart/form-data`
- Campo: `image` (File)
  - Tipo: Archivo de imagen
  - Formatos permitidos: JPEG, JPG, PNG, GIF, WebP
  - Tamaño máximo: 5MB

**Response 200 OK**:
```json
{
  "imageUrl": "/images/users/550e8400-e29b-41d4-a716-446655440000.jpg",
  "message": "Avatar subido exitosamente"
}
```

**Errores**:
- `400 Bad Request`: Si no se proporcionó archivo o el archivo no es válido
- `401 Unauthorized`: Si no está autenticado

**Ejemplo (cURL)**:
```bash
curl -X POST http://localhost:3006/upload/user-avatar \
  -H "Cookie: jwt=..." \
  -F "image=@avatar.jpg"
```

### POST /upload/post-image

Sube una imagen para un post.

**Autenticación**: Requerida (`@UseGuards(JwtAuthGuard)`)

**Request**:
- Content-Type: `multipart/form-data`
- Campo: `image` (File)
  - Tipo: Archivo de imagen
  - Formatos permitidos: JPEG, JPG, PNG, GIF, WebP
  - Tamaño máximo: 5MB

**Response 200 OK**:
```json
{
  "imageUrl": "/images/posts/550e8400-e29b-41d4-a716-446655440000.jpg",
  "message": "Imagen subida exitosamente"
}
```

**Errores**:
- `400 Bad Request`: Si no se proporcionó archivo o el archivo no es válido
- `401 Unauthorized`: Si no está autenticado

**Ejemplo (cURL)**:
```bash
curl -X POST http://localhost:3006/upload/post-image \
  -H "Cookie: jwt=..." \
  -F "image=@post-image.jpg"
```

## Decoradores Utilizados

### `@Controller('upload')`
Define el prefijo de ruta base para todos los endpoints.

### `@Post('user-avatar')` / `@Post('post-image')`
Define el método HTTP y la ruta específica.

### `@UseGuards(JwtAuthGuard)`
Protege los endpoints, requiriendo autenticación JWT.

### `@UseInterceptors(FileInterceptor('image'))`
Intercepta el request para extraer el archivo del campo `image` en FormData.

### `@UploadedFile()`
Extrae el archivo del request.

### `@Request()`
Obtiene el objeto request completo (incluye `user` del JWT).

## Flujo de Request

1. Cliente envía FormData con archivo
2. `FileInterceptor` extrae el archivo
3. `JwtAuthGuard` valida el token JWT
4. Controlador llama a `UploadService.uploadImage()`
5. Servicio valida y guarda el archivo
6. Controlador retorna URL de la imagen

## Integración con Frontend

El frontend usa `apiClient.uploadFile()` para subir archivos:

```typescript
const response = await apiClient.uploadFile<{ imageUrl: string }>(
  '/upload/user-avatar',
  file,
  'image'
);

const imageUrl = response.imageUrl;
```

## Seguridad

- **Autenticación**: Solo usuarios autenticados pueden subir imágenes
- **Validación**: El servicio valida tipo y tamaño de archivo
- **Aislamiento**: Cada tipo de imagen se guarda en su propia carpeta
- **Nombres únicos**: UUID previene colisiones y path traversal

## Notas

- Los archivos se guardan localmente en `images/users/` o `images/posts/`
- Las URLs retornadas son relativas y deben combinarse con el baseURL del backend
- El frontend debe construir la URL completa: `http://localhost:3006${imageUrl}`

