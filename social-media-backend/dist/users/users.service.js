"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
let UsersService = class UsersService {
    usersRepository;
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async create(createUserDto) {
        const user = this.usersRepository.create(createUserDto);
        return this.usersRepository.save(user);
    }
    async getAll() {
        return await this.usersRepository.find({
            select: [
                'id',
                'email',
                'name',
                'username',
                'imageUrl',
                'bio',
                'authStrategy',
                'createdAt',
                'updatedAt',
            ],
        });
    }
    async getById(id) {
        return await this.usersRepository.findOne({ where: { id } });
    }
    async getByEmail(email) {
        return await this.usersRepository
            .createQueryBuilder('user')
            .where('LOWER(user.email) = LOWER(:email)', { email: email.trim() })
            .getOne();
    }
    async getByUsername(username) {
        return await this.usersRepository
            .createQueryBuilder('user')
            .where('LOWER(user.username) = LOWER(:username)', {
            username: username.trim(),
        })
            .getOne();
    }
    async checkFieldUniqueness(field, value) {
        let existingUser = null;
        if (field === 'email') {
            existingUser = await this.getByEmail(value);
        }
        else if (field === 'username') {
            existingUser = await this.getByUsername(value);
        }
        return existingUser === null;
    }
    async deleteByEmail(email) {
        const user = await this.getByEmail(email);
        if (!user) {
            console.log('Usuario no encontrado con email:', email);
            return false;
        }
        const result = await this.usersRepository.delete({ id: user.id });
        return (result.affected ?? 0) > 0;
    }
    async update(id, updateUserDto, currentUser) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        if (user.id !== currentUser.id) {
            throw new common_1.ForbiddenException('No tienes permiso para actualizar este usuario');
        }
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await this.getByEmail(updateUserDto.email);
            if (existingUser && existingUser.id !== user.id) {
                throw new common_1.ConflictException('El email ya está en uso');
            }
        }
        if (updateUserDto.username && updateUserDto.username !== user.username) {
            const existingUser = await this.getByUsername(updateUserDto.username);
            if (existingUser && existingUser.id !== user.id) {
                throw new common_1.ConflictException('El username ya está en uso');
            }
        }
        Object.assign(user, updateUserDto);
        return await this.usersRepository.save(user);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map