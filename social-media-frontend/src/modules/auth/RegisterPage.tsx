import { RegisterForm } from './RegisterForm';
import { Card } from '../../shared/components/Card';
import { AuthLayout } from '../../shared/components/AuthLayout';
import { ToastContainer } from '../../shared/components/ToastContainer';
import { useToast } from '../../shared/hooks/useToast';
import { UserPlus } from 'lucide-react';

/**
 * Página de registro
 */
export const RegisterPage = () => {
  const { toasts, removeToast, showError } = useToast();

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <AuthLayout
        title="Crea tu cuenta"
        description="Únete a nuestra comunidad hoy mismo"
        linkText="¿Ya tienes una cuenta?"
        linkTo="/login"
        icon={<UserPlus className="w-8 h-8 text-white" />}
      >
        <Card className="shadow-xl border-0">
          <RegisterForm onError={showError} />
        </Card>
      </AuthLayout>
    </>
  );
};
