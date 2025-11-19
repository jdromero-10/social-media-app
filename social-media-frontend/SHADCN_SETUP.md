# Configuración de shadcn/ui

## ✅ Instalación Completada

shadcn/ui ha sido configurado exitosamente en el proyecto. Aquí está todo lo que se ha configurado:

## 📦 Dependencias Instaladas

- `class-variance-authority` - Para variantes de componentes
- `clsx` - Para combinar clases condicionalmente
- `tailwind-merge` - Para fusionar clases de Tailwind sin conflictos
- `lucide-react` - Iconos para los componentes

## ⚙️ Configuración Realizada

### 1. Path Aliases
- Configurado `@/*` para apuntar a `./src/*`
- Configurado en `vite.config.ts` y `tsconfig.app.json`

### 2. Archivo `components.json`
- Creado en la raíz del proyecto
- Configurado para usar el estilo "default" de shadcn/ui
- Aliases configurados:
  - `@/shared/components` para componentes
  - `@/lib/utils` para utilidades
  - `@/shared/hooks` para hooks

### 3. CSS Variables
- Configuradas en `src/index.css` con el tema por defecto de shadcn/ui
- Variables CSS para colores, bordes, radios, etc.
- Compatible con Tailwind CSS v4

### 4. Utilidad `cn()`
- Creado `src/lib/utils.ts` con la función `cn()`
- Combina `clsx` y `tailwind-merge` para manejar clases de manera inteligente

## 🚀 Cómo Usar shadcn/ui

### Instalar un Componente

Para agregar componentes de shadcn/ui, usa el CLI:

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
```

O instala varios a la vez:

```bash
npx shadcn@latest add button input card dialog
```

### Usar un Componente

```tsx
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"

function MyComponent() {
  return (
    <div>
      <Input placeholder="Email" />
      <Button>Enviar</Button>
    </div>
  )
}
```

### Usar la función `cn()`

```tsx
import { cn } from "@/lib/utils"

function MyComponent({ className }: { className?: string }) {
  return (
    <div className={cn("base-classes", className, {
      "conditional-class": someCondition
    })}>
      Contenido
    </div>
  )
}
```

## 📁 Estructura de Archivos

```
social-media-frontend/
├── components.json          # Configuración de shadcn/ui
├── src/
│   ├── lib/
│   │   └── utils.ts        # Función cn() helper
│   ├── shared/
│   │   └── components/
│   │       └── ui/         # Componentes de shadcn/ui (se crean aquí)
│   └── index.css          # Variables CSS de shadcn/ui
```

## 🎨 Personalización

### Cambiar el Tema

Puedes personalizar los colores editando las variables CSS en `src/index.css`:

```css
@theme {
  --color-primary: 222.2 47.4% 11.2%;
  --color-primary-foreground: 210 40% 98%;
  /* ... más variables */
}
```

### Cambiar el Color Base

Edita `components.json`:

```json
{
  "tailwind": {
    "baseColor": "slate"  // Cambia a: zinc, stone, gray, neutral, red, rose, orange, etc.
  }
}
```

## 📚 Recursos

- [Documentación de shadcn/ui](https://ui.shadcn.com)
- [Componentes disponibles](https://ui.shadcn.com/docs/components)
- [Temas y personalización](https://ui.shadcn.com/docs/theming)

## 🔄 Próximos Pasos

1. Instala los componentes que necesites:
   ```bash
   npx shadcn@latest add button input card
   ```

2. Reemplaza o mejora tus componentes existentes con los de shadcn/ui

3. Personaliza el tema según tu marca

4. Explora más componentes en la [documentación oficial](https://ui.shadcn.com)

