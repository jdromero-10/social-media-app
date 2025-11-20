import { User } from '../../users/entities/user.entity';
import { Like } from './like.entity';
import { Comment } from './comment.entity';
export declare enum PostType {
    TEXT = "text",
    IMAGE = "image",
    TEXT_WITH_IMAGE = "text_with_image"
}
export declare class Post {
    id: string;
    title: string | null;
    description: string | null;
    content: string | null;
    imageUrl: string | null;
    type: PostType;
    author: User;
    authorId: string;
    likes: Like[];
    comments: Comment[];
    createdAt: Date;
    updatedAt: Date;
}
