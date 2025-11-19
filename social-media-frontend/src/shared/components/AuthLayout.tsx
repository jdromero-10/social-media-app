import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { LandingPageInfo } from './LandingPageInfo';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  linkText: string;
  linkTo: string;
  icon: ReactNode;
  showLandingInfo?: boolean;
}

/**
 * Layout compartido para páginas de autenticación (Login y Register)
 * Implementa diseño de pantalla dividida en desktop y diseño apilado en móvil
 */
export const AuthLayout = ({
  children,
  title,
  description,
  linkText,
  linkTo,
  icon,
  showLandingInfo = true,
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#eafffd]/30 to-[#cbfffb]/30">
      <div className="min-h-screen lg:grid lg:grid-cols-2">
        {/* Sección de información (solo desktop) */}
        {showLandingInfo && (
          <>
            <LandingPageInfo />
          </>
        )}

        {/* Sección del formulario */}
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            {/* Header del formulario */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#00b1c0] mb-4 shadow-lg">
                {icon}
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">{title}</h2>
              <p className="text-gray-600 mb-6">{description}</p>
              <p className="text-sm text-gray-500">
                {linkText}{' '}
                <Link
                  to={linkTo}
                  className="font-semibold text-[#00b1c0] hover:text-[#038c9b] transition-colors"
                >
                  {linkTo === '/register' ? 'Regístrate aquí' : 'Inicia sesión aquí'}
                </Link>
              </p>
            </div>

            {/* Contenido del formulario */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

