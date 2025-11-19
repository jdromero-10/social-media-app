import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * GET /posts
   * Obtiene todos los posts con paginación opcional
   * @param page - Número de página (opcional)
   * @param limit - Límite de posts por página (opcional)
   */
  @Get()
  async getAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNumber = page ? parseInt(page, 10) : undefined;
    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    return await this.postsService.getAll(pageNumber, limitNumber);
  }

  /**
   * GET /posts/user/:userId
   * Obtiene todos los posts de un usuario específico
   * IMPORTANTE: Esta ruta debe estar antes de /posts/:id para evitar conflictos
   * @param userId - UUID del usuario
   * @param page - Número de página (opcional)
   * @param limit - Límite de posts por página (opcional)
   */
  @Get('user/:userId')
  async getByUserId(
    @Param('userId') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : undefined;
    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    return await this.postsService.getByUserId(userId, pageNumber, limitNumber);
  }

  /**
   * GET /posts/:id
   * Obtiene un post por su ID
   * @param id - UUID del post
   */
  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.postsService.getById(id);
  }

  /**
   * POST /posts
   * Crea un nuevo post (requiere autenticación)
   * Acepta tanto JSON como form-data
   * @param createPostDto - Datos del post a crear
   * @param req - Request con usuario autenticado
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Body() createPostDto: CreatePostDto,
    @Request() req: { user: User },
  ) {
    return await this.postsService.create(createPostDto, req.user);
  }

  /**
   * PUT /posts/:id
   * Actualiza un post existente (requiere autenticación y ser el autor)
   * @param id - UUID del post a actualizar
   * @param updatePostDto - Datos a actualizar
   * @param req - Request con usuario autenticado
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req: { user: User },
  ) {
    return await this.postsService.update(id, updatePostDto, req.user);
  }

  /**
   * DELETE /posts/:id
   * Elimina un post (requiere autenticación y ser el autor)
   * @param id - UUID del post a eliminar
   * @param req - Request con usuario autenticado
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string, @Request() req: { user: User }) {
    await this.postsService.delete(id, req.user);
    return { message: 'Post eliminado exitosamente' };
  }
}
