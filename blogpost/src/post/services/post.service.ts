import { ConflictException, ForbiddenException, Injectable, NotFoundException, Post } from '@nestjs/common';
import { PostRepository } from '../repository/post.repo';
import { CreatePostDto, UpdatePostDto } from '../../dtos';
// import { UserService } from '../../user/services/user.service';
// import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PostService {
    constructor(
        private postRepo: PostRepository,
        // private userService: UserService
    ) { }
    async createPost(userId, createpost: CreatePostDto) {
        // const user = await this.userService.findUserById(userId);
        const post = await this.postRepo.create(createpost);
        post.author = userId;
        const savedPost = await this.postRepo.save(post);
        delete savedPost.author.password;
        return savedPost;
    }

    async getAllPost() {
        return await this.postRepo.find();
    }

    async getPost() {
        const posts = await this.postRepo
            .createQueryBuilder('post')
            .where('post.totalDisLikes < :dislikes', { dislikes: 1 })
            .getMany();

        return posts;
    }
    async getPosts() {
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

    // async postLike(userId: number, postId: number) {
    //     // const user = await this.userService.findUserById(userId);
    //     const user = await this.postRepo.manager.findOne(User, {
    //         where: {
    //             id: userId
    //         }
    //     });
    //     const post = await this.getPostById(postId);
    //     if (!post) {
    //         throw new NotFoundException('post not found')
    //     }

    //     if (post.likedBy.find((likedUser) => likedUser.id === user.id)) {
    //         throw new ConflictException('You have already liked this post.');
    //     }
    //     if (post.dislikedBy.find((dislikedUser) => dislikedUser.id === user.id)) {
    //         post.dislikedBy = post.dislikedBy.filter((id) => {
    //             return id !== user;
    //         });
    //         post.totalDisLikes -= 1;
    //     }

    //     post.totalLikes += 1;
    //     post.likedBy.push(user);

    //     const postlike = await this.postRepo.save(post);
    //     console.log(postlike)

    //     return {
    //         message: 'You have liked post successfully'
    //     }
    // }
    async postLike(user, postId: number) {
        // const user = await this.userService.findUserById(userId);
        // user.id = user.userId;
        // delete user.userId;
        const { userId, ...userData } = user;
        // console.log(user)
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
        post.likedBy.push({ id: userId, ...userData});

        const updatedPost = await this.postRepo.save(post);
        console.log(updatedPost);

        return {
            message: 'You have liked the post successfully',
        };
    }


    async postDisLike(user, postId: number) {
        // const user = await this.userService.findUserById(userId);
        // user.id = user.userId;
        // delete user.userId;
        const { userId, ...userData } = user;
        // console.log(user.id)
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
        post.dislikedBy.push({ id: userId, ...userData});

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
            return this.postRepo.softDelete(postId);
        }
        throw new ForbiddenException('You are not allowed to delete this post');
    }

}
