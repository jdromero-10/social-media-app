import { ToastContainer } from './ToastContainer';

/**
 * Provider global para el sistema de notificaciones Toast
 * Debe colocarse en el nivel más alto de la aplicación
 * Renderiza el ToastContainer que muestra todas las notificaciones activas
 */
export const ToastProvider = () => {
  return <ToastContainer />;
};

