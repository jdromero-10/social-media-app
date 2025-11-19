import { Card } from '../../shared/components/Card';
import { Bell } from 'lucide-react';

/**
 * Página de notificaciones
 */
export const NotificationsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Notificaciones
        </h1>
        <p className="text-gray-600">Mantente al día con tu actividad</p>
      </div>

      {/* Lista de Notificaciones */}
      <div className="space-y-4">
        <Card>
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#eafffd] flex items-center justify-center">
                <Bell className="h-5 w-5 text-[#00b1c0]" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-gray-600">
                Las notificaciones aparecerán aquí...
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

