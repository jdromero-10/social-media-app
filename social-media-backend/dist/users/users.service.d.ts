import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    getAll(): Promise<User[]>;
    getById(id: string): Promise<User | null>;
    getByEmail(email: string): Promise<User | null>;
    getByUsername(username: string): Promise<User | null>;
    checkFieldUniqueness(field: 'email' | 'username', value: string): Promise<boolean>;
    deleteByEmail(email: string): Promise<boolean>;
    update(id: string, updateUserDto: UpdateUserDto, currentUser: User): Promise<User>;
    updatePassword(userId: string, hashedPassword: string): Promise<User>;
}
