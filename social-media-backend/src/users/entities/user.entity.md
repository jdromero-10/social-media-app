# user.entity.ts - Documentación

## Descripción
Entidad TypeORM que representa un usuario en el sistema. Es la entidad central que se relaciona con todas las demás entidades del sistema (Posts, Likes, Comments, Notifications).

## Estructura de la Entidad

### Campos Principales

#### `id: string`
- **Tipo**: UUID (generado automáticamente)
- **Descripción**: Identificador único del usuario
- **Decorador**: `@PrimaryGeneratedColumn('uuid')`

#### `email: string`
- **Tipo**: String (único)
- **Descripción**: Correo electrónico del usuario (usado para login)
- **Decorador**: `@Column({ unique: true })`
- **Requerido**: Sí
- **Único**: Sí (no puede haber dos usuarios con el mismo email)

#### `password: string`
- **Tipo**: String (hasheado)
- **Descripción**: Contraseña del usuario (almacenada como hash bcrypt)
- **Decorador**: `@Column()`
- **Requerido**: Sí
- **Seguridad**: Nunca se retorna en las respuestas de la API

#### `imageUrl: string | null`
- **Tipo**: String o null
- **Descripción**: URL de la imagen de perfil del usuario
- **Decorador**: `@Column({ type: 'varchar', nullable: true })`
- **Requerido**: No
- **Uso**: Se usa para mostrar el avatar del usuario en la aplicación

#### `bio: string | null`
- **Tipo**: String o null
- **Descripción**: Biografía o descripción personal del usuario
- **Decorador**: `@Column({ type: 'varchar', nullable: true })`
- **Requerido**: No
- **Límite**: Máximo 500 caracteres (validado en DTOs)

#### `authStrategy: string | null`
- **Tipo**: String o null
- **Descripción**: Estrategia de autenticación usada (ej: 'local', 'google', 'github')
- **Decorador**: `@Column({ type: 'varchar', nullable: true })`
- **Requerido**: No

### Relaciones

#### `posts: Post[]`
- **Tipo**: Array de Post
- **Descripción**: Posts creados por el usuario
- **Decorador**: `@OneToMany(() => Post, (post) => post.author)`
- **Relación**: One-to-Many (un usuario puede tener muchos posts)

#### `likes: Like[]`
- **Tipo**: Array de Like
- **Descripción**: Likes dados por el usuario
- **Decorador**: `@OneToMany(() => Like, (like) => like.user)`
- **Relación**: One-to-Many (un usuario puede dar muchos likes)

#### `comments: Comment[]`
- **Tipo**: Array de Comment
- **Descripción**: Comentarios escritos por el usuario
- **Decorador**: `@OneToMany(() => Comment, (comment) => comment.author)`
- **Relación**: One-to-Many (un usuario puede escribir muchos comentarios)

#### `notifications: Notification[]`
- **Tipo**: Array de Notification
- **Descripción**: Notificaciones recibidas por el usuario
- **Decorador**: `@OneToMany(() => Notification, (notification) => notification.recipient)`
- **Relación**: One-to-Many (un usuario puede recibir muchas notificaciones)

#### `notificationsSent: Notification[]`
- **Tipo**: Array de Notification
- **Descripción**: Notificaciones generadas por el usuario como actor
- **Decorador**: `@OneToMany(() => Notification, (notification) => notification.actor)`
- **Relación**: One-to-Many (un usuario puede generar muchas notificaciones)

### Timestamps

#### `createdAt: Date`
- **Tipo**: Date
- **Descripción**: Fecha y hora de creación de la cuenta
- **Decorador**: `@CreateDateColumn()`
- **Automático**: Se establece automáticamente al crear

#### `updatedAt: Date`
- **Tipo**: Date
- **Descripción**: Fecha y hora de última actualización
- **Decorador**: `@UpdateDateColumn()`
- **Automático**: Se actualiza automáticamente al modificar

## Relaciones del Sistema

### Diagrama de Relaciones

```
User (1)
├───< (Muchos) Post
│   ├───< (Muchos) Like
│   └───< (Muchos) Comment
│       └───< (Muchos) Comment (respuestas)
├───< (Muchos) Like
├───< (Muchos) Comment
├───< (Muchos) Notification (recibidas)
└───< (Muchos) Notification (generadas como actor)
```

### Relación One-to-Many con Post

```
User (1) ────────< (Muchos) Post
```

- Un usuario puede crear muchos posts
- Un post pertenece a un solo usuario
- Si se elimina un usuario, se eliminan todos sus posts (CASCADE)

