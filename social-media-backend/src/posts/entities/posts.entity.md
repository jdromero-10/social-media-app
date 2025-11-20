# posts.entity.ts - Documentación

## Descripción
Entidad TypeORM que representa una publicación (post) en la red social. Un post puede contener texto, imágenes, o ambos. Cada post está asociado a un usuario (author) que lo creó.

## Estructura de la Entidad

### Campos Principales

#### `id: string`
- **Tipo**: UUID (generado automáticamente)
- **Descripción**: Identificador único del post
- **Decorador**: `@PrimaryGeneratedColumn('uuid')`

#### `title: string | null`
- **Tipo**: String (máximo 255 caracteres) o null
- **Descripción**: Título del post (opcional, no se usa en la nueva estructura)
- **Decorador**: `@Column({ type: 'varchar', length: 255, nullable: true })`
- **Requerido**: No (puede ser null)
- **Nota**: Este campo se mantiene para compatibilidad pero no se utiliza en el formulario actual

#### `description: string | null`
- **Tipo**: String (texto largo) o null
- **Descripción**: Descripción opcional del post
- **Decorador**: `@Column({ type: 'text', nullable: true })`
- **Requerido**: No (puede ser null)

#### `content: string | null`
- **Tipo**: String (texto largo) o null
- **Descripción**: Contenido de texto del post
- **Decorador**: `@Column({ type: 'text', nullable: true })`
- **Requerido**: No (puede ser null)
- **Uso**: Para posts de tipo texto o posts con imagen que incluyen texto

#### `imageUrl: string | null`
- **Tipo**: String (URL) o null
- **Descripción**: URL de la imagen del post (si tiene imagen)
- **Decorador**: `@Column({ type: 'varchar', nullable: true })`
- **Requerido**: No (puede ser null)
- **Uso**: Para almacenar la ruta/URL de la imagen subida

#### `type: 'text' | 'image' | 'text_with_image'`
- **Tipo**: String literal union
- **Descripción**: Tipo de post que indica qué tipo de contenido tiene
- **Valores posibles**:
  - `'text'`: Solo texto (content)
  - `'image'`: Solo imagen (imageUrl)
  - `'text_with_image'`: Imagen con texto (imageUrl + content)
- **Default**: `'text'`
- **Decorador**: `@Column({ type: 'varchar', default: 'text', comment: '...' })`

### Relación con User

#### `author: User`
- **Tipo**: User (entidad)
- **Descripción**: Usuario que creó el post
- **Decorador**: `@ManyToOne(() => User, { ... })`
- **Relación**: Many-to-One (muchos posts pertenecen a un usuario)
- **Opciones**:
  - `onDelete: 'CASCADE'`: Si se elimina el usuario, se eliminan todos sus posts
  - `nullable: false`: El autor es requerido

#### `authorId: string`
- **Tipo**: UUID
- **Descripción**: ID del usuario autor (foreign key)
- **Decorador**: `@Column({ type: 'uuid' })`
- **Requerido**: Sí

### Timestamps

#### `createdAt: Date`
- **Tipo**: Date
- **Descripción**: Fecha y hora de creación del post
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
User (1) ────────< (Muchos) Post
```

- Un usuario puede tener muchos posts
- Un post pertenece a un solo usuario
- Si se elimina un usuario, se eliminan todos sus posts (CASCADE)

### Relación One-to-Many con Like

```
Post (1) ────────< (Muchos) Like
```

- Un post puede tener muchos likes
- Un like pertenece a un solo post
- Si se elimina un post, se eliminan todos sus likes (CASCADE)

### Relación One-to-Many con Comment

```
Post (1) ────────< (Muchos) Comment
```

- Un post puede tener muchos comentarios
- Un comentario pertenece a un solo post
- Si se elimina un post, se eliminan todos sus comentarios (CASCADE)

## Ejemplos de Uso

### Post de Solo Texto
```typescript
const textPost: Post = {
  id: 'uuid-here',
  title: null,
  description: null,
  content: '¿Qué estás pensando?',
  imageUrl: null,
  type: 'text',
  authorId: 'user-uuid',
  author: user,
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

### Post con Solo Imagen
```typescript
const imagePost: Post = {
  id: 'uuid-here',
  title: null,
  description: null,
  content: null,
  imageUrl: '/images/posts/uuid.jpg',
  type: 'image',
  authorId: 'user-uuid',
  author: user,
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

### Post con Imagen y Texto
```typescript
const mixedPost: Post = {
  id: 'uuid-here',
  title: null,
  description: null,
  content: 'Hoy fue un día increíble...',
  imageUrl: '/images/posts/uuid.jpg',
  type: 'text_with_image',
  authorId: 'user-uuid',
  author: user,
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

## Validaciones Recomendadas

### Al Crear un Post

1. **Post de tipo 'text'**:
   - `content` es requerido (o al menos contenido o imagen)
   - `imageUrl` debe ser null

2. **Post de tipo 'image'**:
   - `imageUrl` es requerido
   - `content` puede ser null

3. **Post de tipo 'text_with_image'**:
   - `imageUrl` es requerido
   - `content` es requerido

## Consultas TypeORM

### Obtener todos los posts con autor
```typescript
const posts = await postsRepository.find({
  relations: ['author'],
});
```

### Obtener posts de un usuario específico
```typescript
const userPosts = await postsRepository.find({
  where: { authorId: userId },
  relations: ['author'],
  order: { createdAt: 'DESC' },
});
```

### Obtener un post con su autor
```typescript
const post = await postsRepository.findOne({
  where: { id: postId },
  relations: ['author'],
});
```

## Migraciones

Cuando uses migraciones de TypeORM, esta entidad generará una tabla con la siguiente estructura:

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255),  -- Ahora nullable
  description TEXT,
  content TEXT,
  imageUrl VARCHAR,
  type VARCHAR DEFAULT 'text',
  authorId UUID NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE
);
```

## Notas Técnicas

- **CASCADE Delete**: Si se elimina un usuario, todos sus posts se eliminan automáticamente
- **Timestamps Automáticos**: `createdAt` y `updatedAt` se gestionan automáticamente por TypeORM
- **Tipo de Post**: El campo `type` ayuda a validar y renderizar correctamente el post en el frontend
- **Relación Bidireccional**: La relación está definida en ambas entidades (User y Post)
- **Foreign Key**: `authorId` es la foreign key que referencia a `users.id`

## Relaciones Implementadas

- ✅ **Likes**: Relación One-to-Many con `Like` entity
- ✅ **Comments**: Relación One-to-Many con `Comment` entity

## Mejoras Futuras

Posibles extensiones:
- Campo `tags` (array o relación Many-to-Many)
- Campo `isPublic` (boolean para posts privados/públicos)
- Campo `location` (geolocalización)
- Campo `editedAt` (para saber si fue editado)
- Campo `views` (contador de visualizaciones)
- Campo `shares` (contador de compartidos)

