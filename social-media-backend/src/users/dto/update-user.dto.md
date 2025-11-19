# update-user.dto.ts - Documentación

## Descripción
DTO (Data Transfer Object) para actualizar un usuario existente. Define la estructura de datos y validaciones para el endpoint `PUT /users/:id`.

## Estructura

```typescript
export class UpdateUserDto {
  name?: string;
  username?: string;
  email?: string;
  bio?: string | null;
  imageUrl?: string | null;
}
```

## Campos

### `name?: string`
- **Tipo**: String opcional
- **Validaciones**:
  - Mínimo 2 caracteres
  - Máximo 100 caracteres
- **Descripción**: Nombre completo del usuario
- **Ejemplo**: `"Juan Pérez"`

### `username?: string`
- **Tipo**: String opcional
- **Validaciones**:
  - Mínimo 3 caracteres
  - Máximo 50 caracteres
- **Descripción**: Nombre de usuario único
- **Nota**: Debe ser único en el sistema (validado en el servicio)
- **Ejemplo**: `"juanperez"`

### `email?: string`
- **Tipo**: String opcional
- **Validaciones**:
  - Debe ser un email válido
- **Descripción**: Correo electrónico del usuario
- **Nota**: Debe ser único en el sistema (validado en el servicio)
- **Ejemplo**: `"juan@example.com"`

### `bio?: string | null`
- **Tipo**: String o null opcional
- **Validaciones**:
  - Máximo 500 caracteres
- **Descripción**: Biografía o descripción personal del usuario
- **Ejemplo**: `"Desarrollador de software apasionado por la tecnología"`

### `imageUrl?: string | null`
- **Tipo**: String o null opcional
- **Descripción**: URL de la imagen de perfil del usuario
- **Ejemplo**: `"https://example.com/avatars/user123.jpg"`

## Validaciones

Todas las validaciones se realizan usando `class-validator`:

- **@IsString()**: Valida que el valor sea un string
- **@IsOptional()**: Permite que el campo sea opcional
- **@IsEmail()**: Valida formato de email
- **@MinLength()**: Valida longitud mínima
- **@MaxLength()**: Valida longitud máxima

## Uso

Este DTO se usa en el endpoint `PUT /users/:id`:

```typescript
@Put(':id')
@UseGuards(JwtAuthGuard)
async update(
  @Param('id') id: string,
  @Body() updateUserDto: UpdateUserDto,
  @Request() req: { user: User },
): Promise<User>
```

## Ejemplo de Request

```json
{
  "name": "Juan Pérez",
  "bio": "Desarrollador de software",
  "imageUrl": "https://example.com/avatar.jpg"
}
```

## Validaciones Adicionales en el Servicio

Además de las validaciones del DTO, el servicio realiza:

1. **Verificación de existencia**: El usuario debe existir
2. **Autorización**: Solo el usuario puede actualizar su propio perfil
3. **Unicidad de email**: Si se actualiza el email, debe ser único
4. **Unicidad de username**: Si se actualiza el username, debe ser único

## Notas Importantes

- Todos los campos son opcionales (parcial update)
- Solo se actualizan los campos proporcionados
- Los campos `null` se pueden usar para limpiar valores (ej: eliminar bio o imageUrl)
- El password no se puede actualizar con este DTO (requiere endpoint separado)

