# ResetPasswordPage.tsx - Documentación

## Descripción
Página para restablecer la contraseña del usuario. Es la tercera y última página del flujo de recuperación de contraseña.

## Ruta
- **Path**: `/reset-password`
- **Protección**: No requiere autenticación (página pública)

## Funcionalidad

### Formulario
- **Campo Email**: Deshabilitado, pre-llenado desde la página anterior
- **Campo Nueva Contraseña**: `PasswordInput` con toggle de visibilidad
- **Campo Confirmar Contraseña**: `PasswordInput` con toggle de visibilidad
- **Validación**: 
  - Contraseña mínimo 6 caracteres
  - Las contraseñas deben coincidir
- **Envío**: Llama a `POST /auth/reset-password`

### Flujo
1. Se obtiene email y código del estado de navegación
2. Si no hay email o código, redirige a `/forgot-password`
3. Usuario ingresa nueva contraseña y confirmación
4. Al enviar:
   - Valida que las contraseñas coincidan (Yup)
   - Llama al endpoint del backend
5. Si es exitoso:
   - Muestra notificación SUCCESS
   - Espera 2 segundos
   - Navega a `/login`
6. Si hay error:
   - Muestra notificación ERROR

## Componentes Utilizados

- `AuthLayout`: Layout compartido para páginas de autenticación
- `Card`: Contenedor del formulario
- `Form`: Wrapper del formulario con React Hook Form
- `Input`: Campo de email (deshabilitado)
- `PasswordInput`: Campos de contraseña con toggle de visibilidad
- `Button`: Botón de restablecimiento
- `ToastContainer`: Sistema de notificaciones

## Estados

- `email`: Email del usuario (del estado de navegación)
- `code`: Código verificado (del estado de navegación)
- `isSubmitting`: Indica si se está restableciendo la contraseña

## Validación

```typescript
const resetPasswordSchema = yup.object({
  newPassword: yup
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Las contraseñas no coinciden')
    .required('La confirmación de contraseña es requerida'),
});
```

## Navegación

### Entrada
- Requiere email y código del estado de navegación
- Si no hay email o código, redirige a `/forgot-password`

### Salida (éxito)
```typescript
showSuccess('Contraseña restablecida exitosamente. Redirigiendo...');
setTimeout(() => {
  navigate('/login', { replace: true });
}, 2000);
```

## Notificaciones

- **Éxito**: "Contraseña restablecida exitosamente. Redirigiendo..."
- **Error**: Mensaje del backend o "Error al restablecer la contraseña. Intenta de nuevo."

## Diseño

- Usa `AuthLayout` con icono de Lock
- Título: "Nueva Contraseña"
- Descripción: "Ingresa tu nueva contraseña"
- Link a login: "¿Recordaste tu contraseña?"

## Características de PasswordInput

- Toggle de visibilidad (mostrar/ocultar)
- Validación visual de errores
- Helper text para requisitos
- Estilos consistentes con la paleta de colores

## Seguridad

- La contraseña se hashea en el backend antes de guardarse
- El código se re-valida antes de cambiar la contraseña
- El código se marca como usado después de cambiar la contraseña
- Las contraseñas no se almacenan en el estado de navegación

## Mejoras Futuras

- Indicador de fortaleza de contraseña
- Sugerencias de contraseña segura
- Validación de contraseñas comunes
- Opción para mostrar/ocultar ambas contraseñas simultáneamente

