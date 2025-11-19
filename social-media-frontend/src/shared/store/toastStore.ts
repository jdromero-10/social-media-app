import { create } from 'zustand';

export type ToastType = 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

interface ToastStore {
  toasts: Toast[];
  showToast: (message: string, type: ToastType, duration?: number) => string;
  hideToast: (id: string) => void;
  clearAll: () => void;
}

/**
 * Store global de Zustand para manejar notificaciones toast
 */
export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  /**
   * Muestra un nuevo toast
   * @param message - Mensaje a mostrar
   * @param type - Tipo de toast (SUCCESS, ERROR, INFO, WARNING)
   * @param duration - Duración en milisegundos (default: 4000)
   * @returns ID del toast creado
   */
  showToast: (message: string, type: ToastType, duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = {
      id,
      message,
      type,
      duration,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto-cierre después de la duración especificada
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        }));
      }, duration);
    }

    return id;
  },

  /**
   * Oculta un toast específico
   * @param id - ID del toast a ocultar
   */
  hideToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  /**
   * Limpia todos los toasts
   */
  clearAll: () => {
    set({ toasts: [] });
  },
}));

