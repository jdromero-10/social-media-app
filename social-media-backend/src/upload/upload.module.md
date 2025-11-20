# UploadModule - Documentación

## Descripción
Módulo NestJS para manejar la subida de archivos de imágenes (avatares de usuario e imágenes de posts). Implementa almacenamiento local de archivos en el sistema de archivos del servidor.

## Estructura

```
upload/
├── upload.module.ts      # Módulo principal
├── upload.service.ts     # Lógica de negocio para uploads
└── upload.controller.ts  # Endpoints HTTP
```

## Dependencias

- `multer`: Para manejar multipart/form-data
- `uuid`: Para generar nombres únicos de archivos
- `fs`: Para operaciones de sistema de archivos

## Características

### Almacenamiento Local
- Las imágenes se guardan en la carpeta `images/` en la raíz del proyecto backend
- Estructura de carpetas:
  ```
  images/
  ├── users/    # Avatares de usuarios
  └── posts/    # Imágenes de posts
  ```

### Validaciones
- **Tipos permitidos**: JPEG, JPG, PNG, GIF, WebP
- **Tamaño máximo**: 5MB por archivo
- **Nombres únicos**: Se generan usando UUID v4

### Servicio de Archivos Estáticos
- NestJS sirve los archivos desde `/images/` usando `useStaticAssets`
- URLs accesibles: `http://localhost:3006/images/users/uuid.jpg`

## Endpoints

### POST /upload/user-avatar
Sube un avatar de usuario.

**Autenticación**: Requerida (JwtAuthGuard)

**Request**:
- Content-Type: `multipart/form-data`
- Campo: `image` (File)

**Response**:
```json
{
  "imageUrl": "/images/users/uuid.jpg",
  "message": "Avatar subido exitosamente"
}
```

### POST /upload/post-image
Sube una imagen para un post.

**Autenticación**: Requerida (JwtAuthGuard)

**Request**:
- Content-Type: `multipart/form-data`
- Campo: `image` (File)

**Response**:
```json
{
  "imageUrl": "/images/posts/uuid.jpg",
  "message": "Imagen subida exitosamente"
}
```

## UploadService

### Métodos

#### `uploadImage(file: Express.Multer.File, imageType: ImageType): Promise<string>`
Sube una imagen y retorna la URL relativa.

**Parámetros**:
- `file`: Archivo de imagen
- `imageType`: Tipo de imagen (`USER_AVATAR` o `POST_IMAGE`)

**Retorna**: URL relativa (ej: `/images/users/uuid.jpg`)

**Errores**:
- `BadRequestException`: Si el archivo no es válido o excede el tamaño máximo

#### `deleteImage(imageUrl: string): Promise<void>`
Elimina una imagen del sistema de archivos.

**Parámetros**:
- `imageUrl`: URL relativa de la imagen

**Nota**: No lanza errores si la imagen no existe (solo registra en logs)

## Configuración

### main.ts
```typescript
// Configurar carpeta de imágenes estáticas
app.useStaticAssets(join(__dirname, '..', 'images'), {
  prefix: '/images/',
});
```

### app.module.ts
```typescript
@Module({
  imports: [
    // ... otros módulos
    UploadModule,
  ],
})
```

## Variables de Entorno

No se requieren variables de entorno adicionales para este módulo.

## Seguridad

- **Autenticación**: Todos los endpoints requieren JWT
- **Validación de tipos**: Solo se permiten tipos de imagen válidos
- **Límite de tamaño**: 5MB máximo por archivo
- **Nombres únicos**: UUID previene colisiones y ataques de path traversal

## Migración desde Base64

Este módulo reemplaza el almacenamiento de imágenes en base64 en la base de datos por almacenamiento local de archivos.

**Ventajas**:
- Base de datos más ligera
- Mejor rendimiento
- URLs directas para acceso a imágenes
- Escalabilidad mejorada

## Ejemplo de Uso (Frontend)

```typescript
import { apiClient } from './api/apiClient';

// Subir avatar
const file = // ... archivo seleccionado
const response = await apiClient.uploadFile<{ imageUrl: string }>(
  '/upload/user-avatar',
  file,
  'image'
);

// Usar la URL retornada
const imageUrl = response.imageUrl; // "/images/users/uuid.jpg"
```

## Notas

- Los directorios se crean automáticamente si no existen
- Las imágenes antiguas no se eliminan automáticamente (se requiere limpieza manual o implementación de cleanup)
- Para producción, considerar migrar a almacenamiento en la nube (S3, Cloudinary, etc.)

