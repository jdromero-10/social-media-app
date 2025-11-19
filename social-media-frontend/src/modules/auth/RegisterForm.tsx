import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from './hooks/useAuth';
import { Form } from '../../shared/components/Form';
import { Input } from '../../shared/components/Input';
import { PasswordInput } from '../../shared/components/PasswordInput';
import { Button } from '../../shared/components/Button';
import { useToast } from '../../shared/hooks/useToast';
import { authApi } from '../../api/auth-api';
import type { RegisterDto } from './auth.types';

/**
 * Tipo para el formulario de registro (incluye confirmPassword)
 */
type RegisterFormData = RegisterDto & { confirmPassword: string };

/**
 * Función para validar unicidad de email
 */
const validateEmailUniqueness = async (email: string | undefined): Promise<boolean> => {
  if (!email || email.trim().length === 0) {
    return true; // Si está vacío, la validación de required se encargará
  }

  try {
    const result = await authApi.validateField('email', email);
    return result.isUnique;
  } catch (error) {
    // Si hay error de red, permitimos que continúe (se validará en el submit)
    console.error('Error validando email:', error);
    return true;
  }
};

/**
 * Función para validar unicidad de username
 */
const validateUsernameUniqueness = async (username: string | undefined): Promise<boolean> => {
  // Si está vacío o es muy corto, retornar true para dejar que otras validaciones manejen el error
  if (!username || username.trim().length < 3) {
    return true; // Dejar que .required() y .min() manejen estos casos
  }

  try {
    const result = await authApi.validateField('username', username.trim());
    return result.isUnique;
  } catch (error) {
    // Si hay error de red, permitimos que continúe (se validará en el submit)
    console.error('Error validando username:', error);
    return true;
  }
};

interface RegisterFormProps {
  onError?: (message: string) => void;
}

/**
 * Componente de formulario de registro
 */
export const RegisterForm = ({ onError }: RegisterFormProps = {}) => {
  const navigate = useNavigate();
  const { registerAsync, isRegistering, registerError } = useAuth();
  const { showError: showErrorLocal } = useToast();
  
  // Usar la función pasada como prop o la local
  const showError = onError || showErrorLocal;

  // Esquema de validación con validación asíncrona de unicidad
  const registerSchema = useMemo(
    () =>
      yup.object({
        name: yup
          .string()
          .min(2, 'El nombre debe tener al menos 2 caracteres')
          .required('El nombre es requerido'),
        email: yup
          .string()
          .email('El email debe ser válido')
          .required('El email es requerido')
          .test(
            'unique-email',
            'El correo electrónico ya está en uso',
            async (value) => {
              return await validateEmailUniqueness(value);
            },
          ),
        password: yup
          .string()
          .min(6, 'La contraseña debe tener al menos 6 caracteres')
          .required('La contraseña es requerida'),
        confirmPassword: yup
          .string()
          .oneOf([yup.ref('password')], 'Las contraseñas deben coincidir')
          .required('Confirma tu contraseña'),
        username: yup
          .string()
          .required('El username es requerido')
          .min(3, 'El username debe tener al menos 3 caracteres')
          .test(
            'unique-username',
            'El nombre de usuario ya está en uso',
            async function (value) {
              // La función validateUsernameUniqueness ya maneja la verificación de longitud
              return await validateUsernameUniqueness(value);
            },
          ),
      }) as yup.ObjectSchema<RegisterFormData>,
    [],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger, // Para validar campos manualmente
    watch, // Para observar cambios en los campos
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    mode: 'onChange', // Validar mientras se escribe para mejor feedback en tiempo real
    reValidateMode: 'onChange', // Revalidar mientras se escribe
  });

  // Observar cambios en email y username para validar en tiempo real
  const emailValue = watch('email');
  const usernameValue = watch('username');
  
  // Validar email cuando cambia (con debounce para evitar demasiadas peticiones)
  useEffect(() => {
    if (emailValue && emailValue.trim().length > 0 && emailValue.includes('@')) {
      const timeoutId = setTimeout(() => {
        trigger('email');
      }, 500); // Esperar 500ms después de que el usuario deje de escribir
      
      return () => clearTimeout(timeoutId);
    }
  }, [emailValue, trigger]);
  
  // Validar username cuando cambia (con debounce para evitar demasiadas peticiones)
  useEffect(() => {
    // Validar solo si tiene al menos 3 caracteres (mínimo requerido)
    if (usernameValue && usernameValue.trim().length >= 3) {
      const timeoutId = setTimeout(() => {
        // Forzar validación del campo username
        // Usar trigger sin await para no bloquear, pero asegurar que se ejecute
        trigger('username', { shouldFocus: false }).catch((error) => {
          console.error('Error al validar username:', error);
        });
      }, 500); // Esperar 500ms después de que el usuario deje de escribir
      
      return () => clearTimeout(timeoutId);
    } else if (usernameValue && usernameValue.trim().length > 0 && usernameValue.trim().length < 3) {
      // Si tiene menos de 3 caracteres, también validar para mostrar el error de min
      const timeoutId = setTimeout(() => {
        trigger('username', { shouldFocus: false });
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [usernameValue, trigger]);

  // Mostrar error en toast cuando hay un error de registro
  useEffect(() => {
    if (registerError) {
      let errorMessage = registerError.message || 'Error al registrar usuario';
      
      if (registerError.statusCode === 0) {
        errorMessage += '. Verifica que el servidor esté en ejecución y tu conexión a internet.';
      }
      
      showError(errorMessage);
    }
  }, [registerError, showError]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Remover confirmPassword antes de enviar (no va al backend)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = data;
      await registerAsync(registerData);
      // Redirigir después de registro exitoso
      navigate('/home', { replace: true });
    } catch {
      // El error ya se maneja en el useEffect de registerError
      // No necesitamos hacer nada aquí
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>

      <Input
        label="Nombre completo"
        type="text"
        placeholder="Juan Pérez"
        {...register('name')}
        error={errors.name?.message}
      />

      <Input
        label="Email"
        type="email"
        placeholder="tu@email.com"
        {...register('email')}
        error={errors.email?.message}
      />

      <Input
        label="Username"
        type="text"
        placeholder="juanperez"
        {...register('username', {
          onBlur: async () => {
            // Validar cuando el usuario sale del campo
            const usernameValue = watch('username');
            if (usernameValue && usernameValue.trim().length >= 3) {
              await trigger('username', { shouldFocus: false });
            }
          },
        })}
        error={errors.username?.message}
        helperText="Mínimo 3 caracteres. Debe ser único."
      />

      <PasswordInput
        label="Contraseña"
        placeholder="••••••••"
        {...register('password')}
        error={errors.password?.message}
      />

      <PasswordInput
        label="Confirmar contraseña"
        placeholder="••••••••"
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />

      <Button type="submit" variant="primary" fullWidth isLoading={isRegistering}>
        {isRegistering ? 'Registrando...' : 'Registrarse'}
      </Button>
    </Form>
  );
};
