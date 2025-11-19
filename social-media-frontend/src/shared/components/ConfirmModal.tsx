import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
  closeOnOverlayClick?: boolean;
}

/**
 * Componente Modal de Confirmación reutilizable
 * Útil para confirmar acciones destructivas o importantes
 */
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmar acción',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  isLoading = false,
  closeOnOverlayClick = false,
}: ConfirmModalProps) => {
  const handleConfirm = async () => {
    await onConfirm();
  };

  const variantStyles = {
    danger: {
      icon: 'text-red-600',
      button: 'danger' as const,
    },
    warning: {
      icon: 'text-yellow-600',
      button: 'secondary' as const,
    },
    info: {
      icon: 'text-[#00b1c0]',
      button: 'primary' as const,
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
      closeOnOverlayClick={closeOnOverlayClick}
      closeOnEscape={!isLoading}
      footer={
        <div className="flex items-center justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={currentVariant.button}
            onClick={handleConfirm}
            isLoading={isLoading}
            disabled={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 ${currentVariant.icon}`}>
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <p className="text-gray-700 leading-relaxed">{message}</p>
        </div>
      </div>
    </Modal>
  );
};

