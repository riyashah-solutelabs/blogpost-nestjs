import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommenttDto } from '../../dtos';
import { CommentRepository } from '../repository/comment.repo';
import { PostService } from './post.service';
import { Constants } from 'src/utils/constants';

@Injectable()
export class CommentService {
    constructor(
        private commentRepo: CommentRepository,
        private postService: PostService
    ) { }

    async addComment(user, postId: number, createcomment: CreateCommenttDto) {
        const post = await this.postService.getPostById(postId);
        if (!post || !user) {
            throw new NotFoundException('not found');
        }
        const comment = await this.commentRepo.create(createcomment);
        comment.user = user.userId;
        comment.post = post;
        comment.createdBy = user.name;
        console.log(comment)

        return this.commentRepo.save(comment);
    }

    async deleteComment(user, postId, commentId) {
        const post = await this.postService.getPostById(postId);
        if (!post) {
            throw new NotFoundException('post not found')
        }
        const comment = await this.commentRepo.findOne({
            relations: ['user'],
            where: {
                id: commentId
            }
        })
        if (!comment || !post.comments.find((comment) => comment.id === commentId)) {
            throw new NotFoundException('Comment Not Found')
        }

        console.log(post.author.id)
        if (post.author.id === user.userId || comment.user.id === user.userId || user.role === Constants.ROLES.ADMIN_ROLE || user.role === Constants.ROLES.SUPERADMIN_ROLE) {
            return await this.commentRepo.delete(commentId)
        } else {
            throw new ForbiddenException('You are not allowed to delete this comment');
        }
    }

    async likeComment(user, postId: number, commentId: number) {
        const { userId, ...userData } = user;
        const post = await this.postService.getPostById(postId);
        if (!post) {
            throw new NotFoundException('post not found');
        }
        const comment = await this.commentRepo.findOne({
            relations: ['likedBy', 'dislikedBy'],
            where: {
                id: commentId
            }
        });
        if (!comment) {
            throw new NotFoundException('comment not found');
        }

        if (comment.likedBy.find((likedUser) => likedUser.id === userId)) {
            throw new ConflictException('You have already liked this post.');
        }
        if (comment.dislikedBy.find((dislikedUser) => dislikedUser.id === userId)) {
            comment.dislikedBy = comment.dislikedBy.filter((userData) => {
                return userData.id !== userId;
            });
            console.log("dislikedBy", comment.dislikedBy)
            comment.totalDisLikes -= 1;
        }
        comment.totalLikes += 1;
        comment.likedBy.push({ id: userId, ...userData });

        const l = await this.commentRepo.save(comment);
        console.log(l)

        return {
            message: 'You have liked comment successfully'
        }

    }

    async dislikeComment(user, postId: number, commentId: number) {
        const { userId, ...userData } = user;
        const post = await this.postService.getPostById(postId);
        if (!post) {
            throw new NotFoundException('post not found');
        }
        const comment = await this.commentRepo.findOne({
            relations: ['likedBy', 'dislikedBy'],
            where: {
                id: commentId
            }
        });
        if (!comment) {
            throw new NotFoundException('comment not found');
        }

        if (comment.dislikedBy.find((likedUser) => likedUser.id === userId)) {
            throw new ConflictException('You have already disliked this post.');
        }
        if (comment.likedBy.find((likedUser) => likedUser.id === userId)) {
            comment.likedBy = comment.likedBy.filter((userData) => {
                return userData.id !== userId;
            });
            comment.totalLikes -= 1;
        }

        comment.totalDisLikes += 1;
        comment.dislikedBy.push({ id: userId, ...userData });

        await this.commentRepo.save(comment);

        return {
            message: 'You have disliked comment successfully'
        }

    }

}
