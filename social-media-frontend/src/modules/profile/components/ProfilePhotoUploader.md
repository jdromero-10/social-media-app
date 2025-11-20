# ProfilePhotoUploader.tsx - Documentación

## Descripción
Componente reutilizable para la carga de foto de perfil. Muestra el avatar actual del usuario, permite seleccionar un nuevo archivo de imagen, y muestra una vista previa de la imagen seleccionada antes de la subida final.

## Props

### `currentAvatar?: string`
- **Tipo**: `string | undefined`
- **Requerido**: No
- **Descripción**: URL de la imagen de perfil actual del usuario (puede ser relativa, completa o base64)
- **Ejemplo**: 
  - URL relativa: `currentAvatar="/images/users/uuid.jpg"`
  - URL completa: `currentAvatar="http://localhost:3006/images/users/uuid.jpg"`
  - Base64: `currentAvatar="data:image/png;base64,..."`
- **Nota**: El componente usa `apiClient.getImageUrl()` para construir URLs completas desde URLs relativas

### `currentName: string`
- **Tipo**: `string`
- **Requerido**: Sí
- **Descripción**: Nombre del usuario para mostrar en el avatar si no hay imagen
- **Uso**: Se usa para generar las iniciales en el componente Avatar

### `onFileSelect: (file: File | null) => void`
- **Tipo**: Función callback
- **Requerido**: Sí
- **Descripción**: Función que se llama cuando se selecciona o elimina un archivo
- **Parámetros**:
  - `file: File | null`: El archivo seleccionado, o `null` si se eliminó la selección
- **Uso**: Se debe manejar en el componente padre para procesar la imagen

### `className?: string`
- **Tipo**: `string | undefined`
- **Requerido**: No
- **Descripción**: Clases CSS adicionales para el contenedor principal

## Funcionalidad

### Vista Previa
- Cuando se selecciona un archivo, se crea una vista previa usando `FileReader`
- Si hay preview, se muestra en lugar del avatar actual
- El preview se elimina si el usuario hace clic en "Eliminar"

### Validaciones
- **Tipo de archivo**: Solo acepta archivos de imagen (`image/*`)
- **Tamaño máximo**: 5MB (5 * 1024 * 1024 bytes)
- Si el archivo no cumple las validaciones, se rechaza silenciosamente

### Interfaz de Usuario
- **Avatar grande**: Muestra el avatar actual o la preview (tamaño `lg`, 32x32)
- **Overlay hover**: Al pasar el cursor sobre el avatar, muestra un overlay oscuro con icono de cámara
- **Botones de acción**:
  - "Seleccionar foto" / "Cambiar foto": Abre el selector de archivos
  - "Eliminar": Elimina la selección y restaura el avatar original (solo visible cuando hay preview)
- **Información de ayuda**: Muestra formatos soportados y tamaño máximo

## Estilos

### Avatar
- Tamaño: `lg` (w-32 h-32, text-2xl)
- Posición: Centrado en el contenedor
- Efecto hover: Escala ligeramente (scale-105)

### Overlay
- `absolute inset-0`: Cubre todo el avatar
- `bg-black/0 hover:bg-black/50`: Fondo transparente que se oscurece en hover
- `transition-all duration-200`: Transición suave
- Icono de cámara: Aparece en hover con opacidad 0 → 100

### Iconos
- **Cámara en botón**: Color cyan (`text-[#00b1c0]`) para mantener consistencia con la paleta
- **Cámara en overlay**: Color blanco para contraste sobre fondo oscuro

## Ejemplo de Uso

```tsx
import { ProfilePhotoUploader } from './components/ProfilePhotoUploader';
import { useState } from 'react';

function ProfileEditForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <ProfilePhotoUploader
      currentAvatar={user?.imageUrl}
      currentName={user?.name || 'Usuario'}
      onFileSelect={(file) => setSelectedFile(file)}
    />
  );
}
```

## Flujo de Trabajo

1. Usuario hace clic en avatar o botón
2. Se abre el selector de archivos del sistema
3. Usuario selecciona un archivo
4. Se valida el archivo (tipo y tamaño)
5. Si es válido:
   - Se crea un preview usando FileReader
   - Se muestra preview en el avatar
   - Se llama `onFileSelect(file)`
   - Se muestra botón "Eliminar"
6. Si el usuario hace clic en "Eliminar":
   - Se elimina el preview
   - Se restaura el avatar original
   - Se llama `onFileSelect(null)`

## Integración con Backend

El componente solo maneja la selección y preview del archivo. La subida real debe manejarse en el componente padre:

```tsx
const handleFileSelect = async (file: File | null) => {
  if (file) {
    // Subir imagen al servidor
    const uploadResponse = await apiClient.uploadFile<{ imageUrl: string }>(
      '/upload/user-avatar',
      file,
      'image',
    );
    // Actualizar imageUrl con la URL retornada
    const imageUrl = uploadResponse.imageUrl; // "/images/users/uuid.jpg"
    // Guardar imageUrl en el perfil del usuario
  } else {
    // Usuario eliminó la foto
    // Establecer imageUrl a null
  }
};
```

### Construcción de URLs
El componente usa `apiClient.getImageUrl()` para construir URLs completas:
- Si es URL relativa (`/images/...`), agrega el `baseURL`
- Si ya es URL completa o base64, la retorna tal cual

## Notas Importantes

### Almacenamiento de Imágenes
- **Actual**: Las imágenes se suben al servidor y se guarda solo la URL en el campo `imageUrl`
- **Ubicación**: Archivos guardados en `images/users/` en el backend
- **URL**: Se guarda URL relativa (`/images/users/uuid.jpg`) en la base de datos
- **Ventaja**: Base de datos ligera, mejor rendimiento, fácil escalabilidad

### Eliminación de Foto
- Cuando `onFileSelect(null)` se llama, el componente padre debe interpretar esto como una solicitud de eliminar la foto
- El componente padre debe actualizar `imageUrl` a `null` en el backend

## Accesibilidad

- El input de archivo tiene `aria-label` para lectores de pantalla
- El botón de overlay tiene `aria-label="Cambiar foto de perfil"`
- Los botones tienen iconos descriptivos
- El contraste de colores cumple con estándares WCAG

## Mejoras Futuras

- Soporte para arrastrar y soltar (drag & drop)
- Recorte de imagen antes de subir
- Compresión automática de imágenes grandes
- Validación más estricta de dimensiones de imagen
- Soporte para múltiples formatos con mejor feedback
- Indicador de progreso durante la subida
- Integración con servicio de almacenamiento en la nube
