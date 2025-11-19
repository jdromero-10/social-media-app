import { useToastStore } from '../store/toastStore';
import type { ToastType } from '../store/toastStore';

/**
 * Hook para manejar notificaciones toast
 * Usa el store global de Zustand para estado compartido
 */
export const useToast = () => {
  const showToast = useToastStore((state) => state.showToast);
  const hideToast = useToastStore((state) => state.hideToast);
  const clearAll = useToastStore((state) => state.clearAll);
  const toasts = useToastStore((state) => state.toasts);

  /**
   * Muestra un toast genérico
   * @param message - Mensaje a mostrar
   * @param type - Tipo de toast (SUCCESS, ERROR, INFO, WARNING)
   * @param duration - Duración en milisegundos (default: 4000)
   */
  const showToastWithType = (
    message: string,
    type: ToastType,
    duration?: number
  ) => {
    return showToast(message, type, duration);
  };

  /**
   * Muestra un toast de éxito
   */
  const showSuccess = (message: string, duration?: number) => {
    return showToast(message, 'SUCCESS', duration);
  };

  /**
   * Muestra un toast de error
   */
  const showError = (message: string, duration?: number) => {
    return showToast(message, 'ERROR', duration);
  };

  /**
   * Muestra un toast de información
   */
  const showInfo = (message: string, duration?: number) => {
    return showToast(message, 'INFO', duration);
  };

  /**
   * Muestra un toast de advertencia
   */
  const showWarning = (message: string, duration?: number) => {
    return showToast(message, 'WARNING', duration);
  };

  return {
    toasts,
    showToast: showToastWithType,
    hideToast,
    clearAll,
    showError,
    showSuccess,
    showInfo,
    showWarning,
  };
};

