import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PasswordResetCode } from './entities/password-reset-code.entity';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly emailService;
    private readonly passwordResetCodeRepository;
    constructor(usersService: UsersService, jwtService: JwtService, emailService: EmailService, passwordResetCodeRepository: Repository<PasswordResetCode>);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            username: string;
            createdAt: string;
            updatedAt: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            username: string;
            createdAt: string;
            updatedAt: string;
        };
    }>;
    validateFieldUniqueness(field: 'email' | 'username', value: string): Promise<{
        isUnique: boolean;
        message?: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    verifyCode(verifyCodeDto: VerifyCodeDto): Promise<{
        valid: boolean;
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    private generateResetCode;
    private buildAuthResponse;
}
