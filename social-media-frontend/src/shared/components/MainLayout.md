# MainLayout.tsx - Documentación

## Descripción
Componente de layout principal que sirve como contenedor para todas las rutas autenticadas de la aplicación. Proporciona una estructura consistente con SideBar, NavBar y área de contenido principal usando React Router's `<Outlet>`. También incluye el modal global de crear post y su contexto compartido.

## Estructura

El layout está organizado en una estructura de flexbox que incluye:

1. **CreatePostModalProvider**: Contexto que envuelve todo el layout
2. **SidebarProvider**: Contexto para controlar la visibilidad del sidebar
3. **SideBar**: Barra de navegación lateral (izquierda) con capacidad de ocultarse
4. **NavBar**: Barra de navegación superior
5. **Main Content Area**: Área de contenido que renderiza las rutas hijas mediante `<Outlet>`
6. **Modal de Crear Post**: Modal global disponible desde cualquier página

## Uso

### En App.tsx

```tsx
<Route
  path="/"
  element={
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  }
>
  <Route path="home" element={<HomePage />} />
  <Route path="profile" element={<ProfilePage />} />
  <Route path="notifications" element={<NotificationsPage />} />
</Route>
```

## Componentes Integrados

### CreatePostModalProvider
- Proporciona el contexto del modal de crear post
- Permite que cualquier componente abra el modal
- Envuelve todo el contenido del layout

### SidebarProvider
- Proporciona el contexto para controlar la visibilidad del sidebar
- Permite ocultar/mostrar el sidebar desde cualquier componente
- Estado inicial: sidebar visible (`isVisible: true`)

### SideBar
- Barra lateral fija en desktop con capacidad de colapsarse
- **Expandido**: 256px de ancho con textos visibles
- **Colapsado**: 64px de ancho con solo iconos visibles
- Botón de ocultar/mostrar en el header (solo desktop)
- Menú hamburguesa en móvil
- Navegación entre secciones principales
- Botón "Crear Post" que abre el modal global

### NavBar
- Barra superior con logo, búsqueda y avatar
- Menú desplegable de usuario
- Acceso a perfil, configuración y logout

### Outlet
- Renderiza el componente de la ruta activa
- Área de contenido principal con padding y márgenes adecuados

### Modal de Crear Post
- Modal global renderizado en MainLayout
- Disponible desde cualquier página
- Usa `CreatePostForm` para el formulario
- Maneja la creación de posts usando `usePostStore`
- Las notificaciones se muestran automáticamente desde el PostStore

### ToastProvider (Sistema de Notificaciones)
- Provider global para notificaciones toast
- Renderiza `ToastContainer` que muestra todas las notificaciones activas
- Lee automáticamente del `toastStore` de Zustand
- Posicionado fijamente en la esquina superior derecha
- No bloqueante y disponible en toda la aplicación

## Responsividad

### Desktop (lg: y superior)
- SideBar fijo a la izquierda con ancho variable:
  - **Expandido**: 256px de ancho (`w-64`)
  - **Colapsado**: 64px de ancho (`w-16`)
- NavBar en la parte superior
- Contenido principal se ajusta automáticamente:
  - **Sidebar expandido**: `ml-64` (margen izquierdo de 256px)
  - **Sidebar colapsado**: `ml-16` (margen izquierdo de 64px)
- Transición suave de 300ms al cambiar estados

### Móvil (< lg)
- SideBar se convierte en menú off-canvas (hamburguesa)
- BottomNav en la parte inferior
- NavBar simplificado en la parte superior
- Contenido principal con padding ajustado

## Estilos

- **Fondo**: `bg-gray-50` para el contenedor principal
- **Layout**: Flexbox para organización horizontal
- **Padding**: Responsive con `px-4 sm:px-6 lg:px-8`
- **Altura**: `min-h-screen` para ocupar toda la altura

## Estructura HTML

```tsx
<CreatePostModalProvider>
  <SidebarProvider>
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <SideBar />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${isVisible ? 'lg:ml-64' : 'lg:ml-16'}`}>
          <NavBar />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      {/* Modal de Crear Post Global */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <CreatePostForm onSubmit={handleCreatePost} />
      </Modal>
      {/* Sistema de Notificaciones Global */}
      <ToastProvider />
    </div>
  </SidebarProvider>
</CreatePostModalProvider>
```

## Notas Técnicas

- Usa `<Outlet>` de React Router para renderizar rutas hijas
- El layout está envuelto en `ProtectedRoute` para asegurar autenticación
- El contenido principal tiene `max-w-7xl` para limitar el ancho en pantallas grandes
- `overflow-y-auto` permite scroll independiente del contenido
- Usa `CreatePostModalProvider` para compartir el estado del modal
- Usa `SidebarProvider` para compartir el estado de visibilidad del sidebar
- El modal de crear post se renderiza en MainLayout para estar disponible globalmente
- La lógica de creación de post se maneja en `MainLayoutContent` usando `usePostStore`
- El `ToastProvider` renderiza el sistema de notificaciones global
- Las notificaciones se muestran automáticamente desde el `PostStore` cuando se crean/editan/eliminan posts
- El margen izquierdo del contenido principal se ajusta dinámicamente según el estado del sidebar
- La transición del contenido es de 300ms para coincidir con la animación del sidebar

## Mejoras Futuras

- Agregar animaciones de transición entre rutas
- Implementar breadcrumbs
- Agregar soporte para temas (dark mode)
- Mejorar la gestión del estado del menú móvil

