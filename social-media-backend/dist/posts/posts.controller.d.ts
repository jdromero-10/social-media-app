import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/entities/user.entity';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    getAll(page?: string, limit?: string): Promise<import("./entities/posts.entity").Post[]>;
    getByUserId(userId: string, page?: string, limit?: string): Promise<import("./entities/posts.entity").Post[]>;
    getById(id: string): Promise<import("./entities/posts.entity").Post>;
    create(createPostDto: CreatePostDto, req: {
        user: User;
    }): Promise<import("./entities/posts.entity").Post>;
    update(id: string, updatePostDto: UpdatePostDto, req: {
        user: User;
    }): Promise<import("./entities/posts.entity").Post>;
    delete(id: string, req: {
        user: User;
    }): Promise<{
        message: string;
    }>;
}
