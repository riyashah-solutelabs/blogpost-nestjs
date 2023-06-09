import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommenttDto } from '../../dtos';
import { CommentRepository } from '../repository/comment.repo';
import { PostService } from './post.service';
import { Constants } from '../../utils/constants';
import { CommentResponseDto, MessageResponseDto } from '../../response';
import { ErrorMessage } from 'src/utils/errorMessage';

@Injectable()
export class CommentService {
    constructor(
        private commentRepo: CommentRepository,
        private postService: PostService
    ) { }

    async addComment(user, postId: string, createcomment: CreateCommenttDto): Promise<CommentResponseDto> {
        const post = await this.postService.getPostById(postId);
        if (!post) {
            throw new NotFoundException(ErrorMessage.POST_NOT_FOUND);
        }
        const comment = await this.commentRepo.create(createcomment);
        comment.user = user.userId;
        comment.post = post;
        comment.createdBy = user.name;
        console.log(comment)

        return this.commentRepo.save(comment);
    }

    async deleteComment(user, postId: string, commentId: string): Promise<MessageResponseDto> {
        const post = await this.postService.getPostById(postId);
        if (!post) {
            throw new NotFoundException(ErrorMessage.POST_NOT_FOUND)
        }
        const comment = await this.commentRepo.findOne({
            relations: ['user'],
            where: {
                id: commentId
            }
        })
        if (!comment || !post.comments.find((comment) => comment.id === commentId)) {
            throw new NotFoundException(ErrorMessage.COMMENT_NOT_FOUND)
        }

        console.log(post.author.id)
        if (post.author.id === user.userId || comment.user.id === user.userId || user.role === Constants.ROLES.ADMIN_ROLE || user.role === Constants.ROLES.SUPERADMIN_ROLE) {
            await this.commentRepo.delete(commentId)
            return {
                message: 'comment deleted successfully!'
            }
        } else {
            throw new ForbiddenException('You are not allowed to delete this comment');
        }
    }

    async likeComment(user, postId: string, commentId: string): Promise<MessageResponseDto> {
        const { userId, ...userData } = user;
        const post = await this.postService.getPostById(postId);
        if (!post) {
            throw new NotFoundException(ErrorMessage.POST_NOT_FOUND);
        }
        const comment = await this.commentRepo.findOne({
            relations: ['likedBy', 'dislikedBy'],
            where: {
                id: commentId
            }
        });
        if (!comment) {
            throw new NotFoundException(ErrorMessage.COMMENT_NOT_FOUND);
        }

        if (comment.likedBy.find((likedUser) => likedUser.id === userId)) {
            throw new ConflictException(ErrorMessage.LIKE_CONFLICT);
        }
        if (comment.dislikedBy.find((dislikedUser) => dislikedUser.id === userId)) {
            comment.dislikedBy = comment.dislikedBy.filter((userData) => {
                return userData.id !== userId;
            });
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

    async dislikeComment(user, postId: string, commentId: string): Promise<MessageResponseDto> {
        const { userId, ...userData } = user;
        const post = await this.postService.getPostById(postId);
        if (!post) {
            throw new NotFoundException(ErrorMessage.POST_NOT_FOUND);
        }
        const comment = await this.commentRepo.findOne({
            relations: ['likedBy', 'dislikedBy'],
            where: {
                id: commentId
            }
        });
        if (!comment) {
            throw new NotFoundException(ErrorMessage.COMMENT_NOT_FOUND);
        }

        if (comment.dislikedBy.find((likedUser) => likedUser.id === userId)) {
            throw new ConflictException(ErrorMessage.DISLIKE_CONFLICT);
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
