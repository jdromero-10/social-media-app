# QueryProvider.tsx - Documentación

## Descripción
Este componente proporciona el contexto de TanStack Query (React Query) a toda la aplicación. Es un Provider que envuelve la aplicación y configura el `QueryClient` con opciones por defecto optimizadas para una aplicación de producción.

## Componente

### `QueryProvider`
- **Tipo**: Componente funcional de React
- **Props**: 
  - `children`: ReactNode - Los componentes hijos que necesitan acceso a TanStack Query
- **Propósito**: Envuelve la aplicación y proporciona el contexto de React Query

## Configuración del QueryClient

El `QueryClient` se configura con las siguientes opciones por defecto:

### Queries (Consultas)
- **refetchOnWindowFocus**: `false`
  - Evita refetch automático cuando el usuario vuelve a la ventana del navegador
  - Mejora el rendimiento y reduce peticiones innecesarias
  
- **retry**: `1`
  - Reintenta automáticamente 1 vez si una query falla
  - Útil para manejar errores temporales de red
  
- **staleTime**: `5 * 60 * 1000` (5 minutos)
  - Define cuánto tiempo los datos se consideran "frescos"
  - Durante este tiempo, React Query no hará refetch automático
  - Mejora el rendimiento al evitar peticiones redundantes

### Mutations (Mutaciones)
- **retry**: `1`
  - Reintenta automáticamente 1 vez si una mutación falla
  - Útil para operaciones críticas como login/register

## Uso

Debe envolver tu aplicación en `main.tsx` o `App.tsx`:

```tsx
import { QueryProvider } from '@/shared/providers/QueryProvider';

function App() {
  return (
    <QueryProvider>
      {/* Tu aplicación aquí */}
    </QueryProvider>
  );
}
```

## Flujo de Datos

```
QueryProvider (nivel superior)
    ↓
QueryClient (configurado)
    ↓
useQuery / useMutation hooks
    ↓
Componentes que usan los hooks
```

## Ventajas de esta Configuración

1. **Rendimiento optimizado**: 
   - Evita refetches innecesarios
   - Cachea datos por 5 minutos

2. **Mejor UX**:
   - Reintentos automáticos en caso de errores temporales
   - Datos se mantienen frescos sin sobrecargar el servidor

3. **Configuración centralizada**:
   - Todas las opciones por defecto están en un solo lugar
   - Fácil de ajustar según necesidades

## Personalización

Si necesitas cambiar la configuración, modifica el objeto pasado a `new QueryClient()`:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutos
      // ... más opciones
    },
  },
});
```

## Notas Técnicas

- El `QueryClient` se crea una sola vez cuando se importa el módulo (singleton pattern).
- React Query maneja automáticamente el cache, refetching, y sincronización de datos.
- Puedes acceder al `queryClient` directamente usando `useQueryClient()` hook en cualquier componente hijo.

