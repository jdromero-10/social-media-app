# ProfileEditPage.tsx - Documentación

## Descripción
Página de edición de perfil del usuario que permite modificar datos personales (nombre, biografía) y la foto de perfil. Utiliza React Hook Form para la gestión del formulario y Yup para la validación.

## Funcionalidades

### Edición de Datos Personales
- **Nombre completo**: Campo de texto con validación (mínimo 2 caracteres, máximo 100)
- **Biografía**: Campo de texto multilínea con validación (máximo 500 caracteres)
- **Contador de caracteres**: Muestra el número de caracteres usados en la biografía

### Edición de Foto de Perfil
- **Selector de imagen**: Permite seleccionar una nueva imagen desde el dispositivo
- **Vista previa**: Muestra una vista previa de la imagen seleccionada antes de guardar
- **Eliminación**: Permite eliminar la foto de perfil actual
- **Validaciones**: 
  - Solo acepta archivos de imagen
  - Tamaño máximo: 5MB

## Componentes Utilizados

### Componentes Globales
- `Card`: Contenedor principal del formulario
- `Form`: Wrapper del formulario con manejo de submit
- `Input`: Campo de texto para el nombre
- `Button`: Botones de acción (Cancelar, Guardar)
- `Avatar`: Visualización de la foto de perfil (dentro de ProfilePhotoUploader)

### Componentes Locales
- `ProfilePhotoUploader`: Componente para seleccionar y previsualizar la foto de perfil

## Estado y Datos

### Estado Local
- `selectedFile: File | null`: Archivo de imagen seleccionado
- `isSubmitting: boolean`: Indica si se está enviando el formulario

### Datos del Usuario
- Se cargan mediante `useQuery` con la clave `['currentUser']`
- Endpoint: `GET /auth/me`
- Se pre-llenan los campos del formulario cuando se cargan los datos

## Validación

### Esquema Yup
```typescript
const profileEditSchema = yup.object({
  name: yup
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .required('El nombre es requerido'),
  bio: yup
    .string()
    .max(500, 'La biografía no puede exceder 500 caracteres')
    .nullable(),
});
```

## Proceso de Actualización

### 1. Selección de Imagen
```typescript
const handleFileSelect = (file: File | null) => {
  setSelectedFile(file);
};
```

### 2. Subida de Imagen
Cuando se selecciona un archivo, se sube al servidor:

```typescript
if (selectedFile) {
  try {
    const uploadResponse = await apiClient.uploadFile<{ imageUrl: string }>(
      '/upload/user-avatar',
      selectedFile,
      'image',
    );
    imageUrl = uploadResponse.imageUrl; // "/images/users/uuid.jpg"
  } catch (uploadError) {
    // Manejar error de subida
    showError('Error al subir la imagen. Intente de nuevo.');
    return;
  }
}
```

**Endpoint**: `POST /upload/user-avatar`
- **Autenticación**: Requerida (JWT)
- **Content-Type**: `multipart/form-data`
- **Campo**: `image` (File)
- **Validaciones**: Tipo de imagen (JPEG, PNG, GIF, WebP), tamaño máximo 5MB
- **Respuesta**: `{ imageUrl: "/images/users/uuid.jpg" }`

**Nota**: La imagen se guarda en el sistema de archivos del backend, no en la base de datos.

### 3. Actualización de Perfil
```typescript
const updatedUser = await usersApi.updateProfile(user.id, {
  ...data,
  imageUrl: imageUrl,
});
```

**Endpoint**: `PUT /users/:id` (donde `:id` es el ID del usuario actual)

**Body**:
```typescript
{
  name?: string;
  bio?: string | null;
  imageUrl?: string | null;
}
```

### 4. Actualización de Caché
Después de actualizar exitosamente:
```typescript
queryClient.invalidateQueries({ queryKey: ['currentUser'] });
```

Esto refresca los datos del usuario en toda la aplicación.

### 5. Navegación
Si la actualización es exitosa:
- Se muestra una notificación de éxito
- Se navega a `/profile` para ver el perfil actualizado

