import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Card } from '../../shared/components/Card';
import { Input } from '../../shared/components/Input';
import { Button } from '../../shared/components/Button';
import { Form } from '../../shared/components/Form';
import { AuthLayout } from '../../shared/components/AuthLayout';
import { ToastContainer } from '../../shared/components/ToastContainer';
import { useToast } from '../../shared/hooks/useToast';
import { apiClient } from '../../api/apiClient';
import { Mail } from 'lucide-react';

interface ForgotPasswordFormData {
  email: string;
}

const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email('El email debe ser válido')
    .required('El email es requerido'),
});

/**
 * Página para solicitar recuperación de contraseña
 */
export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { toasts, removeToast, showInfo, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);

    try {
      await apiClient.post<{ message: string }>('/auth/forgot-password', {
        email: data.email,
      });

      // Mostrar notificación de éxito
      showInfo(
        'Si el email existe, recibirás un código de recuperación en breve.',
      );

      // Navegar a la página de verificación de código
      // Pasar el email en el estado para pre-llenarlo
      navigate('/verify-code', {
        state: { email: data.email },
      });
    } catch (error: any) {
      const errorMessage =
        error.message || 'Error al solicitar recuperación de contraseña';
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <AuthLayout
        title="Recuperar Contraseña"
        description="Ingresa tu email y te enviaremos un código de verificación"
        linkText="¿Recordaste tu contraseña?"
        linkTo="/login"
        icon={<Mail className="w-8 h-8 text-white" />}
      >
        <Card className="shadow-xl border-0">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              {...register('email')}
              error={errors.email?.message}
              autoFocus
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar código'}
            </Button>
          </Form>
        </Card>
      </AuthLayout>
    </>
  );
};

