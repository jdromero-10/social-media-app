# auth.service.ts - Documentación

## Descripción
Servicio que gestiona la lógica de autenticación y recuperación de contraseña. Proporciona métodos para registro, login, validación de campos y el flujo completo de recuperación de contraseña.

## Métodos de Autenticación

### `register(registerDto: RegisterDto)`
Crea un nuevo usuario en el sistema.

### `login(loginDto: LoginDto)`
Autentica un usuario existente.

### `validateFieldUniqueness(field, value)`
Valida si un campo (email o username) es único.

## Métodos de Recuperación de Contraseña

### `forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }>`

Solicita un código de recuperación de contraseña.

**Parámetros**:
- `forgotPasswordDto`: Objeto con el email del usuario

**Retorna**: Mensaje genérico de éxito (por seguridad)

**Lógica**:
1. Busca el usuario por email
2. Si existe:
   - Genera un código de 6 dígitos
   - Calcula fecha de expiración (15 minutos)
   - Guarda el código en la base de datos
   - Envía el código por email
3. Siempre retorna el mismo mensaje (por seguridad)

**Ejemplo**:
```typescript
const result = await authService.forgotPassword({
  email: 'usuario@example.com'
});
// { message: "Si el email existe, recibirás un código..." }
```

---

### `verifyCode(verifyCodeDto: VerifyCodeDto): Promise<{ valid: boolean; message: string }>`

Verifica un código de recuperación de contraseña.

**Parámetros**:
- `verifyCodeDto`: Objeto con email y código de 6 dígitos

**Retorna**: Indicador de validez y mensaje

**Lógica**:
1. Busca el usuario por email
2. Busca el código más reciente no usado
3. Valida que el código coincida
4. Valida que no haya expirado
5. Retorna resultado

**Errores**:
- `NotFoundException`: Si el usuario no existe
- `BadRequestException`: Si el código es inválido o expirado

**Ejemplo**:
```typescript
const result = await authService.verifyCode({
  email: 'usuario@example.com',
  code: '123456'
});
// { valid: true, message: "Código verificado correctamente" }
```

---

### `resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }>`

Restablece la contraseña del usuario.

**Parámetros**:
- `resetPasswordDto`: Objeto con email, código, nueva contraseña y confirmación

**Retorna**: Mensaje de éxito

**Lógica**:
1. Valida que las contraseñas coincidan
2. Busca el usuario por email
3. Re-valida el código (debe ser válido y no expirado)
4. Hashea la nueva contraseña con bcrypt
5. Actualiza la contraseña del usuario
6. Marca el código como usado

**Errores**:
- `BadRequestException`: Si las contraseñas no coinciden, código inválido o expirado
- `NotFoundException`: Si el usuario no existe

**Ejemplo**:
```typescript
const result = await authService.resetPassword({
  email: 'usuario@example.com',
  code: '123456',
  newPassword: 'nuevaPassword123',
  confirmPassword: 'nuevaPassword123'
});
// { message: "Contraseña restablecida exitosamente" }
```

---

### `generateResetCode(): string` (privado)

Genera un código aleatorio de 6 dígitos.

**Retorna**: String de 6 dígitos (ej: "123456")

---

## Dependencias

- `UsersService`: Para operaciones con usuarios
- `JwtService`: Para generación de tokens JWT
- `EmailService`: Para envío de emails
- `PasswordResetCodeRepository`: Para operaciones con códigos de reseteo

## Seguridad

- Los códigos expiran después de 15 minutos
- Los códigos solo se pueden usar una vez
- Las contraseñas se hashean con bcrypt (10 salt rounds)
- No se revela si un email existe o no en `forgotPassword`
- Se re-valida el código antes de cambiar la contraseña

