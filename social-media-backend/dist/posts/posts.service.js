"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const posts_entity_1 = require("./entities/posts.entity");
let PostsService = class PostsService {
    postsRepository;
    constructor(postsRepository) {
        this.postsRepository = postsRepository;
    }
    async getAll(page, limit) {
        const skip = page && limit ? (page - 1) * limit : undefined;
        const take = limit;
        const posts = await this.postsRepository.find({
            relations: ['author'],
            order: { createdAt: 'DESC' },
            skip,
            take,
        });
        return posts;
    }
    async getById(id) {
        const post = await this.postsRepository.findOne({
            where: { id },
            relations: ['author', 'likes', 'comments'],
        });
        if (!post) {
            throw new common_1.NotFoundException(`Post con ID ${id} no encontrado`);
        }
        return post;
    }
    async getByUserId(userId, page, limit) {
        const skip = page && limit ? (page - 1) * limit : undefined;
        const take = limit;
        const posts = await this.postsRepository.find({
            where: { authorId: userId },
            relations: ['author'],
            order: { createdAt: 'DESC' },
            skip,
            take,
        });
        return posts;
    }
    async create(createPostDto, user) {
        let postType = createPostDto.type || posts_entity_1.PostType.TEXT;
        if (!createPostDto.type) {
            if (createPostDto.imageUrl &&
                (createPostDto.description || createPostDto.content)) {
                postType = posts_entity_1.PostType.TEXT_WITH_IMAGE;
            }
            else if (createPostDto.imageUrl) {
                postType = posts_entity_1.PostType.IMAGE;
            }
            else {
                postType = posts_entity_1.PostType.TEXT;
            }
        }
        const post = this.postsRepository.create({
            ...createPostDto,
            type: postType,
            authorId: user.id,
            author: user,
        });
        return await this.postsRepository.save(post);
    }
    async update(id, updatePostDto, user) {
        const post = await this.postsRepository.findOne({
            where: { id },
            relations: ['author'],
        });
        if (!post) {
            throw new common_1.NotFoundException(`Post con ID ${id} no encontrado`);
        }
        if (post.authorId !== user.id) {
            throw new common_1.ForbiddenException('No tienes permiso para actualizar este post');
        }
        const updateType = updatePostDto.type;
        const updateImageUrl = updatePostDto.imageUrl;
        if (updateType || updateImageUrl !== undefined) {
            let postType = updateType || post.type;
            if (!updateType) {
                const finalImageUrl = updateImageUrl !== undefined ? updateImageUrl : post.imageUrl;
                const finalDescription = updatePostDto.description !== undefined
                    ? updatePostDto.description
                    : post.description;
                const finalContent = updatePostDto.content !== undefined
                    ? updatePostDto.content
                    : post.content;
                if (finalImageUrl && (finalDescription || finalContent)) {
                    postType = posts_entity_1.PostType.TEXT_WITH_IMAGE;
                }
                else if (finalImageUrl) {
                    postType = posts_entity_1.PostType.IMAGE;
                }
                else {
                    postType = posts_entity_1.PostType.TEXT;
                }
            }
            Object.assign(post, {
                ...updatePostDto,
                type: postType,
            });
        }
        else {
            Object.assign(post, updatePostDto);
        }
        return await this.postsRepository.save(post);
    }
    async delete(id, user) {
        const post = await this.postsRepository.findOne({
            where: { id },
        });
        if (!post) {
            throw new common_1.NotFoundException(`Post con ID ${id} no encontrado`);
        }
        if (post.authorId !== user.id) {
            throw new common_1.ForbiddenException('No tienes permiso para eliminar este post');
        }
        const result = await this.postsRepository.delete(id);
        return (result.affected ?? 0) > 0;
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(posts_entity_1.Post)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PostsService);
//# sourceMappingURL=posts.service.js.map