# HomePage.tsx - Documentación

## Descripción
Página principal (Home/Feed) de la red social. Muestra el feed de publicaciones con scroll infinito, modal para crear posts, y funcionalidades de edición/eliminación.

## Características Principales

### Scroll Infinito
- Usa `Intersection Observer` para detectar cuando el usuario llega al final
- Carga automáticamente la siguiente página cuando se acerca al final
- Muestra indicador de carga mientras se obtienen más posts

### Gestión de Posts
- **Crear**: Modal con formulario para crear nuevos posts
- **Editar**: Modal con formulario prellenado para editar posts existentes
- **Eliminar**: Confirmación antes de eliminar un post

### Estados de Carga
- Indicador de carga inicial cuando se cargan los primeros posts
- Indicador de carga para scroll infinito
- Estados de carga para crear/editar/eliminar

## Estructura

### Header
- Título "Inicio" con descripción
- Botón "Crear Post" que abre el modal global usando `useCreatePostModal`

### Modales
1. **Modal de Crear Post**: 
   - **Ubicación**: Renderizado en `MainLayout` (global)
   - **Apertura**: Usa `useCreatePostModal().openModal()` desde cualquier componente
   - **Formulario**: `CreatePostForm` para crear nuevos posts
   - **Lógica**: Se maneja en `MainLayout`, no en HomePage
   
2. **Modal de Editar Post**: 
   - **Ubicación**: Renderizado en HomePage (local)
   - **Formulario**: `CreatePostForm` prellenado para editar posts
   - **Datos iniciales**: Solo incluye `content` e `imageUrl` (no `title` ni `description`)
   - **Lógica**: Se maneja en HomePage

3. **Modal de Confirmación para Eliminar**:
   - **Ubicación**: Renderizado en HomePage (local)
   - **Componente**: `ConfirmModal` global reutilizable
   - **Variante**: `danger` (rojo) para acciones destructivas
   - **Lógica**: Se maneja en HomePage con estado `isDeleteModalOpen` y `postToDelete`

**Nota**: Los modales usan el componente `Modal` global reutilizable con overlay semitransparente (40% de opacidad) y efecto de desenfoque para una mejor experiencia visual.

### Feed
- Lista de `PostCard` componentes
- Indicador de carga para scroll infinito
- Mensaje cuando no hay más posts
- Mensaje cuando no hay posts

## Integración con Store

Usa `usePostStore` de Zustand para:
- Obtener posts del estado global
- Gestionar estados de carga
- Realizar operaciones CRUD (excepto crear, que se maneja en MainLayout)
- Manejar paginación

## Integración con Modal de Crear Post

HomePage usa el hook `useCreatePostModal` para abrir el modal global:

```tsx
const { openModal: openCreateModal } = useCreatePostModal();

// En el botón
<Button onClick={openCreateModal}>
  Crear Post
</Button>
```

**Nota**: El modal de crear post se renderiza en `MainLayout`, no en HomePage. La lógica de creación también se maneja en MainLayout.

## Integración con API

- Obtiene usuario actual con React Query
- Usa el store para todas las operaciones de posts
- Muestra toasts para feedback al usuario

## Uso

```tsx
import { HomePage } from '../modules/home/HomePage';

// Se usa en las rutas
<Route path="/home" element={<HomePage />} />
```

## Funcionalidades

### Crear Post
1. Usuario hace clic en "Crear Post" (en HomePage o SideBar)
2. Se llama a `openModal()` del contexto `CreatePostModalContext`
3. Se abre el modal global (renderizado en MainLayout)
4. Usuario completa el formulario
5. Al enviar, se llama a `createPost` del store (en MainLayout)
6. Se muestra toast de éxito/error
7. El modal se cierra automáticamente con `closeModal()`

### Editar Post
1. Usuario hace clic en menú de opciones del post
2. Selecciona "Editar"
3. Se abre modal con formulario prellenado (solo `content` e `imageUrl`)
4. Usuario modifica el contenido o la imagen
5. Al enviar, se llama a `updatePost` del store
6. Se muestra toast de éxito/error

### Eliminar Post
1. Usuario hace clic en menú de opciones del post
2. Selecciona "Eliminar"
3. Se abre el modal de confirmación (`ConfirmModal`)
4. Usuario confirma o cancela
5. Si confirma, se llama a `deletePost` del store
6. Se muestra toast de éxito/error
7. El modal se cierra automáticamente

### Scroll Infinito
1. Usuario hace scroll hacia abajo
2. Cuando llega cerca del final, `Intersection Observer` detecta
3. Se carga la siguiente página con `append: true`
4. Los nuevos posts se agregan al final de la lista

## Componentes Utilizados

- `PostCard`: Para mostrar cada post
- `CreatePostForm`: Para crear/editar posts
- `Modal`: Componente global reutilizable para el modal de editar (con overlay semitransparente)
- `ConfirmModal`: Componente global reutilizable para confirmar acciones destructivas
- `Button`: Para el botón de crear post
- `Card`: Para mensajes y estados vacíos
- `useCreatePostModal`: Hook para abrir el modal global de crear post

**Nota**: Las notificaciones toast se muestran automáticamente desde el `PostStore`. El `ToastProvider` está renderizado en `MainLayout` y muestra las notificaciones globalmente.

## Estados

### Carga Inicial
```tsx
{isLoading && posts.length === 0 && (
  <Card>
    <Loader2 className="animate-spin" />
    <span>Cargando posts...</span>
  </Card>
)}
```

### Sin Posts
```tsx
{posts.length === 0 && !isLoading && (
  <Card>
    <p>No hay posts todavía</p>
    <Button onClick={openCreateModal}>
      Crear tu primer post
    </Button>
  </Card>
)}
```

### Scroll Infinito
```tsx
{hasMore && (
  <div ref={loadMoreRef}>
    {isLoading ? <Loader2 /> : <div />}
  </div>
)}
```

## Notas Técnicas

- Usa `useEffect` para cargar posts iniciales
- `Intersection Observer` para scroll infinito
- `useRef` para la referencia del elemento de carga
- Limpia el observer al desmontar
- Resetea el store al montar el componente
- Usa `useCreatePostModal()` para abrir el modal global de crear post
- El modal de crear post se renderiza en MainLayout, no en HomePage
- Solo el modal de editar y el modal de confirmación se manejan localmente en HomePage
- Usa `ConfirmModal` en lugar de `confirm()` nativo del navegador para mejor UX
- Estado `postToDelete` almacena el ID del post a eliminar mientras se muestra el modal
- **Las notificaciones se muestran automáticamente** desde el `PostStore` cuando se crean/editan/eliminan posts
- No es necesario llamar manualmente a `showToast` en los handlers, el store lo hace automáticamente

## Mejores Prácticas

1. **Reset al montar**: Limpia el store al entrar a la página
2. **Scroll infinito**: Solo carga si hay más posts y no está cargando
3. **Confirmación**: Usa `ConfirmModal` para confirmar antes de eliminar (mejor UX que `confirm()` nativo)
4. **Feedback Automático**: Las notificaciones se muestran automáticamente desde el `PostStore` (no necesitas llamarlas manualmente)
5. **Estados vacíos**: Maneja todos los estados posibles (cargando, vacío, error)
6. **Limpieza de estado**: Limpia `postToDelete` al cerrar el modal de confirmación
7. **Prevenir cierre accidental**: Desactiva `closeOnOverlayClick` durante la eliminación
