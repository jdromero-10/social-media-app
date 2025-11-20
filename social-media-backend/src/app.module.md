# app.module.ts - Documentación

## Descripción
Módulo raíz de la aplicación NestJS. Configura todos los módulos de la aplicación, la conexión a la base de datos, y las variables de entorno.

## Estructura

```typescript
@Module({
  imports: [
    ConfigModule,      // Configuración global de variables de entorno
    TypeOrmModule,    // Conexión a PostgreSQL
    AuthModule,       // Autenticación y autorización
    UsersModule,      // Gestión de usuarios
    PostsModule,      // Gestión de posts
    NotificationsModule, // Sistema de notificaciones
    UploadModule,     // Gestión de uploads de imágenes
  ],
  controllers: [AppController],
  providers: [AppService],
})
```

## Módulos Importados

### ConfigModule
- **Configuración**: `isGlobal: true` - Disponible en toda la aplicación
- **Archivos de entorno**: Carga desde `.env.local` y `.env` (en ese orden)
- **Uso**: Permite acceder a variables de entorno en cualquier módulo usando `process.env`

### TypeOrmModule
- **Base de datos**: PostgreSQL
- **Configuración**:
  - Host: `localhost`
  - Puerto: `5432`
  - Usuario: `postgres`
  - Contraseña: `root1234`
  - Base de datos: `social_media_app`
- **Sincronización**: `synchronize: true` (solo para desarrollo)
- **Entidades**: Busca automáticamente archivos `.entity.ts` en toda la aplicación

### AuthModule
- Maneja autenticación (login, registro)
- Maneja recuperación de contraseña
- Genera y valida tokens JWT
- Protege rutas con `JwtAuthGuard`

### UsersModule
- Gestión de usuarios (CRUD)
- Endpoints para actualizar perfil
- Relación con entidades de autenticación

### PostsModule
- Gestión de posts (crear, leer, actualizar, eliminar)
- Relación con usuarios (autor)
- Sistema de likes y comentarios

### NotificationsModule
- Sistema de notificaciones
- Notificaciones en tiempo real (futuro)

### UploadModule
- **Nuevo**: Gestión de uploads de imágenes
- Endpoints:
  - `POST /upload/user-avatar` - Para avatares de usuario
  - `POST /upload/post-image` - Para imágenes de posts
- Almacenamiento local en carpeta `images/`
- Validación de archivos (tipo y tamaño)

## Configuración de Variables de Entorno

El módulo carga variables de entorno desde:
1. `.env.local` (prioridad)
2. `.env` (fallback)

**Variables importantes**:
- `JWT_SECRET`: Secreto para firmar tokens JWT
- `RESEND_API_KEY`: API key para servicio de email (Resend)
- `RESEND_FROM_EMAIL`: Email remitente para emails
- `FRONTEND_URL`: URL del frontend para CORS
- `PORT`: Puerto del servidor

## Estructura de Carpetas de Imágenes

El `UploadModule` crea automáticamente:
```
social-media-backend/
└── images/
    ├── users/    # Avatares de usuarios
    └── posts/    # Imágenes de posts
```

Estas carpetas se crean automáticamente al iniciar la aplicación.

## Orden de Importación

El orden de importación es importante:
1. `ConfigModule` primero (necesario para otras configuraciones)
2. `TypeOrmModule` segundo (necesario para entidades)
3. Módulos de funcionalidad después

## Extensión

Para agregar un nuevo módulo:
1. Crear el módulo en su carpeta correspondiente
2. Importarlo en `imports: []`
3. Asegurarse de que las dependencias estén disponibles

## Notas de Desarrollo

- `synchronize: true` solo debe usarse en desarrollo
- En producción, usar migraciones de TypeORM
- Las variables de entorno sensibles deben estar en `.env.local` (no en git)

