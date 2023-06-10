import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repository/user.repo';
import { Constants } from '../../utils/constants';
import { PostRepository } from '../../post/repository/post.repo';
import { MessageResponseDto, PostResponseDto, UserResponseDto } from '../../response';
import { ErrorMessage } from 'src/utils/errorMessage';

@Injectable()
export class AdminService {

    constructor(private userRepo: UserRepository,
        private postRepo: PostRepository
    ) { }

    async getUsers(): Promise<UserResponseDto[]> {
        return this.userRepo.find({
            where: {
                role: Constants.ROLES.NORMAL_ROLE
            }
        })
    }

    async deleteUser(userId: string, user: any): Promise<MessageResponseDto> {
        const getUser = await this.userRepo.findOne({
            where: {
                id: userId
            }
        });
        if (!getUser) {
            throw new NotFoundException(ErrorMessage.NOT_FOUND);
        }
        if (user.role === Constants.ROLES.ADMIN_ROLE) {
            if (getUser.role === Constants.ROLES.SUPERADMIN_ROLE || getUser.role === Constants.ROLES.ADMIN_ROLE) {
                throw new ForbiddenException(ErrorMessage.NOT_ALLOWED);
            }
        }
        else if (user.role === Constants.ROLES.SUPERADMIN_ROLE) {
            if (getUser.role === Constants.ROLES.SUPERADMIN_ROLE) {
                throw new ForbiddenException(ErrorMessage.NOT_ALLOWED);
            }
        }
        const posts = await this.postRepo.find({
            where: {
                author: {
                    id: userId
                }
            }
        });

        await Promise.all(posts.map(async (post) => {
            await this.postRepo.remove(post);
        }));
        await this.userRepo.softDelete(userId);
        return {
            message: 'user deleted successfully'
        }
    }

    async changeUserStatus(userId: string, user: any): Promise<MessageResponseDto> {
        const getUser = await this.userRepo.findOne({
            where: {
                id: userId
            }
        });
        if (!getUser) {
            throw new NotFoundException(ErrorMessage.NOT_FOUND);
        }
        if (user.role === Constants.ROLES.ADMIN_ROLE) {
            if (getUser.role === Constants.ROLES.SUPERADMIN_ROLE || getUser.role === Constants.ROLES.ADMIN_ROLE) {
                throw new ForbiddenException(ErrorMessage.NOT_ALLOWED);
            }

        }
        else if (user.role === Constants.ROLES.SUPERADMIN_ROLE) {
            if (getUser.role === Constants.ROLES.SUPERADMIN_ROLE) {
                throw new ForbiddenException(ErrorMessage.NOT_ALLOWED);
            }
        }
        if (getUser.status === 'active') {
            getUser.status = 'inactive'
        } else {
            getUser.status = 'active';
        }

        await this.userRepo.save(getUser);
        return {
            message: `status is updates to ${getUser.status}`
        }
    }

    async getAllPosts(): Promise<PostResponseDto[]> {
        const posts = await this.postRepo
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.likedBy', 'likedBy')
            .leftJoinAndSelect('post.dislikedBy', 'dislikedBy')
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.comments', 'comments')
            .select(['post', 'likedBy.id', 'author.id', 'dislikedBy.id', 'comments'])
            .orderBy('post.createdAt', 'DESC')
            .addOrderBy('post.totalLikes', 'DESC')
            .addOrderBy('comments', 'DESC')
            .addOrderBy('post.totalDisLikes', 'DESC')
            .getMany();

        return posts;
    }

    async getPostByUserId(userId: string): Promise<PostResponseDto[]> {
        const posts = await this.postRepo
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.comments', 'comments')
            .select(['post', 'author.id', 'comments.description', 'comments.id'])
            .where('author.id = :id', { id: userId })
            .getMany();

        return posts;
    }

    async getPostById(postId: string): Promise<PostResponseDto> {
        const post = await this.postRepo
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.likedBy', 'likedBy')
            .leftJoinAndSelect('post.dislikedBy', 'dislikedBy')
            .leftJoinAndSelect('post.author', 'author')
            .select(['post', 'likedBy.name', 'dislikedBy.name', 'author.id'])
            .where('post.id = :id', { id: postId })
            .getOne();

        return post;
    }

    async adminDeletePost(postId: string): Promise<MessageResponseDto> {
        const post = await this.getPostById(postId);
        if (!post) {
            throw new NotFoundException(ErrorMessage.POST_NOT_FOUND);
        }
        if (post.totalDisLikes > 15) {
            await this.postRepo.softDelete(postId);
            return {
                message: 'admin is deleted successfully'
            }
        }
        throw new ForbiddenException('You are not allowed to delete this post');
    }
}
