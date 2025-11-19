# Guía de Solución de Problemas - Error de Conexión

## Error: "No se pudo conectar con el servidor"

Este error ocurre cuando el frontend no puede establecer una conexión con el backend. Aquí están las causas más comunes y cómo solucionarlas:

## 🔍 Diagnóstico

### 1. Verificar que el Backend esté Corriendo

**Síntoma**: Error "No se pudo conectar con el servidor" con statusCode: 0

**Solución**:
1. Abre una terminal en la carpeta `social-media-backend`
2. Ejecuta:
   ```bash
   npm run start:dev
   ```
3. Deberías ver un mensaje como: `Application is running on: http://localhost:3000`

**Verificación**:
- Abre tu navegador y ve a: `http://localhost:3000`
- Deberías ver una respuesta (puede ser un error 404, pero significa que el servidor está corriendo)

### 2. Verificar el Puerto del Backend

**Problema**: El frontend espera el backend en el puerto 3000 por defecto.

**Solución**:
1. Verifica en qué puerto está corriendo tu backend:
   - Revisa `social-media-backend/src/main.ts` (línea 14)
   - O revisa la variable de entorno `PORT` si la tienes configurada

2. Si el backend está en otro puerto, configura el frontend:
   - Crea un archivo `.env` en `social-media-frontend/`
   - Agrega: `VITE_API_BASE_URL=http://localhost:PUERTO`
   - Ejemplo: `VITE_API_BASE_URL=http://localhost:3001`
   - Reinicia el servidor de desarrollo del frontend

### 3. Verificar CORS (Cross-Origin Resource Sharing)

**Problema**: El backend puede estar bloqueando las peticiones del frontend por CORS.

**Solución**:
1. Abre `social-media-backend/src/main.ts`
2. Asegúrate de que tenga habilitado CORS:
   ```typescript
   async function bootstrap() {
     const app = await NestFactory.create(AppModule);
     
     // Habilitar CORS
     app.enableCors({
       origin: 'http://localhost:5173', // O el puerto donde corre tu frontend
       credentials: true,
     });
     
     app.useGlobalPipes(/* ... */);
     await app.listen(process.env.PORT ?? 3000);
   }
   ```

### 4. Verificar la URL en el Frontend

**Problema**: La URL del backend puede estar mal configurada.

**Solución**:
1. Abre `social-media-frontend/src/api/apiClient.ts`
2. Verifica la línea 6:
   ```typescript
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
   ```
3. Si necesitas cambiarla, crea un archivo `.env` en `social-media-frontend/`:
   ```
   VITE_API_BASE_URL=http://localhost:3000
   ```

### 5. Verificar que el Frontend esté Corriendo

**Problema**: El frontend puede no estar corriendo o estar en un puerto diferente.

**Solución**:
1. Abre una terminal en `social-media-frontend`
2. Ejecuta:
   ```bash
   npm run dev
   ```
3. Verifica en qué puerto está corriendo (normalmente `http://localhost:5173`)

### 6. Verificar Firewall/Antivirus

**Problema**: El firewall o antivirus puede estar bloqueando las conexiones.

**Solución**:
- Verifica que tu firewall permita conexiones en localhost
- Temporalmente desactiva el antivirus para probar (solo para diagnóstico)

## 🛠️ Pasos de Verificación Rápida

1. **Backend corriendo?**
   ```bash
   cd social-media-backend
   npm run start:dev
   ```
   Deberías ver: `Application is running on: http://localhost:3000`

2. **Frontend corriendo?**
   ```bash
   cd social-media-frontend
   npm run dev
   ```
   Deberías ver: `Local: http://localhost:5173`

3. **Probar conexión manualmente:**
   - Abre el navegador
   - Ve a: `http://localhost:3000/auth/login`
   - Deberías ver un error (porque es POST), pero significa que el servidor responde

4. **Verificar en la consola del navegador:**
   - Abre DevTools (F12)
   - Ve a la pestaña "Network"
   - Intenta hacer login
   - Revisa la petición fallida para ver más detalles

## 📋 Checklist de Diagnóstico

- [ ] Backend está corriendo en el puerto 3000
- [ ] Frontend está corriendo (normalmente puerto 5173)
- [ ] CORS está habilitado en el backend
- [ ] La URL en `apiClient.ts` es correcta
- [ ] No hay errores en la consola del backend
- [ ] No hay errores en la consola del navegador
- [ ] El puerto 3000 no está siendo usado por otra aplicación

## 🔧 Solución Rápida

Si nada funciona, prueba esto:

1. **Detén ambos servidores** (Ctrl+C en ambas terminales)

2. **Reinicia el backend:**
   ```bash
   cd social-media-backend
   npm run start:dev
   ```

3. **Reinicia el frontend:**
   ```bash
   cd social-media-frontend
   npm run dev
   ```

4. **Limpia la caché del navegador:**
   - Presiona Ctrl+Shift+R (o Cmd+Shift+R en Mac)
   - O abre una ventana de incógnito

## 📞 Información para Debug

Si el problema persiste, recopila esta información:

1. **Puerto del backend**: ¿En qué puerto está corriendo?
2. **Puerto del frontend**: ¿En qué puerto está corriendo?
3. **Mensaje de error completo**: Copia el error exacto de la consola
4. **Logs del backend**: ¿Hay algún error en la terminal del backend?
5. **Network tab**: ¿Qué muestra la pestaña Network en DevTools?

## 💡 Notas Adicionales

- El error `statusCode: 0` significa que `fetch()` falló antes de recibir una respuesta
- Esto es diferente a un error HTTP (que tendría statusCode 400, 401, etc.)
- Si ves un error de CORS en la consola, el problema es la configuración de CORS en el backend

