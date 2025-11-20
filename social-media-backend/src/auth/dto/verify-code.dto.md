# verify-code.dto.ts - Documentación

## Descripción
DTO (Data Transfer Object) para verificar un código de recuperación de contraseña. Define la estructura de datos y validaciones para el endpoint `POST /auth/verify-code`.

## Estructura

```typescript
export class VerifyCodeDto {
  email: string;
  code: string;
}
```

## Campos

### `email: string`
- **Tipo**: String
- **Requerido**: Sí
- **Validaciones**:
  - `@IsEmail()`: Debe ser un email válido
  - `@IsNotEmpty()`: No puede estar vacío
- **Descripción**: Email del usuario que está verificando el código
- **Ejemplo**: `"usuario@example.com"`

### `code: string`
- **Tipo**: String
- **Requerido**: Sí
- **Validaciones**:
  - `@IsString()`: Debe ser una cadena de texto
  - `@IsNotEmpty()`: No puede estar vacío
  - `@Length(6, 6)`: Debe tener exactamente 6 caracteres
- **Descripción**: Código de 6 dígitos recibido por email
- **Ejemplo**: `"123456"`

## Uso

Este DTO se usa en el endpoint `POST /auth/verify-code`:

```typescript
@Post('verify-code')
async verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
  return await this.authService.verifyCode(verifyCodeDto);
}
```

## Ejemplo de Request

```json
{
  "email": "usuario@example.com",
  "code": "123456"
}
```

## Respuesta

### Éxito (200 OK)
```json
{
  "valid": true,
  "message": "Código verificado correctamente"
}
```

### Error (400 Bad Request)
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
- **@Length(6, 6)**: Valida que tenga exactamente 6 caracteres

## Validaciones Adicionales en el Servicio

Además de las validaciones del DTO, el servicio realiza:

1. **Verificación de existencia**: El usuario debe existir
2. **Verificación de código**: El código debe existir y no estar usado
3. **Verificación de expiración**: El código no debe haber expirado

## Notas de Seguridad

- Solo se busca el código más reciente no usado
- Los códigos expiran después de 15 minutos
- Los códigos solo se pueden usar una vez

