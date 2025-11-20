import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { PostType } from '../entities/posts.entity';

export class CreatePostDto {
  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'El título no puede exceder 255 caracteres' })
  title?: string | null;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsString()
  @IsOptional()
  content?: string | null;

  @IsString()
  @IsOptional()
  imageUrl?: string | null;

  @IsEnum(PostType, {
    message: 'El tipo debe ser: text, image o text_with_image',
  })
  @IsOptional()
  type?: PostType;
}
