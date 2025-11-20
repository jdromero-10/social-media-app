# email.service.ts - Documentación

## Descripción
Servicio para el envío de correos electrónicos utilizando Resend. Proporciona métodos para enviar emails transaccionales como códigos de recuperación de contraseña.

## Configuración

### Variables de Entorno Requeridas

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@tudominio.com
APP_NAME=Social Media App
```

- **RESEND_API_KEY**: API key de Resend (obtener en https://resend.com/api-keys)
- **RESEND_FROM_EMAIL**: Email desde el cual se enviarán los correos (debe estar verificado en Resend)
- **APP_NAME**: Nombre de la aplicación (opcional, por defecto "Social Media App")

## Métodos

### `sendPasswordResetCode(email: string, code: string): Promise<boolean>`

Envía un código de recuperación de contraseña al usuario.

**Parámetros**:
- `email`: Email del destinatario
- `code`: Código de 6 dígitos

**Retorna**: `Promise<boolean>` - `true` si se envió correctamente, `false` en caso de error

**Ejemplo**:
```typescript
const success = await emailService.sendPasswordResetCode(
  'usuario@example.com',
  '123456'
);
```

**Template del Email**:
- Diseño HTML responsive
- Código destacado en un cuadro con borde cyan
- Información de expiración (15 minutos)
- Paleta de colores consistente con la aplicación

## Manejo de Errores

- Si `RESEND_API_KEY` no está configurada, se registra un warning pero no se lanza excepción
- Los errores de Resend se registran en los logs pero no se propagan
- El método siempre retorna `boolean` para permitir manejo flexible de errores

## Dependencias

- `resend`: Cliente oficial de Resend para Node.js
- `@nestjs/common`: Para el decorador `@Injectable()` y `Logger`

## Notas

- En desarrollo, si no hay API key configurada, los emails no se enviarán pero la aplicación seguirá funcionando
- El template del email es HTML y se renderiza correctamente en la mayoría de clientes de email
- El código se muestra en formato grande y fácil de leer

