import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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