## Manejo de Errores

### Errores de Validación
- Se muestran debajo de cada campo usando `errors` de React Hook Form
- Los mensajes de error provienen del esquema de validación Yup

### Errores de API
- Se capturan en el bloque `catch`
- Se muestra una notificación de error usando `useToast`
- El mensaje de error proviene de la respuesta de la API o un mensaje genérico

## Eliminación de Foto de Perfil

Si el usuario hace clic en "Eliminar" en el `ProfilePhotoUploader`:
- `selectedFile` se establece en `null`
- `onFileSelect(null)` se llama
- Al enviar el formulario, `imageUrl` se establece en `null`
- El backend elimina la foto de perfil del usuario

## Notificaciones

### Éxito
```typescript
showSuccess('Perfil actualizado con éxito.');
```

### Error
```typescript
showError(
  apiError.message || 'Error al actualizar el perfil. Intente de nuevo.'
);
```

## Estados de Carga

### Cargando Datos Iniciales
```tsx
if (isLoading) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00b1c0] mb-4"></div>
        <p className="text-gray-600">Cargando perfil...</p>
      </div>
    </div>
  );
}
```

### Enviando Formulario
El botón "Guardar cambios" muestra un spinner y se deshabilita durante el envío:
```tsx
<Button
  type="submit"
  variant="primary"
  className="flex-1"
  isLoading={isSubmitting}
>
  {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
</Button>
```

## Almacenamiento de Imágenes

### Implementación Actual
- Las imágenes se suben al servidor usando `POST /upload/user-avatar`
- El servidor guarda el archivo en `images/users/uuid.jpg`
- Se guarda solo la URL relativa (`/images/users/uuid.jpg`) en la base de datos
- El frontend construye la URL completa usando `apiClient.getImageUrl()`

### Flujo Completo
1. Usuario selecciona imagen → Validación en frontend (tipo y tamaño)
2. Al guardar → Subida a `/upload/user-avatar`
3. Backend guarda → Archivo en `images/users/uuid.jpg`
4. Backend retorna → URL relativa: `/images/users/uuid.jpg`
5. Frontend actualiza → Perfil con la URL
6. Frontend muestra → Usa `apiClient.getImageUrl()` para construir URL completa

### Ventajas
- **Base de datos ligera**: Solo almacena URLs, no datos binarios
- **Mejor rendimiento**: URLs directas para acceso a imágenes
- **Escalabilidad**: Fácil migrar a almacenamiento en la nube
- **Caché**: Navegadores pueden cachear imágenes fácilmente

### Compatibilidad
- El sistema sigue soportando imágenes en base64 (para compatibilidad con datos existentes)
- `apiClient.getImageUrl()` detecta base64 y no lo modifica
- Las nuevas imágenes se guardan como archivos

### URLs de Imágenes
- **Formato relativo**: `/images/users/uuid.jpg`
- **Formato completo**: `http://localhost:3006/images/users/uuid.jpg`
- **Construcción**: `apiClient.getImageUrl('/images/users/uuid.jpg')` → URL completa

## Rutas

- **Ruta**: `/profile/edit`
- **Protección**: Requiere autenticación (dentro de `ProtectedRoute`)
- **Layout**: Se muestra dentro de `MainLayout`

## Dependencias

- `react-router-dom`: Para navegación
- `react-hook-form`: Para gestión del formulario
- `@hookform/resolvers/yup`: Para integración con Yup
- `yup`: Para validación del esquema
- `@tanstack/react-query`: Para gestión de estado del servidor
- `lucide-react`: Para iconos (si se usan)

## Mejoras Futuras

- [ ] Implementar servicio de almacenamiento en la nube
- [ ] Agregar recorte de imagen antes de subir
- [ ] Agregar compresión automática de imágenes
- [ ] Agregar indicador de progreso durante la subida
- [ ] Agregar validación de dimensiones de imagen
- [ ] Agregar soporte para múltiples formatos con mejor feedback
- [ ] Agregar historial de cambios de foto de perfil
