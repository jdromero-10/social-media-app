# Diagrama de Relaciones entre Entidades

## Resumen del Sistema

Este documento describe todas las relaciones entre las entidades del sistema de red social.

## Entidades del Sistema

1. **User** - Usuarios del sistema
2. **Post** - Publicaciones (texto, imagen o ambos)
3. **Like** - Likes dados a posts
4. **Comment** - Comentarios en posts (con soporte para respuestas)
5. **Notification** - Notificaciones del sistema

## Diagrama Completo de Relaciones

```
┌─────────────────────────────────────────────────────────────┐
│                         USER                                 │
│  - id (UUID)                                                 │
│  - email (unique)                                            │
│  - password                                                  │
│  - authStrategy                                              │
└─────────────────────────────────────────────────────────────┘
         │
         │ One-to-Many
         ├─────────────────────────────────────────────────────┐
         │                                                     │
         ▼                                                     ▼
┌────────────────────┐                              ┌────────────────────┐
│       POST         │                              │       LIKE          │
│  - id              │                              │  - id               │
│  - title           │                              │  - userId (FK)      │
│  - description     │                              │  - postId (FK)      │
│  - content         │                              │  - createdAt        │
│  - imageUrl        │                              │  - UNIQUE(userId,   │
│  - type            │                              │     postId)         │
│  - authorId (FK)   │                              └────────────────────┘
│  - createdAt       │                                       │
│  - updatedAt       │                                       │ Many-to-One
│                    │                                       │
│  One-to-Many       │                                       │
│  ┌─────────────┐  │                                       │
│  │   LIKES     │  │◄──────────────────────────────────────┘
│  └─────────────┘  │
│                    │
│  One-to-Many       │
│  ┌─────────────┐  │
│  │  COMMENTS  │  │
│  └─────────────┘  │
└────────────────────┘
         │
         │ One-to-Many
         ▼
┌────────────────────┐
│     COMMENT        │
│  - id               │
│  - content          │
│  - authorId (FK)    │
│  - postId (FK)      │
│  - parentCommentId │
│    (FK, nullable)   │
│  - createdAt        │
│  - updatedAt        │
│                     │
│  Self-Referencing   │
│  ┌──────────────┐  │
│  │   REPLIES    │  │
│  └──────────────┘  │
└────────────────────┘
         │
         │ Many-to-One
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                    NOTIFICATION                              │
│  - id                                                        │
│  - type (enum)                                               │
│  - message                                                   │
│  - isRead                                                    │
│  - recipientId (FK) ────────┐                               │
│  - actorId (FK, nullable)   │                               │
│  - postId (FK, nullable)    │                               │
│  - commentId (FK, nullable) │                               │
│  - createdAt                 │                               │
└──────────────────────────────┼───────────────────────────────┘
                               │
                               │ Many-to-One
                               │
                               ▼
                        ┌──────────────┐
                        │     USER     │
                        │ (recipient)   │
                        └──────────────┘
```

## Relaciones Detalladas

### 1. User ↔ Post

**Tipo**: One-to-Many / Many-to-One

```
User (1) ────────< (Muchos) Post
```

- **User → Post**: Un usuario puede crear muchos posts
- **Post → User**: Un post pertenece a un solo usuario (author)
- **CASCADE**: Si se elimina un usuario, se eliminan todos sus posts

### 2. User ↔ Like

**Tipo**: One-to-Many / Many-to-One

```
User (1) ────────< (Muchos) Like
```

- **User → Like**: Un usuario puede dar muchos likes
- **Like → User**: Un like pertenece a un solo usuario
- **CASCADE**: Si se elimina un usuario, se eliminan todos sus likes

### 3. Post ↔ Like

**Tipo**: One-to-Many / Many-to-One

```
Post (1) ────────< (Muchos) Like
```

- **Post → Like**: Un post puede tener muchos likes
- **Like → Post**: Un like pertenece a un solo post
- **CASCADE**: Si se elimina un post, se eliminan todos sus likes
- **UNIQUE**: Un usuario solo puede dar like una vez a un post (`UNIQUE(userId, postId)`)

### 4. User ↔ Comment

**Tipo**: One-to-Many / Many-to-One

```
User (1) ────────< (Muchos) Comment
```

- **User → Comment**: Un usuario puede escribir muchos comentarios
- **Comment → User**: Un comentario pertenece a un solo usuario (author)
- **CASCADE**: Si se elimina un usuario, se eliminan todos sus comentarios

### 5. Post ↔ Comment

**Tipo**: One-to-Many / Many-to-One

```
Post (1) ────────< (Muchos) Comment
```

- **Post → Comment**: Un post puede tener muchos comentarios
- **Comment → Post**: Un comentario pertenece a un solo post
- **CASCADE**: Si se elimina un post, se eliminan todos sus comentarios

### 6. Comment ↔ Comment (Auto-referencial)

**Tipo**: One-to-Many / Many-to-One (Self-referencing)

```
Comment (1) ────────< (Muchos) Comment (respuestas)
```

