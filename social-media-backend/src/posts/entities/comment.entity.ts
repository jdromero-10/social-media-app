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
import { Post } from './posts.entity';

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  // Relación Many-to-One con User (quien comentó)
  @ManyToOne(() => User, {
    onDelete: 'CASCADE', // Si se elimina el usuario, se eliminan sus comentarios
    nullable: false,
  })
  author: User;

  @Column({ type: 'uuid' })
  authorId: string;

  // Relación Many-to-One con Post
  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: 'CASCADE', // Si se elimina el post, se eliminan sus comentarios
    nullable: false,
  })
  post: Post;

  @Column({ type: 'uuid' })
  postId: string;

  // Relación opcional para comentarios anidados (respuestas)
  @ManyToOne(() => Comment, (comment) => comment.replies, {
    onDelete: 'CASCADE', // Si se elimina el comentario padre, se eliminan las respuestas
    nullable: true,
  })
  parentComment: Comment | null;

  @Column({ type: 'uuid', nullable: true })
  parentCommentId: string | null;

  // Relación One-to-Many para respuestas
  @OneToMany(() => Comment, (comment) => comment.parentComment)
  replies: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
