# UploadService - Documentación

## Descripción
Servicio que maneja la lógica de negocio para la subida y eliminación de archivos de imágenes.

## Dependencias

```typescript
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import * as uuid from 'uuid';
```

## Propiedades

### `uploadsDir: string`
Ruta absoluta a la carpeta de uploads (`images/` en la raíz del proyecto).

### `logger: Logger`
Logger de NestJS para registrar operaciones.

## Métodos Públicos

### `uploadImage(file: Express.Multer.File, imageType: ImageType): Promise<string>`

Sube una imagen al sistema de archivos y retorna su URL relativa.

**Parámetros**:
- `file`: Archivo de imagen de Multer
- `imageType`: Tipo de imagen (`ImageType.USER_AVATAR` o `ImageType.POST_IMAGE`)

**Retorna**: `Promise<string>` - URL relativa (ej: `/images/users/uuid.jpg`)

**Errores**:
- `BadRequestException`: Si el archivo no es válido, tipo no permitido, o excede 5MB

**Flujo**:
1. Valida el archivo (tipo y tamaño)
2. Genera nombre único con UUID
3. Guarda el archivo en la carpeta correspondiente
4. Retorna URL relativa

**Ejemplo**:
```typescript
const imageUrl = await uploadService.uploadImage(file, ImageType.USER_AVATAR);
// Retorna: "/images/users/550e8400-e29b-41d4-a716-446655440000.jpg"
```

### `deleteImage(imageUrl: string): Promise<void>`

Elimina una imagen del sistema de archivos.

**Parámetros**:
- `imageUrl`: URL relativa de la imagen (ej: `/images/users/uuid.jpg`)

**Retorna**: `Promise<void>`

**Comportamiento**:
- Si la URL no es local (no empieza con `/images/`), no hace nada
- Si el archivo no existe, solo registra en logs (no lanza error)
- Si hay error al eliminar, solo registra en logs

**Ejemplo**:
```typescript
await uploadService.deleteImage('/images/users/uuid.jpg');
```

## Métodos Privados

### `ensureDirectoriesExist(): void`

Asegura que los directorios necesarios existan. Se llama en el constructor.

**Crea**:
- `images/`
- `images/users/`
- `images/posts/`

### `validateImageFile(file: Express.Multer.File): void`

Valida que el archivo sea una imagen válida.

**Validaciones**:
- Archivo existe
- Tipo MIME permitido: `image/jpeg`, `image/jpg`, `image/png`, `image/gif`, `image/webp`
- Tamaño máximo: 5MB

**Errores**:
- `BadRequestException`: Si alguna validación falla

### `generateFileName(originalName: string): string`

Genera un nombre único para el archivo usando UUID.

**Parámetros**:
- `originalName`: Nombre original del archivo

**Retorna**: Nombre único con extensión (ej: `550e8400-e29b-41d4-a716-446655440000.jpg`)

**Lógica**:
- Extrae la extensión del nombre original
- Genera UUID v4
- Combina: `{uuid}.{extension}`

## ImageType Enum

```typescript
export enum ImageType {
  USER_AVATAR = 'users',
  POST_IMAGE = 'posts',
}
```

## Manejo de Errores

El servicio lanza `BadRequestException` en los siguientes casos:
- No se proporcionó archivo
- Tipo de archivo no permitido
- Archivo excede 5MB
- Error al guardar el archivo

Para `deleteImage`, los errores se registran pero no se lanzan (operación no crítica).

## Logging

El servicio registra:
- Creación de directorios
- Imágenes guardadas exitosamente
- Errores al guardar/eliminar imágenes

## Ejemplo Completo

```typescript
// En el controlador
@Post('user-avatar')
@UseInterceptors(FileInterceptor('image'))
async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
  const imageUrl = await this.uploadService.uploadImage(
    file,
    ImageType.USER_AVATAR
  );
  
  return { imageUrl, message: 'Avatar subido exitosamente' };
}
```

