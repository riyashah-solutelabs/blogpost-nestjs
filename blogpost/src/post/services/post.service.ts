import { ConflictException, ForbiddenException, Injectable, NotFoundException, Post } from '@nestjs/common';
import { PostRepository } from '../repository/post.repo';
import { CreatePostDto } from '../dto/create-post.dto';
import { UserService } from '../../user/services/user.service';
import { Constants } from '../../utils/constants';
import { User } from '../../user/entities/user.entity';
import { CreateCommenttDto } from '../dto/create-comment.dto';
import { CommentRepository } from '../repository/comment.repo';

@Injectable()
export class PostService {
    constructor(
        private postRepo: PostRepository,
        private userService: UserService
    ) { }
    async createPost(userId: number, createpost: CreatePostDto) {
        const user = await this.userService.findUserById(userId);
        const post = await this.postRepo.create(createpost);
        post.author = user;
        return await this.postRepo.save(post);
    }

    async getPosts() {
        // return await this.postRepo.find({
        //     relations: ['likes', 'dislikes', 'comments']
        // })
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
            .where('post.totalDisLikes < :dislikes', { dislikes: 15 })
            .getMany();

        return posts;
    }

    async getPostById(postId: number) {
        // return await this.postRepo.find({
        //     relations: ['likes', 'dislikes', 'comments'],
        //     where: {
        //         id: postId
        //     }
        // })
        const post = await this.postRepo
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.likedBy', 'likedBy')
            .leftJoinAndSelect('post.dislikedBy', 'dislikedBy')
            .leftJoinAndSelect('post.author', 'author')
            .select(['post', 'likedBy', 'author.id', 'dislikedBy'])
            .where({ id: postId })
            .getOne();

        return post;
    }

    async postLike(userId: number, postId: number) {
        const user = await this.userService.findUserById(userId);
        const post = await this.getPostById(postId);
        if (!post) {
            throw new NotFoundException('post not found')
        }

        if (post.likedBy.find((likedUser) => likedUser.id === user.id)) {
            throw new ConflictException('You have already liked this post.');
        }
        if (post.dislikedBy.find((dislikedUser) => dislikedUser.id === user.id)) {
            post.dislikedBy = post.dislikedBy.filter((userId) => {
                return userId !== user;
            });
            post.totalDisLikes -= 1;
        }

        post.totalLikes += 1;
        post.likedBy.push(user);

        await this.postRepo.save(post);

        return {
            message: 'You have liked post successfully'
        }
    }


    async postDisLike(userId: number, postId: number) {
        const user = await this.userService.findUserById(userId);
        const post = await this.getPostById(postId);
        if (!post) {
            throw new NotFoundException('post not found')
        }
        if (post.dislikedBy.find((dislikedUser) => dislikedUser.id === user.id)) {
            throw new ConflictException('You have already disliked this post.');
        }
        if (post.likedBy.find((likedUser) => likedUser.id === user.id)) {
            post.likedBy = post.likedBy.filter((userId) => {
                return userId !== user;
            });
            post.totalLikes -= 1;
        }

        post.totalDisLikes += 1;
        post.dislikedBy.push(user);

        await this.postRepo.save(post);

        return {
            message: 'You have disliked post successfully'
        }
    }

    async updatePost(userId: number, postId: number, postData: Partial<CreatePostDto>) {
        const post = await this.getPostById(postId);
        if (!post) {
            throw new NotFoundException('post not found');
        }
        if (post.author.id === userId) {
            return this.postRepo.update(postId, postData);
        }
        throw new ForbiddenException('You are not allowed to update this post');
    }

    async deletePost(user, postId: number) {
        const post = await this.getPostById(postId);
        // console.log(user)
        if (!post) {
            throw new NotFoundException('post not found');
        }
        // return user;
        if (post.author.id === user.userId) {
            return this.postRepo.softDelete(postId);
        }
        throw new ForbiddenException('You are not allowed to update this post');
    }

}
