import { ReactNode } from 'react';

interface BarProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  position?: 'top' | 'bottom';
}

/**
 * Componente Bar (barra) reutilizable para navegación, notificaciones, etc.
 */
export const Bar = ({
  children,
  className = '',
  variant = 'default',
  position = 'top',
}: BarProps) => {
  const variantStyles = {
    default: 'bg-white border-b border-gray-200',
    primary: 'bg-[#00b1c0] text-white',
    success: 'bg-green-600 text-white',
    warning: 'bg-yellow-500 text-white',
    danger: 'bg-red-600 text-white',
  };

  const positionStyles = {
    top: 'top-0',
    bottom: 'bottom-0',
  };

  const baseStyles = `fixed left-0 right-0 z-40 ${positionStyles[position]} ${variantStyles[variant]}`;

  const combinedClassName = `${baseStyles} ${className}`.trim();

  return (
    <div className={combinedClassName} role="banner">
      <div className="container mx-auto px-4 py-3">{children}</div>
    </div>
  );
};

