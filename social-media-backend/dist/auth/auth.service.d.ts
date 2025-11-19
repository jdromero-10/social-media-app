import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
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
    private buildAuthResponse;
}
