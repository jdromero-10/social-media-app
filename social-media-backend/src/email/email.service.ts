import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      this.logger.warn(
        'RESEND_API_KEY no está configurada. Los emails no se enviarán.',
      );
    }
    this.resend = new Resend(apiKey);
  }

  /**
   * Envía un código de recuperación de contraseña al usuario
   * @param email - Email del destinatario
   * @param code - Código de 6 dígitos
   * @returns Promise<boolean> - true si se envió correctamente
   */
  async sendPasswordResetCode(email: string, code: string): Promise<boolean> {
    try {
      const fromEmail =
        process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
      const appName = process.env.APP_NAME || 'Social Media App';

      const { error } = await this.resend.emails.send({
        from: fromEmail,
        to: [email],
        subject: `Código de recuperación de contraseña - ${appName}`,
        html: this.getPasswordResetEmailTemplate(code, appName),
      });

      if (error) {
        this.logger.error('Error al enviar email:', error);
        return false;
      }

      this.logger.log(`Email de recuperación enviado a ${email}`);
      return true;
    } catch (error) {
      this.logger.error('Excepción al enviar email:', error);
      return false;
    }
  }

  /**
   * Genera el template HTML del email de recuperación de contraseña
   */
  private getPasswordResetEmailTemplate(code: string, appName: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Código de Recuperación</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #00b1c0 0%, #038c9b 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">${appName}</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
            <h2 style="color: #00b1c0; margin-top: 0;">Recuperación de Contraseña</h2>
            
            <p>Hemos recibido una solicitud para restablecer tu contraseña. Utiliza el siguiente código para continuar:</p>
            
            <div style="background: white; border: 2px solid #00b1c0; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #00b1c0; font-family: 'Courier New', monospace;">
                ${code}
              </div>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              <strong>Este código expirará en 15 minutos.</strong>
            </p>
            
            <p style="color: #666; font-size: 14px;">
              Si no solicitaste este código, puedes ignorar este email de forma segura.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              Este es un email automático, por favor no respondas.
            </p>
          </div>
        </body>
      </html>
    `;
  }
}
