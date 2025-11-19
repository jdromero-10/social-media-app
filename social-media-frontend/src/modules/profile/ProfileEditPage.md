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

### 2. Conversión de Imagen
Cuando se selecciona un archivo, se convierte a base64:

```typescript
if (selectedFile) {
  imageUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(selectedFile);
  });
}
```

**Nota**: Esta es una solución temporal. En producción, se debe implementar un servicio de almacenamiento (S3, Cloudinary, etc.)

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
- Las imágenes se convierten a base64 y se guardan directamente en el campo `imageUrl` de la base de datos
- Formato: `data:image/[tipo];base64,[datos]`

### Limitaciones
- **Tamaño**: Base64 aumenta el tamaño de la imagen en ~33%
- **Rendimiento**: Las respuestas de la API pueden ser muy grandes
- **Base de datos**: Almacenar imágenes grandes en la base de datos no es escalable

### Recomendación para Producción
Implementar un servicio de almacenamiento en la nube:

1. **Opción 1: AWS S3**
   - Subir imagen a S3
   - Guardar URL de S3 en `imageUrl`
   - Ventajas: Escalable, económico, confiable

2. **Opción 2: Cloudinary**
   - Subir imagen a Cloudinary
   - Guardar URL de Cloudinary en `imageUrl`
   - Ventajas: Transformaciones automáticas, CDN incluido

3. **Opción 3: Firebase Storage**
   - Subir imagen a Firebase Storage
   - Guardar URL de Firebase en `imageUrl`
   - Ventajas: Integración fácil con Firebase

### Implementación Futura
```typescript
// Endpoint en el backend: POST /users/upload-avatar
const formData = new FormData();
formData.append('image', selectedFile);

const response = await apiClient.post<{ imageUrl: string }>(
  '/users/upload-avatar',
  formData
);

// Usar la URL retornada
imageUrl = response.imageUrl;
```

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
