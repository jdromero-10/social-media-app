import { CreatePostDto } from './create-post.dto';
import { PostType } from '../entities/posts.entity';
export declare class UpdatePostDto implements Partial<CreatePostDto> {
    title?: string;
    description?: string | null;
    content?: string | null;
    imageUrl?: string | null;
    type?: PostType;
}
