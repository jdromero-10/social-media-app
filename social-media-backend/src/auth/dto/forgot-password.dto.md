# forgot-password.dto.ts - Documentación

## Descripción
DTO (Data Transfer Object) para solicitar un código de recuperación de contraseña. Define la estructura de datos y validaciones para el endpoint `POST /auth/forgot-password`.

## Estructura

```typescript
export class ForgotPasswordDto {
  email: string;
}
```

## Campos

### `email: string`
- **Tipo**: String
- **Requerido**: Sí
- **Validaciones**:
  - `@IsEmail()`: Debe ser un email válido
  - `@IsNotEmpty()`: No puede estar vacío
- **Descripción**: Email del usuario que solicita la recuperación de contraseña
- **Ejemplo**: `"usuario@example.com"`

## Uso

Este DTO se usa en el endpoint `POST /auth/forgot-password`:

```typescript
@Post('forgot-password')
async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
  return await this.authService.forgotPassword(forgotPasswordDto);
}
```

## Ejemplo de Request

```json
{
  "email": "usuario@example.com"
}
```

## Respuesta

Por seguridad, siempre se retorna el mismo mensaje genérico, sin revelar si el email existe o no:

```json
{
  "message": "Si el email existe, recibirás un código de recuperación en breve."
}
```

## Validaciones

Todas las validaciones se realizan usando `class-validator`:

- **@IsEmail()**: Valida formato de email
- **@IsNotEmpty()**: Valida que el campo no esté vacío

## Notas de Seguridad

- El endpoint siempre retorna el mismo mensaje para evitar enumeración de emails
- Si el email existe, se genera y envía un código
- Si el email no existe, se retorna el mismo mensaje (sin generar código)

