# password-reset-code.entity.ts - Documentación

## Descripción
Entidad TypeORM que representa un código de recuperación de contraseña. Almacena códigos temporales de 6 dígitos asociados a usuarios para permitir el restablecimiento seguro de contraseñas.

## Estructura de la Entidad

### Campos

#### `id: string`
- **Tipo**: UUID (generado automáticamente)
- **Descripción**: Identificador único del código de reseteo
- **Decorador**: `@PrimaryGeneratedColumn('uuid')`

#### `user: User`
- **Tipo**: Relación ManyToOne con User
- **Descripción**: Usuario asociado al código
- **Decorador**: `@ManyToOne(() => User, { onDelete: 'CASCADE' })`
- **Cascada**: Si se elimina el usuario, se eliminan sus códigos

#### `userId: string`
- **Tipo**: UUID
- **Descripción**: ID del usuario (campo de relación)
- **Decorador**: `@Column()` con `@Index()`
- **Indexado**: Sí, para búsquedas rápidas

#### `code: string`
- **Tipo**: String de 6 caracteres
- **Descripción**: Código alfanumérico o numérico de 6 dígitos
- **Decorador**: `@Column({ type: 'varchar', length: 6 })` con `@Index()`
- **Indexado**: Sí, para búsquedas rápidas por código

#### `expiresAt: Date`
- **Tipo**: Timestamp
- **Descripción**: Fecha y hora de expiración del código (típicamente 15 minutos después de la creación)
- **Decorador**: `@Column({ type: 'timestamp' })`

#### `used: boolean`
- **Tipo**: Boolean
- **Descripción**: Bandera para evitar la reutilización del código
- **Decorador**: `@Column({ type: 'boolean', default: false })`
- **Valor por defecto**: `false`

#### `createdAt: Date`
- **Tipo**: Date
- **Descripción**: Fecha y hora de creación del código
- **Decorador**: `@CreateDateColumn()`
- **Automático**: Se establece automáticamente al crear

## Relaciones

### ManyToOne con User
- Un código de reseteo pertenece a un usuario
- Si se elimina el usuario, se eliminan todos sus códigos (CASCADE)
- Permite múltiples códigos por usuario (útil si se solicitan varios)

## Índices

- **userId**: Indexado para búsquedas rápidas por usuario
- **code**: Indexado para búsquedas rápidas por código

## Uso

### Crear un código de reseteo
```typescript
const resetCode = passwordResetCodeRepository.create({
  userId: user.id,
  code: '123456',
  expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutos
  used: false,
});
await passwordResetCodeRepository.save(resetCode);
```

### Buscar código válido
```typescript
const resetCode = await passwordResetCodeRepository.findOne({
  where: {
    userId: user.id,
    code: '123456',
    used: false,
  },
  order: {
    createdAt: 'DESC',
  },
});
```

### Marcar código como usado
```typescript
resetCode.used = true;
await passwordResetCodeRepository.save(resetCode);
```

## Seguridad

- Los códigos expiran después de 15 minutos
- Los códigos solo se pueden usar una vez (`used: true`)
- Se busca el código más reciente para evitar usar códigos antiguos
- Los códigos se eliminan automáticamente si se elimina el usuario

## Mejoras Futuras

- Limpieza automática de códigos expirados (job programado)
- Límite de intentos de verificación por código
- Rate limiting para prevenir abuso

