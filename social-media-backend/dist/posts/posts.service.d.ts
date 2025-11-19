import { Repository } from 'typeorm';
import { Post } from './entities/posts.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/entities/user.entity';
export declare class PostsService {
    private readonly postsRepository;
    constructor(postsRepository: Repository<Post>);
    getAll(page?: number, limit?: number): Promise<Post[]>;
    getById(id: string): Promise<Post>;
    getByUserId(userId: string, page?: number, limit?: number): Promise<Post[]>;
    create(createPostDto: CreatePostDto, user: User): Promise<Post>;
    update(id: string, updatePostDto: UpdatePostDto, user: User): Promise<Post>;
    delete(id: string, user: User): Promise<boolean>;
}
