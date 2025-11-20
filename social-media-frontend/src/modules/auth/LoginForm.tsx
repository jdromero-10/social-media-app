import { useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from './hooks/useAuth';
import { Form } from '../../shared/components/Form';
import { Input } from '../../shared/components/Input';
import { PasswordInput } from '../../shared/components/PasswordInput';
import { Button } from '../../shared/components/Button';
import { useToast } from '../../shared/hooks/useToast';
import type { LoginDto } from './auth.types';

/**
 * Esquema de validación para el formulario de login
 */
const loginSchema = yup.object({
  email: yup
    .string()
    .email('El email debe ser válido')
    .required('El email es requerido'),
  password: yup
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida'),
});

interface LoginFormProps {
  onError?: (message: string) => void;
}

/**
 * Componente de formulario de login
 */
export const LoginForm = ({ onError }: LoginFormProps = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAsync, isLoggingIn, loginError } = useAuth();
  const { showError: showErrorLocal } = useToast();
  
  // Usar useRef para mantener una referencia estable a la función de error
  const showErrorRef = useRef(onError || showErrorLocal);
  
  // Actualizar la referencia cuando cambie
  useEffect(() => {
    showErrorRef.current = onError || showErrorLocal;
  }, [onError, showErrorLocal]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({
    resolver: yupResolver(loginSchema),
  });

  // Mostrar error en toast cuando hay un error de login
  useEffect(() => {
    if (loginError) {
      let errorMessage = loginError.message || 'Error al iniciar sesión';
      
      if (loginError.statusCode === 0) {
        errorMessage += '. Verifica que el servidor esté en ejecución y tu conexión a internet.';
      }
      
      // Usar la referencia estable para evitar bucles infinitos
      showErrorRef.current(errorMessage);
    }
  }, [loginError]); // Solo depender de loginError, no de showError

  const onSubmit = async (data: LoginDto) => {
    try {
      await loginAsync(data);
      // Redirigir después de login exitoso
      // Las queries se invalidan automáticamente en onSuccess del hook useAuth
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/home';
      navigate(from, { replace: true });
    } catch {
      // El error ya se maneja en el useEffect de loginError
      // No necesitamos hacer nada aquí
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Email"
        type="email"
        placeholder="tu@email.com"
        {...register('email')}
        error={errors.email?.message}
      />

      <PasswordInput
        label="Contraseña"
        placeholder="••••••••"
        {...register('password')}
        error={errors.password?.message}
      />

      <div className="text-right">
        <Link
          to="/forgot-password"
          className="text-sm text-[#00b1c0] hover:text-[#038c9b] transition-colors font-medium"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <Button type="submit" variant="primary" fullWidth isLoading={isLoggingIn}>
        {isLoggingIn ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </Button>
    </Form>
  );
};
