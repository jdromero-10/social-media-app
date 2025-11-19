import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './entities/posts.entity';
import { Like } from './entities/like.entity';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Like, Comment])],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService, TypeOrmModule], // Exportar TypeOrmModule para que otros módulos puedan usar las entidades
})
export class PostsModule {}
