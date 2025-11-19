# like.entity.ts - Documentación

## Descripción
Entidad TypeORM que representa un "like" (me gusta) dado por un usuario a un post. Implementa una restricción única para evitar que un usuario pueda dar like múltiples veces al mismo post.

## Estructura de la Entidad

### Campos Principales

#### `id: string`
- **Tipo**: UUID (generado automáticamente)
- **Descripción**: Identificador único del like
- **Decorador**: `@PrimaryGeneratedColumn('uuid')`

### Relaciones

#### `user: User`
- **Tipo**: User (entidad)
- **Descripción**: Usuario que dio el like
- **Decorador**: `@ManyToOne(() => User, { ... })`
- **Relación**: Many-to-One (muchos likes pertenecen a un usuario)
- **Opciones**:
  - `onDelete: 'CASCADE'`: Si se elimina el usuario, se eliminan todos sus likes

#### `userId: string`
- **Tipo**: UUID
- **Descripción**: ID del usuario que dio el like (foreign key)
- **Decorador**: `@Column({ type: 'uuid' })`
- **Requerido**: Sí

#### `post: Post`
- **Tipo**: Post (entidad)
- **Descripción**: Post al que se le dio like
- **Decorador**: `@ManyToOne(() => Post, (post) => post.likes, { ... })`
- **Relación**: Many-to-One (muchos likes pertenecen a un post)
- **Opciones**:
  - `onDelete: 'CASCADE'`: Si se elimina el post, se eliminan todos sus likes

#### `postId: string`
- **Tipo**: UUID
- **Descripción**: ID del post al que se le dio like (foreign key)
- **Decorador**: `@Column({ type: 'uuid' })`
- **Requerido**: Sí

### Timestamps

#### `createdAt: Date`
- **Tipo**: Date
- **Descripción**: Fecha y hora en que se dio el like
- **Decorador**: `@CreateDateColumn()`
- **Automático**: Se establece automáticamente al crear

## Restricción de Unicidad

### `@Unique(['userId', 'postId'])`
- **Propósito**: Evitar que un usuario pueda dar like múltiples veces al mismo post
- **Implementación**: Restricción única a nivel de base de datos
- **Comportamiento**: Si un usuario intenta dar like dos veces al mismo post, la segunda operación fallará

## Relaciones

### Relación Many-to-One con User

```
User (1) ────────< (Muchos) Like
```

- Un usuario puede dar muchos likes
- Un like pertenece a un solo usuario
- Si se elimina un usuario, se eliminan todos sus likes (CASCADE)

### Relación Many-to-One con Post

```
Post (1) ────────< (Muchos) Like
```

- Un post puede tener muchos likes
- Un like pertenece a un solo post
- Si se elimina un post, se eliminan todos sus likes (CASCADE)

## Ejemplos de Uso

### Crear un Like
```typescript
const like = await likesRepository.create({
  userId: 'user-uuid',
  postId: 'post-uuid',
});
await likesRepository.save(like);
```

### Verificar si un usuario ya dio like
```typescript
const existingLike = await likesRepository.findOne({
  where: {
    userId: 'user-uuid',
    postId: 'post-uuid',
  },
});

if (existingLike) {
  // El usuario ya dio like
}
```

### Obtener todos los likes de un post
```typescript
const postLikes = await likesRepository.find({
  where: { postId: 'post-uuid' },
  relations: ['user'],
});
```

### Contar likes de un post
```typescript
const likeCount = await likesRepository.count({
  where: { postId: 'post-uuid' },
});
```

### Eliminar un like (unlike)
```typescript
await likesRepository.delete({
  userId: 'user-uuid',
  postId: 'post-uuid',
});
```

## Consultas TypeORM

### Obtener likes con información del usuario
```typescript
const likes = await likesRepository.find({
  where: { postId: 'post-uuid' },
  relations: ['user'],
  select: {
    id: true,
    createdAt: true,
    user: {
      id: true,
      email: true,
    },
  },
});
```

### Obtener likes de un usuario específico
```typescript
const userLikes = await likesRepository.find({
  where: { userId: 'user-uuid' },
  relations: ['post'],
  order: { createdAt: 'DESC' },
});
```

## Migraciones

Cuando uses migraciones de TypeORM, esta entidad generará una tabla con la siguiente estructura:

```sql
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId UUID NOT NULL,
  postId UUID NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE,
  UNIQUE(userId, postId)
);
```

## Notas Técnicas

- **Restricción Única**: La combinación `userId + postId` es única, evitando likes duplicados
- **CASCADE Delete**: Si se elimina un usuario o post, sus likes se eliminan automáticamente
- **Timestamps**: Solo tiene `createdAt` (no `updatedAt`) porque un like no se modifica, solo se crea o elimina
- **Relación Bidireccional**: La relación está definida en ambas entidades (User, Post y Like)

## Casos de Uso

1. **Dar Like**: Crear un nuevo registro en la tabla `likes`
2. **Quitar Like**: Eliminar el registro correspondiente
3. **Verificar Like**: Consultar si existe un registro para un usuario y post específicos
4. **Contar Likes**: Contar todos los registros de un post
5. **Listar Likes**: Obtener todos los usuarios que dieron like a un post

## Mejoras Futuras

Posibles extensiones:
- Campo `type` para diferentes tipos de reacciones (like, love, haha, etc.)
- Campo `isActive` para soft delete en lugar de eliminar físicamente
- Índices adicionales para optimizar consultas frecuentes

