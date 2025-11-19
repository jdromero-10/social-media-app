# notification.entity.ts - Documentación

## Descripción
Entidad TypeORM que representa una notificación en el sistema. Las notificaciones se generan cuando ocurren eventos importantes como likes, comentarios, respuestas, seguimientos, etc. Cada notificación está dirigida a un usuario específico (recipient) y puede estar relacionada con un post, comentario o acción de otro usuario (actor).

## Estructura de la Entidad

### Campos Principales

#### `id: string`
- **Tipo**: UUID (generado automáticamente)
- **Descripción**: Identificador único de la notificación
- **Decorador**: `@PrimaryGeneratedColumn('uuid')`

#### `type: NotificationType`
- **Tipo**: Enum
- **Descripción**: Tipo de notificación
- **Valores posibles**:
  - `'like'`: Alguien dio like a tu post
  - `'comment'`: Alguien comentó en tu post
  - `'reply'`: Alguien respondió a tu comentario
  - `'follow'`: Alguien te siguió
  - `'mention'`: Te mencionaron en un post/comentario
- **Decorador**: `@Column({ type: 'enum', enum: NotificationType, nullable: false })`
- **Requerido**: Sí

#### `message: string | null`
- **Tipo**: String (texto largo) o null
- **Descripción**: Mensaje personalizado de la notificación
- **Decorador**: `@Column({ type: 'text', nullable: true })`
- **Requerido**: No (puede ser null, el mensaje puede generarse dinámicamente)

#### `isRead: boolean`
- **Tipo**: Boolean
- **Descripción**: Indica si la notificación ha sido leída
- **Default**: `false`
- **Decorador**: `@Column({ type: 'boolean', default: false })`

### Relaciones

#### `recipient: User`
- **Tipo**: User (entidad)
- **Descripción**: Usuario que recibe la notificación
- **Decorador**: `@ManyToOne(() => User, (user) => user.notifications, { ... })`
- **Relación**: Many-to-One (muchas notificaciones pertenecen a un usuario)
- **Opciones**:
  - `onDelete: 'CASCADE'`: Si se elimina el usuario, se eliminan todas sus notificaciones

#### `recipientId: string`
- **Tipo**: UUID
- **Descripción**: ID del usuario que recibe la notificación (foreign key)
- **Decorador**: `@Column({ type: 'uuid' })`
- **Requerido**: Sí

#### `actor: User | null`
- **Tipo**: User (entidad) o null
- **Descripción**: Usuario que generó la notificación (quien dio like, comentó, etc.)
- **Decorador**: `@ManyToOne(() => User, { ... })`
- **Relación**: Many-to-One (muchas notificaciones pueden ser generadas por un usuario)
- **Opciones**:
  - `onDelete: 'SET NULL'`: Si se elimina el usuario, la notificación queda pero sin actor
  - `nullable: true`: Puede ser null (para notificaciones del sistema)

#### `actorId: string | null`
- **Tipo**: UUID o null
- **Descripción**: ID del usuario que generó la notificación (foreign key)
- **Decorador**: `@Column({ type: 'uuid', nullable: true })`
- **Requerido**: No (puede ser null para notificaciones del sistema)

#### `post: Post | null`
- **Tipo**: Post (entidad) o null
- **Descripción**: Post relacionado con la notificación (si aplica)
- **Decorador**: `@ManyToOne(() => Post, { ... })`
- **Relación**: Many-to-One (muchas notificaciones pueden estar relacionadas con un post)
- **Opciones**:
  - `onDelete: 'CASCADE'`: Si se elimina el post, se eliminan las notificaciones relacionadas
  - `nullable: true`: Puede ser null (para notificaciones que no son sobre posts)

#### `postId: string | null`
- **Tipo**: UUID o null
- **Descripción**: ID del post relacionado (foreign key)
- **Decorador**: `@Column({ type: 'uuid', nullable: true })`
- **Requerido**: No

#### `comment: Comment | null`
- **Tipo**: Comment (entidad) o null
- **Descripción**: Comentario relacionado con la notificación (si aplica)
- **Decorador**: `@ManyToOne(() => Comment, { ... })`
- **Relación**: Many-to-One (muchas notificaciones pueden estar relacionadas con un comentario)
- **Opciones**:
  - `onDelete: 'CASCADE'`: Si se elimina el comentario, se eliminan las notificaciones relacionadas
  - `nullable: true`: Puede ser null (para notificaciones que no son sobre comentarios)

#### `commentId: string | null`
- **Tipo**: UUID o null
- **Descripción**: ID del comentario relacionado (foreign key)
- **Decorador**: `@Column({ type: 'uuid', nullable: true })`
- **Requerido**: No

### Timestamps

#### `createdAt: Date`
- **Tipo**: Date
- **Descripción**: Fecha y hora de creación de la notificación
- **Decorador**: `@CreateDateColumn()`
- **Automático**: Se establece automáticamente al crear

## Tipos de Notificación

### `NotificationType` Enum

```typescript
export enum NotificationType {
  LIKE = 'like',        // Alguien dio like a tu post
  COMMENT = 'comment',  // Alguien comentó en tu post
  REPLY = 'reply',      // Alguien respondió a tu comentario
  FOLLOW = 'follow',    // Alguien te siguió
  MENTION = 'mention',  // Te mencionaron en un post/comentario
}
```

## Relaciones

### Relación Many-to-One con User (Recipient)

```
User (1) ────────< (Muchos) Notification (recibidas)
```

- Un usuario puede recibir muchas notificaciones
- Una notificación pertenece a un solo usuario (recipient)
- Si se elimina un usuario, se eliminan todas sus notificaciones (CASCADE)

