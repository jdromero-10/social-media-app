import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/posts.entity';
import { Comment } from '../../posts/entities/comment.entity';
export declare enum NotificationType {
    LIKE = "like",
    COMMENT = "comment",
    REPLY = "reply",
    FOLLOW = "follow",
    MENTION = "mention"
}
export declare class Notification {
    id: string;
    type: NotificationType;
    message: string | null;
    isRead: boolean;
    recipient: User;
    recipientId: string;
    actor: User | null;
    actorId: string | null;
    post: Post | null;
    postId: string | null;
    comment: Comment | null;
    commentId: string | null;
    createdAt: Date;
}
