import { User } from '../../users/entities/user.entity';
export declare class PasswordResetCode {
    id: string;
    user: User;
    userId: string;
    code: string;
    expiresAt: Date;
    used: boolean;
    createdAt: Date;
}