### Relación One-to-Many con Like

```
User (1) ────────< (Muchos) Like
```

- Un usuario puede dar muchos likes
- Un like pertenece a un solo usuario
- Si se elimina un usuario, se eliminan todos sus likes (CASCADE)

### Relación One-to-Many con Comment

```
User (1) ────────< (Muchos) Comment
```

- Un usuario puede escribir muchos comentarios
- Un comentario pertenece a un solo usuario
- Si se elimina un usuario, se eliminan todos sus comentarios (CASCADE)

### Relación One-to-Many con Notification (Recibidas)

```
User (1) ────────< (Muchos) Notification (recipient)
```

- Un usuario puede recibir muchas notificaciones
- Una notificación pertenece a un solo usuario (recipient)
- Si se elimina un usuario, se eliminan todas sus notificaciones (CASCADE)

### Relación One-to-Many con Notification (Generadas)

```
User (1) ────────< (Muchos) Notification (actor)
```

- Un usuario puede generar muchas notificaciones como actor
- Una notificación puede tener un actor (usuario que la generó)
- Si se elimina el actor, la notificación queda pero sin actor (SET NULL)

## Consultas TypeORM

### Obtener usuario con todas sus relaciones
```typescript
const user = await usersRepository.findOne({
  where: { id: userId },
  relations: ['posts', 'likes', 'comments', 'notifications'],
});
```

### Obtener posts de un usuario
```typescript
const userPosts = await usersRepository.findOne({
  where: { id: userId },
  relations: ['posts'],
});
```

### Obtener likes dados por un usuario
```typescript
const userLikes = await usersRepository.findOne({
  where: { id: userId },
  relations: ['likes', 'likes.post'],
});
```

### Obtener comentarios de un usuario
```typescript
const userComments = await usersRepository.findOne({
  where: { id: userId },
  relations: ['comments', 'comments.post'],
});
```

### Obtener notificaciones no leídas
```typescript
const unreadNotifications = await notificationsRepository.find({
  where: {
    recipientId: userId,
    isRead: false,
  },
  relations: ['actor', 'post', 'comment'],
});
```

## Migraciones

Cuando uses migraciones de TypeORM, esta entidad generará una tabla con la siguiente estructura:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  authStrategy VARCHAR,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

## Notas Técnicas

- **Email Único**: El campo `email` tiene restricción única a nivel de base de datos
- **Password Hasheado**: La contraseña se almacena como hash bcrypt, nunca en texto plano
- **CASCADE Delete**: Si se elimina un usuario, se eliminan automáticamente:
  - Todos sus posts
  - Todos sus likes
  - Todos sus comentarios
  - Todas sus notificaciones recibidas
- **SET NULL para Actor**: Si se elimina un usuario que generó notificaciones, estas quedan pero sin actor
- **Timestamps Automáticos**: `createdAt` y `updatedAt` se gestionan automáticamente por TypeORM
- **Relaciones Bidireccionales**: Todas las relaciones están definidas en ambas entidades

## Seguridad

### Password
- Nunca se retorna el password en las respuestas de la API
- Se usa bcrypt para hashear las contraseñas
- El hash se genera con salt rounds (10 por defecto)

### Email
- Debe ser único en el sistema
- Se usa para autenticación
- Puede usarse como username si no se proporciona uno

## Campos Implementados

- ✅ **name**: Nombre completo del usuario (nullable)
- ✅ **username**: Nombre de usuario único (requerido)
- ✅ **imageUrl**: URL de la imagen de perfil (nullable)
- ✅ **bio**: Biografía del usuario (nullable, máximo 500 caracteres)

## Mejoras Futuras

Posibles extensiones:
- Campo `isVerified` (cuenta verificada)
- Campo `isActive` (cuenta activa/desactivada)
- Relación Many-to-Many para seguir/seguidores
- Campo `preferences` (JSON para preferencias del usuario)
- Campo `location` (ubicación del usuario)
- Campo `website` (sitio web personal)

## Relaciones Implementadas

- ✅ **Posts**: Relación One-to-Many con `Post` entity
- ✅ **Likes**: Relación One-to-Many con `Like` entity
- ✅ **Comments**: Relación One-to-Many con `Comment` entity
- ✅ **Notifications (recibidas)**: Relación One-to-Many con `Notification` entity (como recipient)
- ✅ **Notifications (generadas)**: Relación One-to-Many con `Notification` entity (como actor)

