import { IsString, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { CreatePostDto } from './create-post.dto';
import { PostType } from '../entities/posts.entity';

export class UpdatePostDto implements Partial<CreatePostDto> {
  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'El título no puede exceder 255 caracteres' })
  title?: string;

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
