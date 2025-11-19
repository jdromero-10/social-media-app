# main.tsx - Documentación

## Descripción
Este es el punto de entrada de la aplicación React. Renderiza la aplicación en el DOM y envuelve todo con los providers necesarios, incluyendo TanStack Query.

## Estructura

### Imports
- **StrictMode**: Modo estricto de React para detectar problemas potenciales
- **createRoot**: API moderna de React 18 para crear la raíz de la aplicación
- **QueryProvider**: Provider de TanStack Query para manejo de estado del servidor

### Renderizado
```tsx
<StrictMode>
  <QueryProvider>
    <App />
  </QueryProvider>
</StrictMode>
```

## Jerarquía de Providers

```
StrictMode (React)
  └── QueryProvider (TanStack Query)
      └── App (Aplicación principal)
          └── BrowserRouter (React Router)
              └── Routes
                  └── Páginas
```

## QueryProvider

El `QueryProvider` es esencial porque:
- Proporciona el contexto de TanStack Query a toda la aplicación
- Permite usar hooks como `useQuery` y `useMutation` en cualquier componente
- Configura opciones por defecto para queries y mutations

## Orden de Providers

El orden es importante:
1. **StrictMode** (más externo): Ayuda a detectar problemas en desarrollo
2. **QueryProvider**: Debe estar antes de cualquier componente que use TanStack Query
3. **App**: Contiene la lógica de routing y componentes principales

## Notas Técnicas

- `createRoot` es la API moderna de React 18 (reemplaza a `ReactDOM.render`)
- El `!` en `getElementById('root')!` es una aserción de tipo TypeScript (asumimos que el elemento existe)
- `StrictMode` solo tiene efecto en desarrollo, no en producción

## Extensión Futura

Si necesitas agregar más providers (por ejemplo, para temas, autenticación global, etc.), agrégalos aquí:

```tsx
<StrictMode>
  <QueryProvider>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </QueryProvider>
</StrictMode>
```

