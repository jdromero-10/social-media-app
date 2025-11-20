import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ValidateFieldDto } from './dto/validate-field.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { FieldValidationPipe } from './pipes/field-validation.pipe';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    const result = await this.authService.register(registerDto);

    // Establecer cookie HTTP-only con el token
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600000, // 1 hora en milisegundos
    });

    // Devolver respuesta sin el token
    return res.json({
      user: result.user,
    });
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const result = await this.authService.login(loginDto);

    // Establecer cookie HTTP-only con el token
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600000, // 1 hora en milisegundos
    });

    // Devolver respuesta sin el token
    return res.json({
      user: result.user,
    });
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return res.json({ message: 'Logout exitoso' });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@Request() req: { user: User }) {
    // req.user contiene el usuario validado por JwtStrategy
    const user = req.user;
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      imageUrl: user.imageUrl,
      bio: user.bio,
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString(),
    };
  }

  @Post('validate')
  @UsePipes(FieldValidationPipe)
  async validateField(@Body() validateFieldDto: ValidateFieldDto) {
    const result = await this.authService.validateFieldUniqueness(
      validateFieldDto.field,
      validateFieldDto.value,
    );

    // Siempre retornamos 200 OK, ya que la petición es válida
    // El resultado indica si el campo es único o no
    return result;
  }

  /**
   * POST /auth/forgot-password
   * Solicita un código de recuperación de contraseña
   * @param forgotPasswordDto - Email del usuario
   * @returns Mensaje genérico de éxito (por seguridad)
   */
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  /**
   * POST /auth/verify-code
   * Verifica un código de recuperación de contraseña
   * @param verifyCodeDto - Email y código de 6 dígitos
   * @returns Indicador de éxito si el código es válido
   */
  @Post('verify-code')
  async verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
    return await this.authService.verifyCode(verifyCodeDto);
  }

  /**
   * POST /auth/reset-password
   * Restablece la contraseña del usuario
   * @param resetPasswordDto - Email, código, nueva contraseña y confirmación
   * @returns Mensaje de éxito
   */
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }
}
