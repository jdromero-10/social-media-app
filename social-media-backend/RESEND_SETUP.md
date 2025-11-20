# Configuración de Resend para Recuperación de Contraseña

## Pasos para Configurar Resend

### 1. Crear Cuenta en Resend

1. Ve a https://resend.com
2. Crea una cuenta (gratis hasta 3,000 emails/mes)
3. Verifica tu email

### 2. Obtener API Key

1. Ve a https://resend.com/api-keys
2. Haz clic en "Create API Key"
3. Dale un nombre (ej: "Social Media App")
4. Copia la API key (solo se muestra una vez)

### 3. Verificar Dominio (Opcional para Producción)

Para usar tu propio dominio:
1. Ve a https://resend.com/domains
2. Agrega tu dominio
3. Configura los registros DNS según las instrucciones
4. Espera la verificación

### 4. Configurar Variables de Entorno

Crea o actualiza tu archivo `.env` en el backend:

```env
# Resend Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@resend.dev
APP_NAME=Social Media App
```

**Notas**:
- `RESEND_API_KEY`: Tu API key de Resend
- `RESEND_FROM_EMAIL`: 
  - En desarrollo: Usa `onboarding@resend.dev` (ya verificado)
  - En producción: Usa tu dominio verificado (ej: `noreply@tudominio.com`)
- `APP_NAME`: Nombre de tu aplicación (aparece en los emails)

### 5. Verificar Instalación

Asegúrate de que Resend esté instalado:

```bash
cd social-media-backend
npm list resend
```

Si no está instalado:

```bash
npm install resend
```

### 6. Probar el Envío

1. Inicia el servidor backend
2. Solicita un código de recuperación de contraseña
3. Revisa tu email (y la carpeta de spam si no aparece)

## Troubleshooting

### El email no llega

1. **Verifica la API key**: Asegúrate de que `RESEND_API_KEY` esté correctamente configurada
2. **Revisa los logs**: El backend registra errores de envío
3. **Carpeta de spam**: Revisa la carpeta de spam/correo no deseado
4. **Límite de emails**: Verifica que no hayas excedido el límite gratuito (3,000/mes)

### Error: "Invalid API Key"

- Verifica que la API key esté correctamente copiada
- Asegúrate de que no haya espacios extra
- Regenera la API key si es necesario

### Error: "Domain not verified"

- En desarrollo, usa `onboarding@resend.dev`
- En producción, verifica tu dominio en Resend

## Desarrollo Local

Para desarrollo local, puedes usar el email de prueba de Resend:

```env
RESEND_FROM_EMAIL=onboarding@resend.dev
```

Este email ya está verificado y funciona inmediatamente.

## Producción

Para producción:

1. Verifica tu dominio en Resend
2. Configura los registros DNS
3. Actualiza `RESEND_FROM_EMAIL` a tu dominio verificado
4. Configura `NODE_ENV=production` para cookies seguras

## Límites del Plan Gratuito

- **3,000 emails/mes**: Suficiente para desarrollo y producción pequeña
- **100 emails/día**: Límite diario
- **Sin límite de ancho de banda**: Para el plan gratuito

## Actualizar a Plan de Pago

Si necesitas más emails:
1. Ve a https://resend.com/pricing
2. Elige un plan
3. No necesitas cambiar código, solo actualizar el plan

## Seguridad

- **Nunca commits la API key**: Asegúrate de que `.env` esté en `.gitignore`
- **Rota las API keys**: Si una key se compromete, revókala y crea una nueva
- **Usa variables de entorno**: Nunca hardcodees la API key en el código

