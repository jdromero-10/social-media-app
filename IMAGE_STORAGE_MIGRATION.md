# Migración de Almacenamiento de Imágenes

## Resumen
Se ha migrado el sistema de almacenamiento de imágenes de base64 en la base de datos a almacenamiento local de archivos en el backend, guardando solo las URLs en la base de datos.

## Cambios Implementados

### Backend

#### Nuevo Módulo: UploadModule
- **Ubicación**: `social-media-backend/src/upload/`
- **Archivos**:
  - `upload.module.ts`: Módulo NestJS
  - `upload.service.ts`: Lógica de negocio para uploads
  - `upload.controller.ts`: Endpoints HTTP

#### Endpoints Nuevos
1. **POST /upload/user-avatar**
   - Sube avatares de usuario
   - Retorna: `{ imageUrl: "/images/users/uuid.jpg" }`

2. **POST /upload/post-image**
   - Sube imágenes de posts
   - Retorna: `{ imageUrl: "/images/posts/uuid.jpg" }`

#### Configuración
- **main.ts**: 
  - Configurado para servir archivos estáticos desde `/images/`
  - **CORS para archivos estáticos**: Se agregó un middleware personalizado que agrega headers CORS a las respuestas de archivos estáticos
  - Esto permite que el frontend pueda cargar las imágenes mediante `fetch()` sin errores de CORS
  - El middleware maneja preflight requests (OPTIONS) para archivos estáticos
- **app.module.ts**: Importado `UploadModule`

#### Estructura de Carpetas
```
social-media-backend/
└── images/
    ├── users/    # Avatares de usuarios
    └── posts/    # Imágenes de posts
```

### Frontend

#### apiClient.ts
- **Nuevo método**: `uploadFile<T>()` - Para subir archivos
- **Nuevo método**: `getImageUrl()` - Para construir URLs completas desde URLs relativas

#### Componentes Actualizados
1. **ProfileEditPage.tsx**
   - Ahora sube la imagen antes de actualizar el perfil
   - Usa `apiClient.uploadFile()` en lugar de convertir a base64

2. **CreatePostForm.tsx**
   - Sube la imagen antes de crear el post
   - Muestra estado de carga durante la subida

3. **ProfilePhotoUploader.tsx**
   - Usa `apiClient.getImageUrl()` para mostrar imágenes correctamente

4. **PostCard.tsx**
   - Usa `apiClient.getImageUrl()` para construir URLs de imágenes

5. **ProfilePage.tsx**
   - Usa `apiClient.getImageUrl()` para mostrar avatar

6. **NavBar.tsx**
   - Usa `apiClient.getImageUrl()` para mostrar avatar

## Flujo de Trabajo

### Subir Avatar de Usuario
1. Usuario selecciona imagen en `ProfileEditPage`
2. Al guardar, se llama a `POST /upload/user-avatar`
3. Backend guarda el archivo en `images/users/uuid.jpg`
4. Backend retorna URL relativa: `/images/users/uuid.jpg`
5. Frontend actualiza el perfil con la URL
6. Frontend muestra la imagen usando `apiClient.getImageUrl()`

### Subir Imagen de Post
1. Usuario selecciona imagen en `CreatePostForm`
2. Al publicar, se llama a `POST /upload/post-image`
3. Backend guarda el archivo en `images/posts/uuid.jpg`
4. Backend retorna URL relativa: `/images/posts/uuid.jpg`
5. Frontend crea el post con la URL
6. Frontend muestra la imagen usando `apiClient.getImageUrl()`

## Validaciones

### Backend
- Tipos permitidos: JPEG, JPG, PNG, GIF, WebP
- Tamaño máximo: 5MB
- Autenticación requerida (JWT)

### Frontend
- Validación de tipo de archivo
- Validación de tamaño (5MB)
- Preview antes de subir

## URLs de Imágenes

### Formato
- **Relativas**: `/images/users/uuid.jpg` o `/images/posts/uuid.jpg`
- **Completas**: `http://localhost:3006/images/users/uuid.jpg`

### Construcción
El frontend usa `apiClient.getImageUrl()` para construir URLs completas:
- Si es URL relativa (`/images/...`), agrega el `baseURL`
- Si ya es URL completa o base64, la retorna tal cual

## Compatibilidad

### Imágenes Existentes (Base64)
- El sistema sigue soportando imágenes en base64 (para compatibilidad)
- `apiClient.getImageUrl()` detecta base64 y no lo modifica
- Las nuevas imágenes se guardan como archivos

### Migración de Datos Existentes
Para migrar imágenes existentes en base64 a archivos:
1. Crear script que lea imágenes base64 de la BD
2. Guardarlas como archivos en `images/users/` o `images/posts/`
3. Actualizar URLs en la BD

## Ventajas

1. **Base de datos más ligera**: No almacena imágenes grandes
2. **Mejor rendimiento**: URLs directas para acceso a imágenes
3. **Escalabilidad**: Fácil migrar a almacenamiento en la nube
4. **Caché**: Navegadores pueden cachear imágenes fácilmente
5. **CDN**: Fácil integrar CDN en el futuro

## Optimización de Imágenes

Para información detallada sobre la optimización de imágenes (recorte, compresión, visualización), ver:
- **`IMAGE_OPTIMIZATION.md`**: Documentación completa del sistema de optimización

### Características Implementadas
- ✅ Detección automática de imágenes grandes (>1500px o >1.5MB)
- ✅ Modal de recorte interactivo (componente global reutilizable)
- ✅ Visualización optimizada en posts (300px/350px de altura)
- ✅ Restricciones de tamaño para prevenir imágenes demasiado grandes

## Próximos Pasos (Opcional)

1. **Limpieza de archivos**: Implementar cleanup de imágenes no usadas
2. **Compresión automática**: Comprimir imágenes antes de subir
3. **Thumbnails**: Generar miniaturas automáticamente
4. **Cloud Storage**: Migrar a S3, Cloudinary, etc. para producción

## Dependencias Nuevas

### Backend
- `multer`: Para manejar multipart/form-data
- `@types/multer`: Tipos TypeScript
- `uuid`: Para generar nombres únicos
- `@types/uuid`: Tipos TypeScript

### Frontend
- No se agregaron nuevas dependencias

## Documentación

Todos los archivos creados/modificados tienen documentación `.md`:
- `upload.module.md`
- `upload.service.md`
- `upload.controller.md`
- `apiClient.md`