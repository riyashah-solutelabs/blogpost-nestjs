import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../repository/post.repo';
import { CreatePostDto, UpdatePostDto } from '../../dtos';
import { Post } from 'src/entities';

@Injectable()
export class PostService {
    constructor(
        private postRepo: PostRepository,
    ) { }
    async createPost(userId, createpost: CreatePostDto) {
        const post = await this.postRepo.create(createpost);
        post.author = userId;
        const savedPost = await this.postRepo.save(post);
        delete savedPost.author.password;
        return savedPost;
    }

    async getAllPost() {
        return await this.postRepo.find();
    }

    async getPosts() {
        const posts = await this.postRepo
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.likedBy', 'likedBy')
            .leftJoinAndSelect('post.dislikedBy', 'dislikedBy')
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.comments', 'comments')
            .leftJoinAndSelect('comments.replies', 'replies')
            .leftJoinAndSelect('replies.parentReply', 'parentReply')
            .leftJoinAndSelect('replies.childReplies', 'nestedReplies')
            .select([
                'post',
                'likedBy.id',
                'author.id',
                'dislikedBy.id',
                'comments',
                'replies',
                'parentReply',
                'nestedReplies'
            ])
            .orderBy('post.createdAt', 'DESC')
            .addOrderBy('post.totalLikes', 'DESC')
            .addOrderBy('comments', 'DESC')
            .addOrderBy('post.totalDisLikes', 'DESC')
            .where('post.totalDisLikes < :dislikes', { dislikes: 15 })
            .getMany();

        return posts;
        // const posts = await this.postRepo
        //     .createQueryBuilder('post')
        //     .leftJoinAndSelect('post.likedBy', 'likedBy')
        //     .leftJoinAndSelect('post.dislikedBy', 'dislikedBy')
        //     .leftJoinAndSelect('post.author', 'author')
        //     .leftJoinAndSelect('post.comments', 'comments')
        //     .leftJoinAndSelect('comments.replies', 'replies')
        //     .leftJoinAndSelect('replies.childReplies', 'parentReply')
        //     .select(['post', 'likedBy.id', 'author.id', 'dislikedBy.id', 'comments', 'replies', 'parentReply'])
        //     .orderBy('post.createdAt', 'DESC')
        //     .addOrderBy('post.totalLikes', 'DESC')
        //     .addOrderBy('comments', 'DESC')
        //     .addOrderBy('post.totalDisLikes', 'DESC')
        //     .where('post.totalDisLikes < :dislikes', { dislikes: 15 })
        //     .getMany();

        // return posts;
        // return await this.postRepo.find();
    }

    async getPostById(postId: number) {

        const post = await this.postRepo
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.likedBy', 'likedBy')
            .leftJoinAndSelect('post.dislikedBy', 'dislikedBy')
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.comments', 'comments')
            .select(['post', 'likedBy', 'author.id', 'dislikedBy', 'comments'])
            .where('post.id = :id', { id: postId })
            .getOne();

        return post;
    }

    async postLike(user, postId: number) {
        const { userId, ...userData } = user;
        const post = await this.getPostById(postId);
        if (!post) {
            throw new NotFoundException('Post not found');
        }

        if (post.likedBy.find((likedUser) => likedUser.id === userId)) {
            throw new ConflictException('You have already liked this post.');
        }

        if (post.dislikedBy.find((dislikedUser) => dislikedUser.id === userId)) {
            post.dislikedBy = post.dislikedBy.filter((userData) => userData.id !== userId);
            post.totalDisLikes -= 1;
        }

        post.totalLikes += 1;
        post.likedBy.push({ id: userId, ...userData });

        const updatedPost = await this.postRepo.save(post);
        console.log(updatedPost);

        return {
            message: 'You have liked the post successfully',
        };
    }


    async postDisLike(user, postId: number) {
        const { userId, ...userData } = user;
        const post = await this.getPostById(postId);
        if (!post) {
            throw new NotFoundException('post not found')
        }
        if (post.dislikedBy.find((dislikedUser) => dislikedUser.id === userId)) {
            throw new ConflictException('You have already disliked this post.');
        }
        if (post.likedBy.find((likedUser) => likedUser.id === userId)) {
            post.likedBy = post.likedBy.filter((user) => {
                return user.id !== userId;
            });
            post.totalLikes -= 1;
        }

        post.totalDisLikes += 1;
        post.dislikedBy.push({ id: userId, ...userData });

        const postdis = await this.postRepo.save(post);
        console.log(postdis)

        return {
            message: 'You have disliked post successfully'
        }
    }

    async updatePost(userId: number, postId: number, postData: UpdatePostDto) {
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
        if (!post) {
            throw new NotFoundException('post not found');
        }
        if (post.author.id === user.userId) {
            return this.postRepo.delete(postId);
        }
        throw new ForbiddenException('You are not allowed to delete this post');
    }

    async searchByTitle(title: string): Promise<Post[]> {
        return this.postRepo.findByTitle(title);
    }

}
