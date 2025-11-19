# tokenStorage.ts - Documentación

## Descripción
Este archivo contiene utilidades para manejar el almacenamiento del token JWT en el navegador usando `localStorage`. Es una capa de abstracción que centraliza todas las operaciones relacionadas con el token de autenticación.

## Funciones Exportadas

### `saveToken(token: string): void`
- **Propósito**: Guarda el token JWT en el almacenamiento local del navegador.
- **Parámetros**: 
  - `token`: El token JWT como string
- **Uso**: Se llama después de un login o registro exitoso para persistir la sesión.

### `getToken(): string | null`
- **Propósito**: Obtiene el token JWT guardado previamente.
- **Retorna**: El token como string o `null` si no existe.
- **Uso**: Se utiliza para incluir el token en las peticiones HTTP (headers Authorization).

### `removeToken(): void`
- **Propósito**: Elimina el token del almacenamiento local.
- **Uso**: Se llama durante el logout para cerrar la sesión del usuario.

### `hasToken(): boolean`
- **Propósito**: Verifica si existe un token guardado.
- **Retorna**: `true` si existe un token, `false` en caso contrario.
- **Uso**: Útil para verificar el estado de autenticación sin necesidad de obtener el token completo.

## Constante
- `TOKEN_KEY`: Clave utilizada en localStorage para almacenar el token. Valor: `'auth_token'`

## Notas Técnicas
- Utiliza `localStorage` del navegador, que persiste los datos incluso después de cerrar el navegador.
- Si necesitas una sesión que expire al cerrar el navegador, deberías usar `sessionStorage` en su lugar.
- Todas las funciones son síncronas y no lanzan errores si localStorage no está disponible (aunque en navegadores modernos siempre lo está).

