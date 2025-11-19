import { PostType } from '../entities/posts.entity';
export declare class CreatePostDto {
    title: string;
    description?: string | null;
    content?: string | null;
    imageUrl?: string | null;
    type?: PostType;
}