### Relación Many-to-One con User (Actor)

```
User (1) ────────< (Muchos) Notification (generadas)
```

- Un usuario puede generar muchas notificaciones
- Una notificación puede tener un actor (usuario que la generó)
- Si se elimina el actor, la notificación queda pero sin actor (SET NULL)

### Relación Many-to-One con Post

```
Post (1) ────────< (Muchos) Notification
```

- Un post puede tener muchas notificaciones relacionadas
- Una notificación puede estar relacionada con un post
- Si se elimina un post, se eliminan las notificaciones relacionadas (CASCADE)

### Relación Many-to-One con Comment

```
Comment (1) ────────< (Muchos) Notification
```

- Un comentario puede tener muchas notificaciones relacionadas
- Una notificación puede estar relacionada con un comentario
- Si se elimina un comentario, se eliminan las notificaciones relacionadas (CASCADE)

## Ejemplos de Uso

### Notificación de Like
```typescript
const likeNotification: Notification = {
  id: 'uuid-here',
  type: NotificationType.LIKE,
  message: null, // Se puede generar dinámicamente
  isRead: false,
  recipientId: 'post-author-uuid',
  actorId: 'user-who-liked-uuid',
  postId: 'post-uuid',
  commentId: null,
  createdAt: new Date(),
};
```

### Notificación de Comentario
```typescript
const commentNotification: Notification = {
  id: 'uuid-here',
  type: NotificationType.COMMENT,
  message: null,
  isRead: false,
  recipientId: 'post-author-uuid',
  actorId: 'user-who-commented-uuid',
  postId: 'post-uuid',
  commentId: 'comment-uuid',
  createdAt: new Date(),
};
```

### Notificación de Respuesta
```typescript
const replyNotification: Notification = {
  id: 'uuid-here',
  type: NotificationType.REPLY,
  message: null,
  isRead: false,
  recipientId: 'original-comment-author-uuid',
  actorId: 'user-who-replied-uuid',
  postId: 'post-uuid',
  commentId: 'reply-comment-uuid',
  createdAt: new Date(),
};
```

### Notificación de Seguimiento
```typescript
const followNotification: Notification = {
  id: 'uuid-here',
  type: NotificationType.FOLLOW,
  message: null,
  isRead: false,
  recipientId: 'user-being-followed-uuid',
  actorId: 'user-who-followed-uuid',
  postId: null,
  commentId: null,
  createdAt: new Date(),
};
```

## Consultas TypeORM

### Obtener notificaciones no leídas de un usuario
```typescript
const unreadNotifications = await notificationsRepository.find({
  where: {
    recipientId: 'user-uuid',
    isRead: false,
  },
  relations: ['actor', 'post', 'comment'],
  order: { createdAt: 'DESC' },
});
```

### Obtener todas las notificaciones de un usuario
```typescript
const allNotifications = await notificationsRepository.find({
  where: { recipientId: 'user-uuid' },
  relations: ['actor', 'post', 'comment'],
  order: { createdAt: 'DESC' },
  take: 50, // Limitar a 50 más recientes
});
```

### Marcar notificación como leída
```typescript
await notificationsRepository.update(
  { id: 'notification-uuid' },
  { isRead: true },
);
```

### Marcar todas las notificaciones como leídas
```typescript
await notificationsRepository.update(
  { recipientId: 'user-uuid', isRead: false },
  { isRead: true },
);
```

### Contar notificaciones no leídas
```typescript
const unreadCount = await notificationsRepository.count({
  where: {
    recipientId: 'user-uuid',
    isRead: false,
  },
});
```

### Obtener notificaciones por tipo
```typescript
const likeNotifications = await notificationsRepository.find({
  where: {
    recipientId: 'user-uuid',
    type: NotificationType.LIKE,
  },
  relations: ['actor', 'post'],
  order: { createdAt: 'DESC' },
});
```

## Migraciones

Cuando uses migraciones de TypeORM, esta entidad generará una tabla con la siguiente estructura:

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR NOT NULL,
  message TEXT,
  isRead BOOLEAN DEFAULT false,
  recipientId UUID NOT NULL,
  actorId UUID,
  postId UUID,
  commentId UUID,
  createdAt TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (recipientId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (actorId) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (commentId) REFERENCES comments(id) ON DELETE CASCADE
);
```

## Notas Técnicas

- **CASCADE Delete**: Si se elimina el recipient, post o comment, se eliminan las notificaciones relacionadas
- **SET NULL para Actor**: Si se elimina el actor, la notificación queda pero sin actor (útil para historial)
- **Timestamps**: Solo tiene `createdAt` (no `updatedAt`) porque las notificaciones generalmente no se modifican
- **Campo isRead**: Permite rastrear qué notificaciones el usuario ya ha visto
- **Relaciones Opcionales**: `actor`, `post` y `comment` pueden ser null dependiendo del tipo de notificación

## Casos de Uso

1. **Crear Notificación de Like**: Cuando un usuario da like a un post
2. **Crear Notificación de Comentario**: Cuando un usuario comenta en un post
3. **Crear Notificación de Respuesta**: Cuando un usuario responde a un comentario
4. **Marcar como Leída**: Cuando el usuario ve la notificación
5. **Listar Notificaciones**: Obtener notificaciones del usuario ordenadas por fecha
6. **Contar No Leídas**: Mostrar badge con número de notificaciones pendientes

## Mejoras Futuras

Posibles extensiones:
- Campo `readAt` para saber cuándo se leyó
- Campo `actionUrl` para enlaces directos a la acción
- Campo `metadata` (JSON) para datos adicionales
- Agrupación de notificaciones similares
- Notificaciones push
- Configuración de preferencias de notificaciones por usuario

