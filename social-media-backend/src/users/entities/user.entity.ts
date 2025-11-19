import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from '../../posts/entities/posts.entity';
import { Like } from '../../posts/entities/like.entity';
import { Comment } from '../../posts/entities/comment.entity';
import { Notification } from '../../notifications/entities/notification.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar', unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  bio: string | null;

  @Column()
  password: string;

  @Column({ type: 'varchar', nullable: true })
  authStrategy: string | null;

  // Relación One-to-Many con Post
  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  // Relación One-to-Many con Like
  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  // Relación One-to-Many con Comment
  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  // Relación One-to-Many con Notification (notificaciones recibidas)
  @OneToMany(() => Notification, (notification) => notification.recipient)
  notifications: Notification[];

  // Relación One-to-Many con Notification (notificaciones generadas como actor)
  @OneToMany(() => Notification, (notification) => notification.actor)
  notificationsSent: Notification[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
