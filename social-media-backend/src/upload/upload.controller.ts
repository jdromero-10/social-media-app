import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService, ImageType } from './upload.service';
import { User } from '../users/entities/user.entity';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * POST /upload/user-avatar
   * Sube un avatar de usuario
   * @param file - Archivo de imagen
   * @param req - Request con usuario autenticado
   * @returns URL de la imagen subida
   */
  @Post('user-avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadUserAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: { user: User },
  ) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    const imageUrl = await this.uploadService.uploadImage(
      file,
      ImageType.USER_AVATAR,
    );

    return {
      imageUrl,
      message: 'Avatar subido exitosamente',
    };
  }

  /**
   * POST /upload/post-image
   * Sube una imagen para un post
   * @param file - Archivo de imagen
   * @param req - Request con usuario autenticado
   * @returns URL de la imagen subida
   */
  @Post('post-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadPostImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: { user: User },
  ) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    const imageUrl = await this.uploadService.uploadImage(
      file,
      ImageType.POST_IMAGE,
    );

    return {
      imageUrl,
      message: 'Imagen subida exitosamente',
    };
  }
}
