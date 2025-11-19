import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post, PostType } from './entities/posts.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  /**
   * Obtiene todos los posts con paginación opcional
   * @param page - Número de página (opcional, default: 1)
   * @param limit - Límite de posts por página (opcional, default: 10)
   * @returns Array de posts con información del autor
   */
  async getAll(page?: number, limit?: number): Promise<Post[]> {
    const skip = page && limit ? (page - 1) * limit : undefined;
    const take = limit;

    const posts = await this.postsRepository.find({
      relations: ['author'],
      order: { createdAt: 'DESC' },
      skip,
      take,
    });

    return posts;
  }

  /**
   * Obtiene un post por su ID
   * @param id - UUID del post
   * @returns Post con información del autor, likes y comentarios
   * @throws NotFoundException si el post no existe
   */
  async getById(id: string): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author', 'likes', 'comments'],
    });

    if (!post) {
      throw new NotFoundException(`Post con ID ${id} no encontrado`);
    }

    return post;
  }

  /**
   * Obtiene todos los posts de un usuario específico
   * @param userId - UUID del usuario
   * @param page - Número de página (opcional)
   * @param limit - Límite de posts por página (opcional)
   * @returns Array de posts del usuario
   */
  async getByUserId(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<Post[]> {
    const skip = page && limit ? (page - 1) * limit : undefined;
    const take = limit;

    const posts = await this.postsRepository.find({
      where: { authorId: userId },
      relations: ['author'],
      order: { createdAt: 'DESC' },
      skip,
      take,
    });

    return posts;
  }

  /**
   * Crea un nuevo post
   * @param createPostDto - Datos del post a crear
   * @param user - Usuario autenticado que crea el post
   * @returns Post creado
   */
  async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
    // Determinar el tipo de post si no se proporciona
    let postType: PostType = createPostDto.type || PostType.TEXT;

    // Auto-detectar el tipo basado en los campos proporcionados
    if (!createPostDto.type) {
      if (
        createPostDto.imageUrl &&
        (createPostDto.description || createPostDto.content)
      ) {
        postType = PostType.TEXT_WITH_IMAGE;
      } else if (createPostDto.imageUrl) {
        postType = PostType.IMAGE;
      } else {
        postType = PostType.TEXT;
      }
    }

    const post = this.postsRepository.create({
      ...createPostDto,
      type: postType,
      authorId: user.id,
      author: user,
    });

    return await this.postsRepository.save(post);
  }

  /**
   * Actualiza un post existente
   * @param id - UUID del post a actualizar
   * @param updatePostDto - Datos a actualizar
   * @param user - Usuario autenticado
   * @returns Post actualizado
   * @throws NotFoundException si el post no existe
   * @throws ForbiddenException si el usuario no es el autor del post
   */
  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    user: User,
  ): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException(`Post con ID ${id} no encontrado`);
    }

    // Verificar que el usuario sea el autor del post
    if (post.authorId !== user.id) {
      throw new ForbiddenException(
        'No tienes permiso para actualizar este post',
      );
    }

    // Si se actualiza el tipo o los campos relacionados, recalcular el tipo
    const updateType = updatePostDto.type;
    const updateImageUrl = updatePostDto.imageUrl;

    if (updateType || updateImageUrl !== undefined) {
      let postType: PostType = updateType || post.type;

      if (!updateType) {
        const finalImageUrl =
          updateImageUrl !== undefined ? updateImageUrl : post.imageUrl;
        const finalDescription =
          updatePostDto.description !== undefined
            ? updatePostDto.description
            : post.description;
        const finalContent =
          updatePostDto.content !== undefined
            ? updatePostDto.content
            : post.content;

        if (finalImageUrl && (finalDescription || finalContent)) {
          postType = PostType.TEXT_WITH_IMAGE;
        } else if (finalImageUrl) {
          postType = PostType.IMAGE;
        } else {
          postType = PostType.TEXT;
        }
      }

      Object.assign(post, {
        ...updatePostDto,
        type: postType,
      });
    } else {
      Object.assign(post, updatePostDto);
    }

    return await this.postsRepository.save(post);
  }

  /**
   * Elimina un post
   * @param id - UUID del post a eliminar
   * @param user - Usuario autenticado
   * @returns true si se eliminó correctamente
   * @throws NotFoundException si el post no existe
   * @throws ForbiddenException si el usuario no es el autor del post
   */
  async delete(id: string, user: User): Promise<boolean> {
    const post = await this.postsRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post con ID ${id} no encontrado`);
    }

    // Verificar que el usuario sea el autor del post
    if (post.authorId !== user.id) {
      throw new ForbiddenException('No tienes permiso para eliminar este post');
    }

    const result = await this.postsRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
