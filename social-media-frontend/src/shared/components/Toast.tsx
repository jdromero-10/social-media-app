import { X, CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';
import type { ToastType } from '../store/toastStore';

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onClose: (id: string) => void;
}

/**
 * Componente Toast para mostrar notificaciones
 * Diseño profesional con bordes redondeados, sombras suaves
 * Se muestra arriba a la derecha y se oculta automáticamente
 */
export const Toast = ({ id, message, type, onClose }: ToastProps) => {
  const styles = {
    SUCCESS: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: 'text-green-600',
      IconComponent: CheckCircle,
    },
    ERROR: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: 'text-red-600',
      IconComponent: XCircle,
    },
    INFO: {
      container: 'bg-[#eafffd] border-[#9efff9] text-[#0d6f7d]',
      icon: 'text-[#00b1c0]',
      IconComponent: Info,
    },
    WARNING: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: 'text-yellow-600',
      IconComponent: AlertTriangle,
    },
  };

  const style = styles[type];
  const IconComponent = style.IconComponent;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg min-w-[300px] max-w-md transition-all duration-300 ease-in-out ${style.container}`}
      role="alert"
      aria-live="polite"
    >
      <IconComponent className={`h-5 w-5 flex-shrink-0 ${style.icon}`} />
      <p className="text-sm font-medium flex-1 leading-relaxed">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded"
        aria-label="Cerrar notificación"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

