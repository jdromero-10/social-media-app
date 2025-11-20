import { PostType } from '../entities/posts.entity';
export declare class CreatePostDto {
    title?: string | null;
    description?: string | null;
    content?: string | null;
    imageUrl?: string | null;
    type?: PostType;
}
