# PostCard.tsx - Documentación

## Descripción
Componente reutilizable que representa una publicación individual en el feed. Incluye header con avatar y opciones, contenido del post, imágenes con carrusel, y footer con botones de interacción.

## Props

```typescript
interface PostCardProps {
  post: Post;                    // Post a mostrar
  currentUser: User | null;      // Usuario actual (para verificar ownership)
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: string) => void;
  className?: string;            // Clases CSS adicionales
}
```

## Estructura

### Header
- **Avatar**: Muestra el avatar del autor usando el componente `Avatar` global
- **Información del autor**: Nombre y fecha de publicación
- **Menú de opciones**: Botón de tres puntos (solo visible si el post pertenece al usuario actual)
  - Editar: Abre modal de edición
  - Eliminar: Elimina el post con confirmación

### Contenido
- **Título**: Título del post (siempre visible)
- **Descripción**: Descripción opcional del post
- **Contenido**: Contenido de texto del post
- **Formato**: Respeta saltos de línea con `whitespace-pre-wrap`

### Imágenes
- Usa el componente `ImageCarousel` para mostrar imágenes
- Si hay múltiples imágenes, muestra un carrusel con controles
- Si hay una sola imagen, la muestra directamente

### Footer de Interacción
- **Like**: Botón de corazón que cambia de color si el usuario ya dio like
  - Gris: No ha dado like
  - Rojo: Ya dio like
  - Muestra el contador de likes
- **Comentar**: Botón de burbuja de diálogo con contador de comentarios

## Características

### Indicadores Reactivos
- **Like**: El botón cambia de color (gris → rojo) si el usuario ya dio like
- **Contador de likes**: Muestra el número de likes
- **Contador de comentarios**: Muestra el número de comentarios

### Formateo de Fecha
La fecha se muestra en formato relativo:
- "Ahora" si es hace menos de 1 minuto
- "Hace X min" si es hace menos de 1 hora
- "Hace X h" si es hace menos de 24 horas
- "Hace X d" si es hace menos de 7 días
- Fecha completa si es más antigua

### Menú de Opciones
Solo visible para el dueño del post:
- **Editar**: Llama a `onEdit` con el post completo
- **Eliminar**: Llama a `onDelete` con el ID del post

## Uso

```tsx
import { PostCard } from '../posts/components/PostCard';

<PostCard
  post={post}
  currentUser={currentUser}
  onLike={(postId) => console.log('Like:', postId)}
  onComment={(postId) => console.log('Comment:', postId)}
  onEdit={(post) => handleEdit(post)}
  onDelete={(postId) => handleDelete(postId)}
/>
```

## Estilos

- Usa el componente `Card` global para el contenedor
- Sombra suave y bordes redondeados
- Colores consistentes con la paleta global
- Transiciones suaves en hover
- Responsive y adaptable a diferentes tamaños de pantalla

## Componentes Utilizados

- `Avatar`: Para mostrar el avatar del autor
- `Card`: Contenedor principal del post
- `ImageCarousel`: Para mostrar imágenes del post
- `Button`: No se usa directamente, pero los botones siguen el mismo estilo

## Accesibilidad

- Botones con `aria-label` apropiados
- Navegación por teclado funcional
- Estados de focus visibles
- Contraste adecuado

## Notas Técnicas

- El componente verifica si el usuario actual es el dueño del post
- Los likes se verifican cruzando `userId` con la lista de likes
- El menú se cierra automáticamente al hacer clic fuera
- Las imágenes tienen manejo de errores (se ocultan si fallan al cargar)

