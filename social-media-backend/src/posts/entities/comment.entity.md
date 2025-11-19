# comment.entity.ts - Documentación

## Descripción
Entidad TypeORM que representa un comentario en un post. Soporta comentarios anidados (respuestas) permitiendo que los usuarios respondan a otros comentarios, creando hilos de conversación.

## Estructura de la Entidad

### Campos Principales

#### `id: string`
- **Tipo**: UUID (generado automáticamente)
- **Descripción**: Identificador único del comentario
- **Decorador**: `@PrimaryGeneratedColumn('uuid')`

#### `content: string`
- **Tipo**: String (texto largo)
- **Descripción**: Contenido del comentario
- **Decorador**: `@Column({ type: 'text' })`
- **Requerido**: Sí

### Relaciones

#### `author: User`
- **Tipo**: User (entidad)
- **Descripción**: Usuario que escribió el comentario
- **Decorador**: `@ManyToOne(() => User, { ... })`
- **Relación**: Many-to-One (muchos comentarios pertenecen a un usuario)
- **Opciones**:
  - `onDelete: 'CASCADE'`: Si se elimina el usuario, se eliminan todos sus comentarios

#### `authorId: string`
- **Tipo**: UUID
- **Descripción**: ID del usuario autor (foreign key)
- **Decorador**: `@Column({ type: 'uuid' })`
- **Requerido**: Sí

#### `post: Post`
- **Tipo**: Post (entidad)
- **Descripción**: Post al que pertenece el comentario
- **Decorador**: `@ManyToOne(() => Post, (post) => post.comments, { ... })`
- **Relación**: Many-to-One (muchos comentarios pertenecen a un post)
- **Opciones**:
  - `onDelete: 'CASCADE'`: Si se elimina el post, se eliminan todos sus comentarios

#### `postId: string`
- **Tipo**: UUID
- **Descripción**: ID del post (foreign key)
- **Decorador**: `@Column({ type: 'uuid' })`
- **Requerido**: Sí

#### `parentComment: Comment | null`
- **Tipo**: Comment o null
- **Descripción**: Comentario padre (si este es una respuesta)
- **Decorador**: `@ManyToOne(() => Comment, (comment) => comment.replies, { ... })`
- **Relación**: Many-to-One (muchas respuestas pertenecen a un comentario padre)
- **Opciones**:
  - `onDelete: 'CASCADE'`: Si se elimina el comentario padre, se eliminan todas las respuestas
  - `nullable: true`: Puede ser null (comentario de nivel raíz)

#### `parentCommentId: string | null`
- **Tipo**: UUID o null
- **Descripción**: ID del comentario padre (foreign key)
- **Decorador**: `@Column({ type: 'uuid', nullable: true })`
- **Requerido**: No (null para comentarios de nivel raíz)

#### `replies: Comment[]`
- **Tipo**: Array de Comment
- **Descripción**: Respuestas a este comentario
- **Decorador**: `@OneToMany(() => Comment, (comment) => comment.parentComment)`
- **Relación**: One-to-Many (un comentario puede tener muchas respuestas)

### Timestamps

#### `createdAt: Date`
- **Tipo**: Date
- **Descripción**: Fecha y hora de creación del comentario
- **Decorador**: `@CreateDateColumn()`
- **Automático**: Se establece automáticamente al crear

#### `updatedAt: Date`
- **Tipo**: Date
- **Descripción**: Fecha y hora de última actualización
- **Decorador**: `@UpdateDateColumn()`
- **Automático**: Se actualiza automáticamente al modificar

## Relaciones

### Relación Many-to-One con User

```
User (1) ────────< (Muchos) Comment
```

- Un usuario puede escribir muchos comentarios
- Un comentario pertenece a un solo usuario
- Si se elimina un usuario, se eliminan todos sus comentarios (CASCADE)

### Relación Many-to-One con Post

```
Post (1) ────────< (Muchos) Comment
```

- Un post puede tener muchos comentarios
- Un comentario pertenece a un solo post
- Si se elimina un post, se eliminan todos sus comentarios (CASCADE)

### Relación Auto-referencial (Comentarios Anidados)

```
Comment (1) ────────< (Muchos) Comment (respuestas)
```

