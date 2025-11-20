import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import * as uuid from 'uuid';

export enum ImageType {
  USER_AVATAR = 'users',
  POST_IMAGE = 'posts',
}

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly uploadsDir = join(process.cwd(), 'images');

  constructor() {
    // Crear directorios si no existen
    this.ensureDirectoriesExist();
  }

  /**
   * Asegura que los directorios de upload existan
   */
  private ensureDirectoriesExist() {
    const usersDir = join(this.uploadsDir, ImageType.USER_AVATAR);
    const postsDir = join(this.uploadsDir, ImageType.POST_IMAGE);

    [this.uploadsDir, usersDir, postsDir].forEach((dir) => {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
        this.logger.log(`Directorio creado: ${dir}`);
      }
    });
  }

  /**
   * Valida que el archivo sea una imagen válida
   */
  private validateImageFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    // Validar tipo MIME
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, GIF, WebP)',
      );
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('El archivo no debe exceder los 5MB');
    }
  }

  /**
   * Genera un nombre único para el archivo
   */
  private generateFileName(originalName: string): string {
    const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
    const uniqueId = uuid.v4();
    return `${uniqueId}.${extension}`;
  }

  /**
   * Sube una imagen y retorna la URL relativa
   * @param file - Archivo de imagen
   * @param imageType - Tipo de imagen (USER_AVATAR o POST_IMAGE)
   * @returns URL relativa de la imagen (ej: /images/users/uuid.jpg)
   */
  async uploadImage(
    file: Express.Multer.File,
    imageType: ImageType,
  ): Promise<string> {
    this.validateImageFile(file);

    const fileName = this.generateFileName(file.originalname);
    const uploadPath = join(this.uploadsDir, imageType, fileName);

    try {
      // Guardar archivo
      writeFileSync(uploadPath, file.buffer);
      this.logger.log(`Imagen guardada: ${uploadPath}`);

      // Retornar URL relativa
      const url = `/images/${imageType}/${fileName}`;
      return url;
    } catch (error) {
      this.logger.error(`Error al guardar imagen: ${error}`);
      throw new BadRequestException('Error al guardar la imagen');
    }
  }

  /**
   * Elimina una imagen del sistema de archivos
   * @param imageUrl - URL relativa de la imagen (ej: /images/users/uuid.jpg)
   */
  async deleteImage(imageUrl: string): Promise<void> {
    if (!imageUrl || !imageUrl.startsWith('/images/')) {
      return; // No es una URL local, no hacer nada
    }

    const filePath = join(process.cwd(), imageUrl);

    try {
      if (existsSync(filePath)) {
        unlinkSync(filePath);
        this.logger.log(`Imagen eliminada: ${filePath}`);
      }
    } catch (error) {
      this.logger.error(`Error al eliminar imagen: ${error}`);
      // No lanzar error, solo registrar
    }
  }
}
