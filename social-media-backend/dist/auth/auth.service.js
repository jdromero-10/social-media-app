"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const users_service_1 = require("../users/users.service");
const email_service_1 = require("../email/email.service");
const password_reset_code_entity_1 = require("./entities/password-reset-code.entity");
let AuthService = class AuthService {
    usersService;
    jwtService;
    emailService;
    passwordResetCodeRepository;
    constructor(usersService, jwtService, emailService, passwordResetCodeRepository) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.passwordResetCodeRepository = passwordResetCodeRepository;
    }
    async register(registerDto) {
        console.log('=== INICIO REGISTRO ===');
        console.log('Email:', registerDto.email);
        console.log('Password (longitud):', registerDto.password?.length || 0);
        const existingUser = await this.usersService.getByEmail(registerDto.email);
        if (existingUser) {
            console.log('❌ Email ya existe:', registerDto.email);
            throw new common_1.ConflictException('El correo electrónico ya está en uso');
        }
        console.log('Hasheando contraseña...');
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        console.log('Hash generado (longitud):', hashedPassword.length);
        console.log('Hash generado (prefijo):', hashedPassword.substring(0, 20) + '...');
        const user = await this.usersService.create({
            ...registerDto,
            password: hashedPassword,
        });
        console.log('✅ Usuario creado:', { id: user.id, email: user.email });
        console.log('=== FIN REGISTRO ===');
        return await this.buildAuthResponse(user.id, user.email);
    }
    async login(loginDto) {
        console.log('=== INICIO LOGIN ===');
        console.log('Email recibido:', loginDto.email);
        console.log('Password recibido (longitud):', loginDto.password?.length || 0);
        const user = await this.usersService.getByEmail(loginDto.email);
        if (!user) {
            console.log('❌ Usuario no encontrado con email:', loginDto.email);
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        console.log('✅ Usuario encontrado:', {
            id: user.id,
            email: user.email,
            passwordHashLength: user.password?.length || 0,
            passwordHashPrefix: user.password?.substring(0, 10) || 'N/A',
        });
        console.log('Comparando contraseña...');
        if (!user.password) {
            console.log('❌ ERROR: Usuario no tiene contraseña hasheada');
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const isValidPassword = await bcrypt.compare(loginDto.password, user.password);
        console.log('Resultado de comparación de contraseña:', isValidPassword);
        console.log('Password recibido:', loginDto.password);
        console.log('Password hash en BD:', user.password.substring(0, 20) + '...');
        if (!isValidPassword) {
            console.log('❌ Contraseña inválida para usuario:', user.email);
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        console.log('✅ Login exitoso para usuario:', user.email);
        console.log('=== FIN LOGIN ===');
        return await this.buildAuthResponse(user.id, user.email);
    }
    async validateFieldUniqueness(field, value) {
        const isUnique = await this.usersService.checkFieldUniqueness(field, value.trim());
        if (isUnique) {
            return { isUnique: true };
        }
        const fieldName = field === 'email' ? 'correo electrónico' : 'nombre de usuario';
        return {
            isUnique: false,
            message: `El ${fieldName} ya está en uso.`,
        };
    }
    async forgotPassword(forgotPasswordDto) {
        const user = await this.usersService.getByEmail(forgotPasswordDto.email);
        if (!user) {
            return {
                message: 'Si el email existe, recibirás un código de recuperación en breve.',
            };
        }
        const code = this.generateResetCode();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);
        const resetCode = this.passwordResetCodeRepository.create({
            userId: user.id,
            code,
            expiresAt,
            used: false,
        });
        await this.passwordResetCodeRepository.save(resetCode);
        await this.emailService.sendPasswordResetCode(user.email, code);
        return {
            message: 'Si el email existe, recibirás un código de recuperación en breve.',
        };
    }
    async verifyCode(verifyCodeDto) {
        const user = await this.usersService.getByEmail(verifyCodeDto.email);
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
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
            throw new common_1.BadRequestException('Código inválido');
        }
        if (new Date() > resetCode.expiresAt) {
            throw new common_1.BadRequestException('El código ha expirado');
        }
        return {
            valid: true,
            message: 'Código verificado correctamente',
        };
    }
    async resetPassword(resetPasswordDto) {
        if (resetPasswordDto.newPassword !== resetPasswordDto.confirmPassword) {
            throw new common_1.BadRequestException('Las contraseñas no coinciden');
        }
        const user = await this.usersService.getByEmail(resetPasswordDto.email);
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
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
            throw new common_1.BadRequestException('Código inválido');
        }
        if (new Date() > resetCode.expiresAt) {
            throw new common_1.BadRequestException('El código ha expirado');
        }
        const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);
        await this.usersService.updatePassword(user.id, hashedPassword);
        resetCode.used = true;
        await this.passwordResetCodeRepository.save(resetCode);
        return {
            message: 'Contraseña restablecida exitosamente',
        };
    }
    generateResetCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async buildAuthResponse(userId, email) {
        const payload = { sub: userId, email };
        const accessToken = this.jwtService.sign(payload);
        const user = await this.usersService.getById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        }
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_1.InjectRepository)(password_reset_code_entity_1.PasswordResetCode)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        email_service_1.EmailService,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map