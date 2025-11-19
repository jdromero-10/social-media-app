import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/posts.entity';
import { Comment } from '../../posts/entities/comment.entity';

export enum NotificationType {
  LIKE = 'like', // Alguien dio like a tu post
  COMMENT = 'comment', // Alguien comentó en tu post
  REPLY = 'reply', // Alguien respondió a tu comentario
  FOLLOW = 'follow', // Alguien te siguió
  MENTION = 'mention', // Te mencionaron en un post/comentario
}

@Entity({ name: 'notifications' })
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
    nullable: false,
  })
  type: NotificationType;

  @Column({ type: 'text', nullable: true })
  message: string | null;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  // Relación Many-to-One con User (quien recibe la notificación)
  @ManyToOne(() => User, (user) => user.notifications, {
    onDelete: 'CASCADE', // Si se elimina el usuario, se eliminan sus notificaciones
    nullable: false,
  })
  recipient: User;

  @Column({ type: 'uuid' })
  recipientId: string;

  // Relación Many-to-One con User (quien generó la notificación)
  @ManyToOne(() => User, {
    onDelete: 'SET NULL', // Si se elimina el usuario, la notificación queda pero sin actor
    nullable: true,
  })
  actor: User | null;

  @Column({ type: 'uuid', nullable: true })
  actorId: string | null;

  // Relación Many-to-One con Post (opcional, si la notificación es sobre un post)
  @ManyToOne(() => Post, {
    onDelete: 'CASCADE', // Si se elimina el post, se eliminan las notificaciones relacionadas
    nullable: true,
  })
  post: Post | null;

  @Column({ type: 'uuid', nullable: true })
  postId: string | null;

  // Relación Many-to-One con Comment (opcional, si la notificación es sobre un comentario)
  @ManyToOne(() => Comment, {
    onDelete: 'CASCADE', // Si se elimina el comentario, se eliminan las notificaciones relacionadas
    nullable: true,
  })
  comment: Comment | null;

  @Column({ type: 'uuid', nullable: true })
  commentId: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
