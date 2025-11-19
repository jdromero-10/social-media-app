import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<User>;
    getAll(): Promise<User[]>;
    getById(id: string): Promise<User | null>;
    update(id: string, updateUserDto: UpdateUserDto, req: {
        user: User;
    }): Promise<User>;
    deleteByEmail(body: {
        email: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
