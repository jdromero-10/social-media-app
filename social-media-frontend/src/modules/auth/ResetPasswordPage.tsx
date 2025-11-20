import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Card } from '../../shared/components/Card';
import { Input } from '../../shared/components/Input';
import { PasswordInput } from '../../shared/components/PasswordInput';
import { Button } from '../../shared/components/Button';
import { Form } from '../../shared/components/Form';
import { AuthLayout } from '../../shared/components/AuthLayout';
import { ToastContainer } from '../../shared/components/ToastContainer';
import { useToast } from '../../shared/hooks/useToast';
import { apiClient } from '../../api/apiClient';
import { Lock } from 'lucide-react';

interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

const resetPasswordSchema = yup.object({
  newPassword: yup
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Las contraseñas no coinciden')
    .required('La confirmación de contraseña es requerida'),
});

/**
 * Página para restablecer la contraseña
 */
export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toasts, removeToast, showSuccess, showError } = useToast();
  const [email, setEmail] = useState<string>(
    (location.state as any)?.email || '',
  );
  const [code, setCode] = useState<string>((location.state as any)?.code || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Si no hay email o código, redirigir a forgot-password
  useEffect(() => {
    if (!email || !code) {
      navigate('/forgot-password', { replace: true });
    }
  }, [email, code, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsSubmitting(true);

    try {
      await apiClient.post<{ message: string }>('/auth/reset-password', {
        email,
        code,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      // Mostrar notificación de éxito
      showSuccess('Contraseña restablecida exitosamente. Redirigiendo...');

      // Navegar a login después de un breve delay
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    } catch (error: any) {
      const errorMessage =
        error.message || 'Error al restablecer la contraseña. Intenta de nuevo.';
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <AuthLayout
        title="Nueva Contraseña"
        description="Ingresa tu nueva contraseña"
        linkText="¿Recordaste tu contraseña?"
        linkTo="/login"
        icon={<Lock className="w-8 h-8 text-white" />}
      >
        <Card className="shadow-xl border-0">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email"
              type="email"
              value={email}
              disabled
              className="bg-gray-50"
            />

            <PasswordInput
              label="Nueva contraseña"
              placeholder="••••••••"
              {...register('newPassword')}
              error={errors.newPassword?.message}
              helperText="Mínimo 6 caracteres"
            />

            <PasswordInput
              label="Confirmar contraseña"
              placeholder="••••••••"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isSubmitting}
            >
              {isSubmitting ? 'Restableciendo...' : 'Restablecer contraseña'}
            </Button>
          </Form>
        </Card>
      </AuthLayout>
    </>
  );
};

