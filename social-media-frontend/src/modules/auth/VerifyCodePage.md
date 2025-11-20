# VerifyCodePage.tsx - Documentación

## Descripción
Página para verificar el código de recuperación de contraseña recibido por email. Es la segunda página del flujo de recuperación de contraseña.

## Ruta
- **Path**: `/verify-code`
- **Protección**: No requiere autenticación (página pública)

## Funcionalidad

### Formulario
- **Campo Email**: Deshabilitado, pre-llenado desde la página anterior
- **Campo Código**: Input de 6 dígitos usando `CodeInput`
- **Validación**: El código debe tener exactamente 6 dígitos
- **Envío**: Llama a `POST /auth/verify-code`

### Flujo
1. Se obtiene el email del estado de navegación
2. Si no hay email, redirige a `/forgot-password`
3. Usuario ingresa el código de 6 dígitos
4. Al enviar:
   - Valida que el código tenga 6 dígitos
   - Llama al endpoint del backend
5. Si es exitoso:
   - Navega a `/reset-password` con email y código en el estado
6. Si hay error:
   - Muestra notificación ERROR

## Componentes Utilizados

- `AuthLayout`: Layout compartido para páginas de autenticación
- `Card`: Contenedor del formulario
- `Form`: Wrapper del formulario
- `Input`: Campo de email (deshabilitado)
- `CodeInput`: Input de código de 6 dígitos
- `Button`: Botón de verificación
- `ToastContainer`: Sistema de notificaciones

## Estados

- `email`: Email del usuario (del estado de navegación)
- `code`: Código ingresado (string de 6 dígitos)
- `isSubmitting`: Indica si se está verificando el código
- El botón se deshabilita si el código no tiene 6 dígitos

## Validación

- El código debe tener exactamente 6 dígitos
- Validación en el frontend antes de enviar
- Validación adicional en el backend

## Navegación

### Entrada
- Requiere email del estado de navegación
- Si no hay email, redirige a `/forgot-password`

### Salida (éxito)
```typescript
navigate('/reset-password', {
  state: { email, code },
});
```

El email y código se pasan en el estado para la siguiente página.

## Notificaciones

- **Error**: Mensaje del backend o "Código inválido. Por favor, verifica e intenta de nuevo."

## Diseño

- Usa `AuthLayout` con icono de KeyRound
- Título: "Verificar Código"
- Descripción: "Ingresa el código de 6 dígitos que enviamos a tu email"
- Link a forgot-password: "¿No recibiste el código?"

## Características del CodeInput

- Auto-focus en el primer input
- Movimiento automático de foco entre inputs
- Soporte para pegar código completo
- Solo acepta números
- Validación visual de errores

## Mejoras Futuras

- Contador de tiempo de expiración del código
- Opción para reenviar código
- Indicador de intentos restantes
- Animación al completar el código

