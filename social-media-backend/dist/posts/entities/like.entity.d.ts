import { User } from '../../users/entities/user.entity';
import { Post } from './posts.entity';
export declare class Like {
    id: string;
    user: User;
    userId: string;
    post: Post;
    postId: string;
    createdAt: Date;
}
