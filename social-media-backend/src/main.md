# main.ts - Documentación

## Descripción
Este es el archivo de entrada principal de la aplicación NestJS. Configura y arranca el servidor, establece middleware global, configura CORS y define el puerto en el que la aplicación escuchará las peticiones.

## Configuración Inicial

### Bootstrap
La función `bootstrap()` es asíncrona y se ejecuta al iniciar la aplicación. Realiza las siguientes configuraciones:

1. **Creación de la aplicación NestJS**: Usa `NestFactory.create(AppModule)` para crear la instancia de la aplicación.

2. **Cookie Parser**: Configura el middleware `cookie-parser` para poder leer y escribir cookies HTTP.
   - **Importante**: Se usa `cookieParser.default()` para compatibilidad con la importación de módulos ES.
   - Permite que el backend pueda leer cookies enviadas por el cliente y establecer cookies en las respuestas.

3. **CORS (Cross-Origin Resource Sharing)**: Configura CORS para permitir peticiones desde el frontend.
   - **Origin**: Configurado desde `process.env.FRONTEND_URL` o por defecto `http://localhost:5173`
   - **Credentials**: Habilitado (`credentials: true`) para permitir el envío de cookies entre dominios
   - **Métodos permitidos**: GET, POST, PUT, PATCH, DELETE, OPTIONS
   - **Headers permitidos**: Content-Type, Authorization

4. **Validation Pipe Global**: Configura validación automática de DTOs.
   - **whitelist**: Elimina propiedades que no están definidas en el DTO
   - **transform**: Transforma automáticamente los objetos entrantes a instancias de DTO
   - **forbidUnknownValues**: Deshabilitado para mayor flexibilidad

5. **Puerto**: La aplicación escucha en el puerto definido por `process.env.PORT` o por defecto `3000`.

## Implementación de Cookies HTTP-Only

### ¿Por qué cookies HTTP-only?

La aplicación ha sido migrada de usar tokens JWT en headers Authorization a usar cookies HTTP-only por las siguientes razones de seguridad:

1. **Protección contra XSS**: Las cookies HTTP-only no son accesibles desde JavaScript, lo que previene ataques de Cross-Site Scripting (XSS).
2. **Seguridad automática**: El navegador maneja automáticamente el envío de cookies en cada petición.
3. **Mejor para SPAs**: Ideal para aplicaciones de una sola página (SPA) donde el token debe persistir entre recargas.

### Configuración de Cookies

Las cookies se configuran en los endpoints de autenticación (`/auth/login` y `/auth/register`) con las siguientes características:

- **httpOnly**: `true` - No accesible desde JavaScript
- **secure**: `true` en producción - Solo se envían por HTTPS
- **sameSite**: `'lax'` - Protección contra CSRF
- **maxAge**: 3600000ms (1 hora) - Tiempo de expiración del token

## Variables de Entorno

El archivo utiliza las siguientes variables de entorno:

- `FRONTEND_URL`: URL del frontend para configuración CORS (opcional, por defecto: `http://localhost:5173`)
- `PORT`: Puerto en el que escuchará el servidor (opcional, por defecto: `3000`)
- `NODE_ENV`: Entorno de ejecución (`production` o `development`)

## Flujo de Inicio

```
Aplicación inicia
    ↓
bootstrap() se ejecuta
    ↓
Crea instancia de NestJS
    ↓
Configura cookie-parser
    ↓
Configura CORS con credentials
    ↓
Configura Validation Pipe global
    ↓
Escucha en puerto 3000 (o PORT)
    ↓
Aplicación lista para recibir peticiones
```

## Dependencias

- `@nestjs/common`: Decoradores y utilidades de NestJS
- `@nestjs/core`: Core de NestJS (NestFactory)
- `cookie-parser`: Middleware para manejar cookies
- `AppModule`: Módulo raíz de la aplicación

## Notas de Seguridad

1. **CORS**: Asegúrate de configurar correctamente `FRONTEND_URL` en producción para evitar problemas de CORS.
2. **Cookies**: En producción, las cookies se envían solo por HTTPS gracias a la opción `secure`.
3. **SameSite**: La configuración `lax` permite que las cookies se envíen en navegación top-level, protegiendo contra CSRF.

## Ejemplo de Configuración en Producción

```env
# .env
FRONTEND_URL=https://tu-frontend.com
PORT=3000
NODE_ENV=production
JWT_SECRET=tu-secret-super-seguro
```

## Extensión Futura

Puedes agregar más middleware aquí según necesites:
- Helmet para headers de seguridad
- Rate limiting para prevenir abuso
- Compression para comprimir respuestas
- Logging middleware personalizado

