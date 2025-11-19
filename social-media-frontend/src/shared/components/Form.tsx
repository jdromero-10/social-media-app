import { FormHTMLAttributes, ReactNode } from 'react';

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
}

/**
 * Componente Form wrapper con estilos consistentes
 */
export const Form = ({
  children,
  onSubmit,
  className = '',
  ...props
}: FormProps) => {
  const baseStyles = 'space-y-5';

  const combinedClassName = `${baseStyles} ${className}`.trim();

  return (
    <form onSubmit={onSubmit} className={combinedClassName} {...props}>
      {children}
    </form>
  );
};

