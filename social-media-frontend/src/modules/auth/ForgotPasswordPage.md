# ForgotPasswordPage.tsx - Documentación

## Descripción
Página para solicitar un código de recuperación de contraseña. Es la primera página del flujo de recuperación de contraseña.

## Ruta
- **Path**: `/forgot-password`
- **Protección**: No requiere autenticación (página pública)

## Funcionalidad

### Formulario
- **Campo**: Email (requerido, validado)
- **Validación**: Email válido usando Yup
- **Envío**: Llama a `POST /auth/forgot-password`

### Flujo
1. Usuario ingresa su email
2. Al enviar, se llama al endpoint del backend
3. Si es exitoso:
   - Se muestra notificación INFO
   - Se navega a `/verify-code` con el email en el estado
4. Si hay error:
   - Se muestra notificación ERROR

## Componentes Utilizados

- `AuthLayout`: Layout compartido para páginas de autenticación
- `Card`: Contenedor del formulario
- `Form`: Wrapper del formulario
- `Input`: Campo de email
- `Button`: Botón de envío
- `ToastContainer`: Sistema de notificaciones

## Estados

- `isSubmitting`: Indica si se está enviando la solicitud
- El botón muestra "Enviando..." durante el envío

## Validación

```typescript
const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email('El email debe ser válido')
    .required('El email es requerido'),
});
```

## Navegación

Después de enviar exitosamente:
```typescript
navigate('/verify-code', {
  state: { email: data.email },
});
```

El email se pasa en el estado para pre-llenarlo en la siguiente página.

## Notificaciones

- **Éxito**: "Si el email existe, recibirás un código de recuperación en breve."
- **Error**: Mensaje de error del backend o genérico

## Diseño

- Usa `AuthLayout` con icono de Mail
- Título: "Recuperar Contraseña"
- Descripción: "Ingresa tu email y te enviaremos un código de verificación"
- Link a login: "¿Recordaste tu contraseña?"

## Mejoras Futuras

- Opción para reenviar código
- Contador de tiempo antes de poder solicitar otro código
- Indicador visual de envío exitoso

