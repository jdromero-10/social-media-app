import { Toast } from './Toast';
import { useToastStore } from '../store/toastStore';

/**
 * Contenedor global para mostrar múltiples toasts
 * Se posiciona fijamente en la esquina superior derecha de la pantalla
 * Lee el estado del store de Zustand automáticamente
 */
export const ToastContainer = () => {
  const toasts = useToastStore((state) => state.toasts);
  const hideToast = useToastStore((state) => state.hideToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        </div>
      ))}
    </div>
  );
};

