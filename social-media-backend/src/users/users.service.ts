import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async getAll(): Promise<User[]> {
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

  async getById(id: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async getByEmail(email: string): Promise<User | null> {
    // Búsqueda case-insensitive usando query builder
    return await this.usersRepository
      .createQueryBuilder('user')
      .where('LOWER(user.email) = LOWER(:email)', { email: email.trim() })
      .getOne();
  }

  async getByUsername(username: string): Promise<User | null> {
    // Búsqueda case-insensitive usando query builder
    return await this.usersRepository
      .createQueryBuilder('user')
      .where('LOWER(user.username) = LOWER(:username)', {
        username: username.trim(),
      })
      .getOne();
  }

  /**
   * Verifica si un campo (email o username) es único en la base de datos
   * @param field - El campo a validar ('email' o 'username')
   * @param value - El valor a verificar
   * @returns true si el valor es único, false si ya existe
   */
  async checkFieldUniqueness(
    field: 'email' | 'username',
    value: string,
  ): Promise<boolean> {
    let existingUser: User | null = null;

    if (field === 'email') {
      existingUser = await this.getByEmail(value);
    } else if (field === 'username') {
      existingUser = await this.getByUsername(value);
    }

    return existingUser === null;
  }

  async deleteByEmail(email: string): Promise<boolean> {
    // Buscar usuario con búsqueda case-insensitive
    const user = await this.getByEmail(email);

    if (!user) {
      console.log('Usuario no encontrado con email:', email);
      return false;
    }

    // Eliminar por ID (más seguro)
    const result = await this.usersRepository.delete({ id: user.id });
    return (result.affected ?? 0) > 0;
  }

  /**
   * Actualiza un usuario existente
   * @param id - UUID del usuario a actualizar
   * @param updateUserDto - Datos a actualizar
   * @param currentUser - Usuario autenticado que realiza la actualización
   * @returns Usuario actualizado
   * @throws NotFoundException si el usuario no existe
   * @throws ForbiddenException si el usuario intenta actualizar otro usuario
   * @throws ConflictException si el email o username ya están en uso
   */
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    currentUser: User,
  ): Promise<User> {
    // Buscar el usuario a actualizar
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Verificar que el usuario solo pueda actualizar su propio perfil
    if (user.id !== currentUser.id) {
      throw new ForbiddenException(
        'No tienes permiso para actualizar este usuario',
      );
    }

    // Validar unicidad de email si se está actualizando
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.getByEmail(updateUserDto.email);
      if (existingUser && existingUser.id !== user.id) {
        throw new ConflictException('El email ya está en uso');
      }
    }

    // Validar unicidad de username si se está actualizando
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.getByUsername(updateUserDto.username);
      if (existingUser && existingUser.id !== user.id) {
        throw new ConflictException('El username ya está en uso');
      }
    }

    // Actualizar solo los campos proporcionados
    Object.assign(user, updateUserDto);

    // Guardar y retornar el usuario actualizado
    return await this.usersRepository.save(user);
  }
}
