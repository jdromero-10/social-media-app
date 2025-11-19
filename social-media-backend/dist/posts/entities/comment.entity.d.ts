import { User } from '../../users/entities/user.entity';
import { Post } from './posts.entity';
export declare class Comment {
    id: string;
    content: string;
    author: User;
    authorId: string;
    post: Post;
    postId: string;
    parentComment: Comment | null;
    parentCommentId: string | null;
    replies: Comment[];
    createdAt: Date;
    updatedAt: Date;
}
