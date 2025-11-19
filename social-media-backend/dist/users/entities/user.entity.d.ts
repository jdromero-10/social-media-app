import { Post } from '../../posts/entities/posts.entity';
import { Like } from '../../posts/entities/like.entity';
import { Comment } from '../../posts/entities/comment.entity';
import { Notification } from '../../notifications/entities/notification.entity';
export declare class User {
    id: string;
    name: string;
    username: string;
    email: string;
    imageUrl: string | null;
    bio: string | null;
    password: string;
    authStrategy: string | null;
    posts: Post[];
    likes: Like[];
    comments: Comment[];
    notifications: Notification[];
    notificationsSent: Notification[];
    createdAt: Date;
    updatedAt: Date;
}