- Un comentario puede tener muchas respuestas
- Una respuesta pertenece a un solo comentario padre
- Si se elimina un comentario padre, se eliminan todas sus respuestas (CASCADE)
- Los comentarios de nivel raíz tienen `parentCommentId = null`

## Ejemplos de Uso

### Comentario de Nivel Raíz
```typescript
const rootComment: Comment = {
  id: 'uuid-here',
  content: '¡Excelente post!',
  authorId: 'user-uuid',
  postId: 'post-uuid',
  parentCommentId: null, // Es un comentario raíz
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

### Respuesta a un Comentario
```typescript
const reply: Comment = {
  id: 'uuid-here',
  content: 'Gracias por tu comentario',
  authorId: 'user-uuid',
  postId: 'post-uuid',
  parentCommentId: 'parent-comment-uuid', // Respuesta a otro comentario
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

## Consultas TypeORM

### Obtener todos los comentarios de un post (solo nivel raíz)
```typescript
const rootComments = await commentsRepository.find({
  where: {
    postId: 'post-uuid',
    parentCommentId: null, // Solo comentarios raíz
  },
  relations: ['author', 'replies', 'replies.author'],
  order: { createdAt: 'DESC' },
});
```

### Obtener comentarios con sus respuestas
```typescript
const commentsWithReplies = await commentsRepository.find({
  where: { postId: 'post-uuid', parentCommentId: null },
  relations: ['author', 'replies', 'replies.author'],
  order: {
    createdAt: 'DESC',
    replies: {
      createdAt: 'ASC', // Respuestas ordenadas por fecha
    },
  },
});
```

### Obtener todas las respuestas de un comentario
```typescript
const replies = await commentsRepository.find({
  where: { parentCommentId: 'comment-uuid' },
  relations: ['author'],
  order: { createdAt: 'ASC' },
});
```

### Obtener comentarios de un usuario
```typescript
const userComments = await commentsRepository.find({
  where: { authorId: 'user-uuid' },
  relations: ['post', 'parentComment'],
  order: { createdAt: 'DESC' },
});
```

### Contar comentarios de un post
```typescript
const commentCount = await commentsRepository.count({
  where: { postId: 'post-uuid' },
});
```

## Estructura de Comentarios Anidados

```
Post
└── Comment 1 (raíz)
    ├── Reply 1.1
    │   └── Reply 1.1.1
    └── Reply 1.2
└── Comment 2 (raíz)
    └── Reply 2.1
```

**Nota**: La implementación actual soporta un solo nivel de anidación (comentario → respuesta). Para múltiples niveles, se puede extender fácilmente ya que la relación es auto-referencial.

## Migraciones

Cuando uses migraciones de TypeORM, esta entidad generará una tabla con la siguiente estructura:

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  authorId UUID NOT NULL,
  postId UUID NOT NULL,
  parentCommentId UUID,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (parentCommentId) REFERENCES comments(id) ON DELETE CASCADE
);
```

## Notas Técnicas

- **CASCADE Delete**: Si se elimina un usuario, post o comentario padre, se eliminan todos los comentarios relacionados
- **Timestamps**: Tiene `createdAt` y `updatedAt` para rastrear cuándo se creó y modificó
- **Relación Auto-referencial**: Permite comentarios anidados usando la misma entidad
- **Comentarios Raíz**: Los comentarios de nivel raíz tienen `parentCommentId = null`
- **Relación Bidireccional**: La relación está definida en ambas entidades (User, Post y Comment)

## Casos de Uso

1. **Comentar en un Post**: Crear un comentario con `parentCommentId = null`
2. **Responder a un Comentario**: Crear un comentario con `parentCommentId` apuntando al comentario padre
3. **Editar Comentario**: Actualizar el campo `content` (actualiza `updatedAt` automáticamente)
4. **Eliminar Comentario**: Eliminar el comentario (se eliminan todas las respuestas por CASCADE)
5. **Listar Comentarios**: Obtener comentarios raíz con sus respuestas anidadas

## Mejoras Futuras

Posibles extensiones:
- Campo `isEdited` para indicar si el comentario fue editado
- Campo `isDeleted` para soft delete (ocultar sin eliminar)
- Campo `likes` (relación Many-to-Many o contador)
- Campo `mentions` para mencionar usuarios
- Soporte para múltiples niveles de anidación más profunda
- Campo `mediaUrl` para comentarios con imágenes

