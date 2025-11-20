import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PasswordResetCode } from './entities/password-reset-code.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    @InjectRepository(PasswordResetCode)
    private readonly passwordResetCodeRepository: Repository<PasswordResetCode>,
  ) {}

  // Registro de usuario
  async register(registerDto: RegisterDto) {
    console.log('=== INICIO REGISTRO ===');
    console.log('Email:', registerDto.email);
    console.log('Password (longitud):', registerDto.password?.length || 0);

    const existingUser = await this.usersService.getByEmail(registerDto.email);

    if (existingUser) {
      console.log('❌ Email ya existe:', registerDto.email);
      throw new ConflictException('El correo electrónico ya está en uso');
    }

    console.log('Hasheando contraseña...');
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    console.log('Hash generado (longitud):', hashedPassword.length);
    console.log(
      'Hash generado (prefijo):',
      hashedPassword.substring(0, 20) + '...',
    );

    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    console.log('✅ Usuario creado:', { id: user.id, email: user.email });
    console.log('=== FIN REGISTRO ===');
    return await this.buildAuthResponse(user.id, user.email);
  }

  // Login de usuario
  async login(loginDto: LoginDto) {
    console.log('=== INICIO LOGIN ===');
    console.log('Email recibido:', loginDto.email);
    console.log(
      'Password recibido (longitud):',
      loginDto.password?.length || 0,
    );

    const user = await this.usersService.getByEmail(loginDto.email);

    if (!user) {
      console.log('❌ Usuario no encontrado con email:', loginDto.email);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    console.log('✅ Usuario encontrado:', {
      id: user.id,
      email: user.email,
      passwordHashLength: user.password?.length || 0,
      passwordHashPrefix: user.password?.substring(0, 10) || 'N/A',
    });
    console.log('Comparando contraseña...');

    // Verificar que el hash existe
    if (!user.password) {
      console.log('❌ ERROR: Usuario no tiene contraseña hasheada');
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    console.log('Resultado de comparación de contraseña:', isValidPassword);
    console.log('Password recibido:', loginDto.password);
    console.log('Password hash en BD:', user.password.substring(0, 20) + '...');

    if (!isValidPassword) {
      console.log('❌ Contraseña inválida para usuario:', user.email);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    console.log('✅ Login exitoso para usuario:', user.email);
    console.log('=== FIN LOGIN ===');
    return await this.buildAuthResponse(user.id, user.email);
  }

  /**
   * Valida si un campo (email o username) es único en la base de datos
   * @param field - El campo a validar ('email' o 'username')
   * @param value - El valor a verificar
   * @returns Objeto con isUnique y mensaje opcional
   */
  async validateFieldUniqueness(
    field: 'email' | 'username',
    value: string,
  ): Promise<{ isUnique: boolean; message?: string }> {
    const isUnique = await this.usersService.checkFieldUniqueness(
      field,
      value.trim(),
    );

    if (isUnique) {
      return { isUnique: true };
    }

    const fieldName =
      field === 'email' ? 'correo electrónico' : 'nombre de usuario';
    return {
      isUnique: false,
      message: `El ${fieldName} ya está en uso.`,
    };
  }

  /**
   * Solicita un código de recuperación de contraseña
   * @param forgotPasswordDto - Email del usuario
   * @returns Mensaje genérico de éxito (por seguridad)
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
    message: string;
  }> {
    const user = await this.usersService.getByEmail(forgotPasswordDto.email);

    // Por seguridad, siempre retornamos el mismo mensaje
    // No revelamos si el email existe o no
    if (!user) {
      return {
        message:
          'Si el email existe, recibirás un código de recuperación en breve.',
      };
    }

    // Generar código de 6 dígitos
    const code = this.generateResetCode();

    // Calcular fecha de expiración (15 minutos)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // Guardar código en la base de datos
    const resetCode = this.passwordResetCodeRepository.create({
      userId: user.id,
      code,
      expiresAt,
      used: false,
    });
    await this.passwordResetCodeRepository.save(resetCode);

    // Enviar email con el código
    await this.emailService.sendPasswordResetCode(user.email, code);

    return {
      message:
        'Si el email existe, recibirás un código de recuperación en breve.',
    };
  }

  /**
   * Verifica un código de recuperación de contraseña
   * @param verifyCodeDto - Email y código
   * @returns Token temporal o indicador de éxito
   */
  async verifyCode(verifyCodeDto: VerifyCodeDto): Promise<{
    valid: boolean;
    message: string;
  }> {
    const user = await this.usersService.getByEmail(verifyCodeDto.email);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Buscar el código más reciente no usado
    const resetCode = await this.passwordResetCodeRepository.findOne({
      where: {
        userId: user.id,
        code: verifyCodeDto.code,
        used: false,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (!resetCode) {
      throw new BadRequestException('Código inválido');
    }

    // Verificar que no haya expirado
    if (new Date() > resetCode.expiresAt) {
      throw new BadRequestException('El código ha expirado');
    }

    return {
      valid: true,
      message: 'Código verificado correctamente',
    };
  }

  /**
   * Restablece la contraseña del usuario
   * @param resetPasswordDto - Email, código, nueva contraseña y confirmación
   * @returns Mensaje de éxito
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
    message: string;
  }> {
    // Validar que las contraseñas coincidan
    if (resetPasswordDto.newPassword !== resetPasswordDto.confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    const user = await this.usersService.getByEmail(resetPasswordDto.email);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Re-validar el código
    const resetCode = await this.passwordResetCodeRepository.findOne({
      where: {
        userId: user.id,
        code: resetPasswordDto.code,
        used: false,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (!resetCode) {
      throw new BadRequestException('Código inválido');
    }

    if (new Date() > resetCode.expiresAt) {
      throw new BadRequestException('El código ha expirado');
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);

    // Actualizar contraseña del usuario
    await this.usersService.updatePassword(user.id, hashedPassword);

    // Marcar código como usado
    resetCode.used = true;
    await this.passwordResetCodeRepository.save(resetCode);

    return {
      message: 'Contraseña restablecida exitosamente',
    };
  }

  /**
   * Genera un código aleatorio de 6 dígitos
   */
  private generateResetCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async buildAuthResponse(userId: string, email: string) {
    const payload = { sub: userId, email };
    const accessToken = this.jwtService.sign(payload);

    // Obtener los datos completos del usuario
    const user = await this.usersService.getById(userId);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Retornar en formato que espera el frontend
    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        createdAt: user.createdAt?.toISOString(),
        updatedAt: user.updatedAt?.toISOString(),
      },
    };
  }
}
