import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repository/user.repo';
import { Constants } from '../../utils/constants';
import { PostRepository } from '../../post/repository/post.repo';

@Injectable()
export class AdminService {

    constructor(private userRepo: UserRepository,
        private postRepo: PostRepository
    ) { }

    async getUsers() {
        return this.userRepo.find({
            where: {
                role: Constants.ROLES.NORMAL_ROLE
            }
        })
    }

    async deleteUser(userId: number, user: any) {
        if(user.role === Constants.ROLES.ADMIN_ROLE){
            const getUser = await this.userRepo.findOne({
                where: {
                    id: userId
                }
            });
            if(!getUser) {
                throw new NotFoundException('user not found');
            }
            if(getUser.role === Constants.ROLES.SUPERADMIN_ROLE || getUser.role === Constants.ROLES.ADMIN_ROLE) {
                throw new ForbiddenException('You can Not delete this user');
            }
        }
        return await this.userRepo.softDelete(userId);
    }

    async changeUserStatus(userId: number, user: any) {
        const getUser = await this.userRepo.findOne({
            where: {
                id: userId
            }
        });
        if(user.role === Constants.ROLES.ADMIN_ROLE){
            if(!getUser) {
                throw new NotFoundException('user not found');
            }
            if(getUser.role === Constants.ROLES.SUPERADMIN_ROLE || getUser.role === Constants.ROLES.ADMIN_ROLE) {
                throw new ForbiddenException('You can Not update status of this user');
            }
    
        }
        if(getUser.status === 'active') {
            getUser.status = 'inactive'
        }else{
            getUser.status = 'active';
        }

        await this.userRepo.save(getUser);
        return {
            message: `status is updates to ${getUser.status}`
        }
    }

    async getAllPosts() {
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

    async getPostByUserId(userId: number) {
        return await this.postRepo.find({
            relations: ['author'],
            where: {
                author: {
                    id: userId
                }
            }
        })
    }

    async getPostById(postId: number) {
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

    async adminDeletePost(postId: number) {
        const post = await this.getPostById(postId);
        if (!post) {
            throw new NotFoundException('post not found');
        }
        if(post.totalDisLikes > 15) {
            return this.postRepo.softDelete(postId);
        }
        throw new ForbiddenException('You are not allowed to delete this post');
    }
}
