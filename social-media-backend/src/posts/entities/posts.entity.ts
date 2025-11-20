import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Like } from './like.entity';
import { Comment } from './comment.entity';

export enum PostType {
  TEXT = 'text',
  IMAGE = 'image',
  TEXT_WITH_IMAGE = 'text_with_image',
}

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string | null;

  @Column({
    type: 'enum',
    enum: PostType,
    default: PostType.TEXT,
  })
  type: PostType;

  // Relación Many-to-One con User
  @ManyToOne(() => User, {
    onDelete: 'CASCADE', // Si se elimina el usuario, se eliminan sus posts
    nullable: false,
  })
  author: User;

  @Column({ type: 'uuid' })
  authorId: string;

  // Relación One-to-Many con Like
  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  // Relación One-to-Many con Comment
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
