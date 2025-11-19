import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  async getAll() {
    return await this.usersService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.usersService.getById(id);
  }

  /**
   * PUT /users/:id
   * Actualiza un usuario existente (requiere autenticación y ser el mismo usuario)
   * @param id - UUID del usuario a actualizar
   * @param updateUserDto - Datos a actualizar
   * @param req - Request con usuario autenticado
   * @returns Usuario actualizado
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: { user: User },
  ): Promise<User> {
    return await this.usersService.update(id, updateUserDto, req.user);
  }

  // Endpoint temporal para desarrollo: eliminar usuario por email
  @Post('delete-by-email')
  async deleteByEmail(@Body() body: { email: string }) {
    const deleted = await this.usersService.deleteByEmail(body.email);
    return {
      success: deleted,
      message: deleted
        ? 'Usuario eliminado correctamente'
        : 'Usuario no encontrado',
    };
  }
}
