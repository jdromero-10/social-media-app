import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Post } from './posts.entity';

@Entity({ name: 'likes' })
@Unique(['userId', 'postId']) // Un usuario solo puede dar like una vez a un post
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relación Many-to-One con User (quien dio el like)
  @ManyToOne(() => User, {
    onDelete: 'CASCADE', // Si se elimina el usuario, se eliminan sus likes
    nullable: false,
  })
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  // Relación Many-to-One con Post
  @ManyToOne(() => Post, (post) => post.likes, {
    onDelete: 'CASCADE', // Si se elimina el post, se eliminan sus likes
    nullable: false,
  })
  post: Post;

  @Column({ type: 'uuid' })
  postId: string;

  @CreateDateColumn()
  createdAt: Date;
}
