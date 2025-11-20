# reset-password.dto.ts - Documentación

## Descripción
DTO (Data Transfer Object) para restablecer la contraseña del usuario. Define la estructura de datos y validaciones para el endpoint `POST /auth/reset-password`.

## Estructura

```typescript
export class ResetPasswordDto {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}
```

## Campos

### `email: string`
- **Tipo**: String
- **Requerido**: Sí
- **Validaciones**:
  - `@IsEmail()`: Debe ser un email válido
  - `@IsNotEmpty()`: No puede estar vacío
- **Descripción**: Email del usuario que está restableciendo la contraseña
- **Ejemplo**: `"usuario@example.com"`

### `code: string`
- **Tipo**: String
- **Requerido**: Sí
- **Validaciones**:
  - `@IsString()`: Debe ser una cadena de texto
  - `@IsNotEmpty()`: No puede estar vacío
  - `@Length(6, 6)`: Debe tener exactamente 6 caracteres
- **Descripción**: Código de 6 dígitos previamente verificado
- **Ejemplo**: `"123456"`

### `newPassword: string`
- **Tipo**: String
- **Requerido**: Sí
- **Validaciones**:
  - `@IsString()`: Debe ser una cadena de texto
  - `@IsNotEmpty()`: No puede estar vacío
  - `@MinLength(6)`: Debe tener al menos 6 caracteres
- **Descripción**: Nueva contraseña del usuario
- **Ejemplo**: `"nuevaPassword123"`

### `confirmPassword: string`
- **Tipo**: String
- **Requerido**: Sí
- **Validaciones**:
  - `@IsString()`: Debe ser una cadena de texto
  - `@IsNotEmpty()`: No puede estar vacío
- **Descripción**: Confirmación de la nueva contraseña (debe coincidir con `newPassword`)
- **Ejemplo**: `"nuevaPassword123"`

## Uso

Este DTO se usa en el endpoint `POST /auth/reset-password`:

```typescript
@Post('reset-password')
async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
  return await this.authService.resetPassword(resetPasswordDto);
}
```

## Ejemplo de Request

```json
{
  "email": "usuario@example.com",
  "code": "123456",
  "newPassword": "nuevaPassword123",
  "confirmPassword": "nuevaPassword123"
}
```

## Respuesta

### Éxito (200 OK)
```json
{
  "message": "Contraseña restablecida exitosamente"
}
```

### Error (400 Bad Request)
```json
{
  "message": "Las contraseñas no coinciden",
  "statusCode": 400
}
```

O:

```json
{
  "message": "Código inválido",
  "statusCode": 400
}
```

O:

```json
{
  "message": "El código ha expirado",
  "statusCode": 400
}
```

## Validaciones

Todas las validaciones se realizan usando `class-validator`:

- **@IsEmail()**: Valida formato de email
- **@IsNotEmpty()**: Valida que el campo no esté vacío
- **@IsString()**: Valida que sea una cadena de texto
- **@Length(6, 6)**: Valida que el código tenga exactamente 6 caracteres
- **@MinLength(6)**: Valida que la contraseña tenga al menos 6 caracteres

## Validaciones Adicionales en el Servicio

Además de las validaciones del DTO, el servicio realiza:

1. **Coincidencia de contraseñas**: `newPassword` debe coincidir con `confirmPassword`
2. **Verificación de existencia**: El usuario debe existir
3. **Re-validación del código**: El código debe ser válido y no expirado
4. **Hasheo de contraseña**: La contraseña se hashea con bcrypt antes de guardarse
5. **Marcado de código**: El código se marca como usado después de restablecer la contraseña

## Notas de Seguridad

- La contraseña se hashea con bcrypt (10 salt rounds) antes de guardarse
- El código se re-valida antes de cambiar la contraseña
- El código se marca como usado para evitar reutilización
- Solo se acepta el código más reciente no usado

