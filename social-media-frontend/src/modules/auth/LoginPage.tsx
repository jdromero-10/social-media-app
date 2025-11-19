import { LoginForm } from './LoginForm';
import { Card } from '../../shared/components/Card';
import { AuthLayout } from '../../shared/components/AuthLayout';
import { ToastContainer } from '../../shared/components/ToastContainer';
import { useToast } from '../../shared/hooks/useToast';
import { User } from 'lucide-react';

/**
 * Página de login
 */
export const LoginPage = () => {
  const { toasts, removeToast, showError } = useToast();

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <AuthLayout
        title="Bienvenido de nuevo"
        description="Inicia sesión en tu cuenta para continuar"
        linkText="¿No tienes una cuenta?"
        linkTo="/register"
        icon={<User className="w-8 h-8 text-white" />}
      >
        <Card className="shadow-xl border-0">
          <LoginForm onError={showError} />
        </Card>
      </AuthLayout>
    </>
  );
};
