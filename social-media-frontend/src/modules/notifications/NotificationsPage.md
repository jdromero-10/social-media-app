# NotificationsPage.tsx - Documentación

## Descripción
Página de notificaciones que muestra todas las notificaciones del usuario. Permite al usuario mantenerse al día con su actividad en la red social.

## Ruta
- **Path**: `/notifications`
- **Protección**: Requiere autenticación (envuelta en `ProtectedRoute` y `MainLayout`)

## Estructura

### Header
- Título: "Notificaciones"
- Descripción: "Mantente al día con tu actividad"

### Lista de Notificaciones
- Área reservada para mostrar notificaciones
- Actualmente muestra un placeholder
- Listo para integrar con el backend de notificaciones

## Componentes Utilizados

- **Card**: Componente reutilizable para contenedores
- **Bell**: Icono de Lucide React para notificaciones

## Estado Actual

La página actualmente muestra un placeholder indicando que las notificaciones aparecerán aquí. Está lista para ser integrada con:

- Lista de notificaciones del usuario
- Diferentes tipos de notificaciones (like, comment, reply, etc.)
- Marcar como leídas/no leídas
- Filtros por tipo de notificación

## Uso

```tsx
// En App.tsx
<Route path="notifications" element={<NotificationsPage />} />
```

## Mejoras Futuras

- Integrar con API de notificaciones
- Mostrar lista de notificaciones
- Agregar filtros por tipo
- Marcar como leídas/no leídas
- Agregar acciones rápidas (ir al post, perfil, etc.)
- Agregar paginación
- Agregar notificaciones en tiempo real
- Agregar contador de no leídas

