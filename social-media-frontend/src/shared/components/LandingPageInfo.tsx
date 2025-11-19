import { Users, Image, MessageCircle, Bell } from 'lucide-react';
import { Card } from './Card';

/**
 * Características principales de la red social
 */
const features = [
  {
    icon: Image,
    title: 'Publicaciones con fotos',
    description: 'Comparte tus momentos favoritos con imágenes de alta calidad',
  },
  {
    icon: MessageCircle,
    title: 'Comentarios en tiempo real',
    description: 'Interactúa con tu comunidad mediante comentarios instantáneos',
  },
  {
    icon: Bell,
    title: 'Notificaciones',
    description: 'Mantente al día con todas las actualizaciones importantes',
  },
  {
    icon: Users,
    title: 'Conecta con amigos',
    description: 'Encuentra y conecta con personas que comparten tus intereses',
  },
];

/**
 * Componente de información de landing para páginas de autenticación
 * Muestra la misión, propósito y características principales de la red social
 */
export const LandingPageInfo = () => {
  return (
    <div className="hidden lg:flex lg:flex-col lg:justify-center lg:px-8 xl:px-12 bg-gradient-to-br from-[#00b1c0] via-[#038c9b] to-[#0d6f7d] text-white relative overflow-hidden">
      {/* Patrón de fondo decorativo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-lg mx-auto lg:mx-0">
        {/* Logo/Icono principal */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm mb-6 shadow-xl">
            <Users className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Título principal */}
        <h1 className="text-5xl font-bold mb-4 leading-tight">
          Conecta y comparte tu arte
        </h1>

        {/* Descripción */}
        <p className="text-xl text-[#eafffd] mb-10 leading-relaxed">
          Únete a nuestra comunidad creativa donde puedes compartir tus momentos,
          conectar con artistas y descubrir contenido inspirador.
        </p>

        {/* Lista de características */}
        <div className="space-y-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                  <p className="text-[#eafffd] text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