- **Comment → Comment**: Un comentario puede tener muchas respuestas
- **Comment → Comment**: Una respuesta pertenece a un solo comentario padre
- **CASCADE**: Si se elimina un comentario padre, se eliminan todas sus respuestas
- **Nullable**: Los comentarios raíz tienen `parentCommentId = null`

### 7. User ↔ Notification (Recibidas)

**Tipo**: One-to-Many / Many-to-One

```
User (1) ────────< (Muchos) Notification (recipient)
```

- **User → Notification**: Un usuario puede recibir muchas notificaciones
- **Notification → User**: Una notificación pertenece a un solo usuario (recipient)
- **CASCADE**: Si se elimina un usuario, se eliminan todas sus notificaciones

### 8. User ↔ Notification (Generadas)

**Tipo**: One-to-Many / Many-to-One

```
User (1) ────────< (Muchos) Notification (actor)
```

- **User → Notification**: Un usuario puede generar muchas notificaciones como actor
- **Notification → User**: Una notificación puede tener un actor (usuario que la generó)
- **SET NULL**: Si se elimina el actor, la notificación queda pero sin actor

### 9. Post ↔ Notification

**Tipo**: One-to-Many / Many-to-One (Opcional)

```
Post (1) ────────< (Muchos) Notification
```

- **Post → Notification**: Un post puede tener muchas notificaciones relacionadas
- **Notification → Post**: Una notificación puede estar relacionada con un post
- **CASCADE**: Si se elimina un post, se eliminan las notificaciones relacionadas
- **Nullable**: Puede ser null (para notificaciones que no son sobre posts)

### 10. Comment ↔ Notification

**Tipo**: One-to-Many / Many-to-One (Opcional)

```
Comment (1) ────────< (Muchos) Notification
```

- **Comment → Notification**: Un comentario puede tener muchas notificaciones relacionadas
- **Notification → Comment**: Una notificación puede estar relacionada con un comentario
- **CASCADE**: Si se elimina un comentario, se eliminan las notificaciones relacionadas
- **Nullable**: Puede ser null (para notificaciones que no son sobre comentarios)

## Resumen de CASCADE Deletes

| Entidad Eliminada | Entidades Eliminadas Automáticamente |
|-------------------|--------------------------------------|
| User | Posts, Likes, Comments, Notifications (recibidas) |
| Post | Likes, Comments, Notifications (relacionadas) |
| Comment | Replies (comentarios hijos), Notifications (relacionadas) |
| Like | Ninguna (se elimina con User o Post) |
| Notification | Ninguna (se elimina con User, Post o Comment) |

## Restricciones de Unicidad

- **User.email**: Único (no puede haber dos usuarios con el mismo email)
- **Like(userId, postId)**: Único (un usuario solo puede dar like una vez a un post)

## Índices Recomendados

Para optimizar las consultas, se recomiendan los siguientes índices:

```sql
-- Índices para User
CREATE INDEX idx_user_email ON users(email);

-- Índices para Post
CREATE INDEX idx_post_authorId ON posts(authorId);
CREATE INDEX idx_post_createdAt ON posts(createdAt DESC);

-- Índices para Like
CREATE INDEX idx_like_userId ON likes(userId);
CREATE INDEX idx_like_postId ON likes(postId);
CREATE UNIQUE INDEX idx_like_user_post ON likes(userId, postId);

-- Índices para Comment
CREATE INDEX idx_comment_authorId ON comments(authorId);
CREATE INDEX idx_comment_postId ON comments(postId);
CREATE INDEX idx_comment_parentId ON comments(parentCommentId);
CREATE INDEX idx_comment_createdAt ON comments(createdAt DESC);

-- Índices para Notification
CREATE INDEX idx_notification_recipientId ON notifications(recipientId);
CREATE INDEX idx_notification_isRead ON notifications(isRead);
CREATE INDEX idx_notification_createdAt ON notifications(createdAt DESC);
CREATE INDEX idx_notification_type ON notifications(type);
```

## Flujos de Datos Comunes

### Crear un Post
```
User crea Post
    ↓
Post.authorId = User.id
    ↓
Post se guarda en BD
```

### Dar Like a un Post
```
User da like a Post
    ↓
Se crea Like con userId y postId
    ↓
Se valida UNIQUE(userId, postId)
    ↓
Si no existe, se crea Like
    ↓
Se puede crear Notification de tipo LIKE
```

### Comentar en un Post
```
User comenta en Post
    ↓
Se crea Comment con authorId y postId
    ↓
Comment.parentCommentId = null (raíz)
    ↓
Comment se guarda en BD
    ↓
Se crea Notification de tipo COMMENT
```

### Responder a un Comentario
```
User responde a Comment
    ↓
Se crea Comment con:
  - authorId = User.id
  - postId = Post.id
  - parentCommentId = Comment.id (padre)
    ↓
Comment se guarda en BD
    ↓
Se crea Notification de tipo REPLY
```

## Notas de Implementación

- Todas las relaciones están configuradas con TypeORM decorators
- Las relaciones bidireccionales están definidas en ambas entidades
- Los CASCADE deletes aseguran integridad referencial
- Las restricciones de unicidad previenen datos duplicados
- Los timestamps se gestionan automáticamente

