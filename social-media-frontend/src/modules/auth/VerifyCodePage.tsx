import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../../shared/components/Card';
import { Input } from '../../shared/components/Input';
import { CodeInput } from '../../shared/components/CodeInput';
import { Button } from '../../shared/components/Button';
import { Form } from '../../shared/components/Form';
import { AuthLayout } from '../../shared/components/AuthLayout';
import { ToastContainer } from '../../shared/components/ToastContainer';
import { useToast } from '../../shared/hooks/useToast';
import { apiClient } from '../../api/apiClient';
import { KeyRound } from 'lucide-react';

/**
 * Página para verificar el código de recuperación de contraseña
 */
export const VerifyCodePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toasts, removeToast, showError } = useToast();
  const [email, setEmail] = useState<string>(
    (location.state as any)?.email || '',
  );
  const [code, setCode] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Si no hay email, redirigir a forgot-password
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password', { replace: true });
    }
  }, [email, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (code.length !== 6) {
      showError('Por favor, ingresa el código completo de 6 dígitos');
      return;
    }

    setIsSubmitting(true);

    try {
      await apiClient.post<{ valid: boolean; message: string }>(
        '/auth/verify-code',
        {
          email,
          code,
        },
      );

      // Navegar a la página de restablecimiento de contraseña
      navigate('/reset-password', {
        state: { email, code },
      });
    } catch (error: any) {
      const errorMessage =
        error.message || 'Código inválido. Por favor, verifica e intenta de nuevo.';
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <AuthLayout
        title="Verificar Código"
        description="Ingresa el código de 6 dígitos que enviamos a tu email"
        linkText="¿No recibiste el código?"
        linkTo="/forgot-password"
        icon={<KeyRound className="w-8 h-8 text-white" />}
      >
        <Card className="shadow-xl border-0">
          <Form onSubmit={onSubmit}>
            <Input
              label="Email"
              type="email"
              value={email}
              disabled
              className="bg-gray-50"
            />

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Código de verificación
              </label>
              <CodeInput
                length={6}
                value={code}
                onChange={setCode}
                autoFocus
                disabled={isSubmitting}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isSubmitting}
              disabled={code.length !== 6}
            >
              {isSubmitting ? 'Verificando...' : 'Verificar código'}
            </Button>
          </Form>
        </Card>
      </AuthLayout>
    </>
  );
};

