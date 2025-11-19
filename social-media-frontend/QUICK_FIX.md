# 🔧 Solución Rápida - Error de Conexión

## El Problema

Estás viendo el error: **"No se pudo conectar con el servidor"** con statusCode: 0

## ✅ Solución Inmediata

### Paso 1: Verificar que el Backend esté Corriendo

Abre una terminal y ejecuta:

```bash
cd social-media-backend
npm run start:dev
```

**Deberías ver:**
```
Application is running on: http://localhost:3000
```

Si no ves este mensaje, el backend no está corriendo. Espera a que aparezca antes de continuar.

### Paso 2: Verificar que el Frontend esté Corriendo

Abre **otra terminal** y ejecuta:

```bash
cd social-media-frontend
npm run dev
```

**Deberías ver algo como:**
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

### Paso 3: Probar la Conexión

1. Abre tu navegador en `http://localhost:5173`
2. Intenta hacer login nuevamente
3. Si aún ves el error, continúa con el Paso 4

### Paso 4: Verificar CORS (Más Común)

El backend ahora tiene CORS habilitado. Si aún tienes problemas:

1. **Reinicia el backend** (Ctrl+C y luego `npm run start:dev` nuevamente)
2. **Limpia la caché del navegador** (Ctrl+Shift+R o ventana de incógnito)
3. **Vuelve a intentar**

## 🔍 Verificación Rápida

Abre tu navegador y ve directamente a:
```
http://localhost:3000
```

- **Si ves algo** (aunque sea un error 404): El backend está corriendo ✅
- **Si no carga nada**: El backend NO está corriendo ❌

## ⚠️ Causas Más Comunes

1. **Backend no está corriendo** (90% de los casos)
   - Solución: Ejecuta `npm run start:dev` en la carpeta del backend

2. **Backend en otro puerto**
   - Solución: Verifica el puerto en la terminal del backend
   - Si es diferente a 3000, crea un archivo `.env` en `social-media-frontend/`:
     ```
     VITE_API_BASE_URL=http://localhost:PUERTO_AQUI
     ```

3. **CORS no configurado** (Ya solucionado)
   - El backend ahora tiene CORS habilitado
   - Reinicia el backend para aplicar los cambios

## 📝 Nota

Si después de seguir estos pasos aún tienes el error, revisa el archivo `TROUBLESHOOTING.md` para más opciones de diagnóstico.

