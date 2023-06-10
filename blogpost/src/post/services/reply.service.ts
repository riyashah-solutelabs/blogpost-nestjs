import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from '../repository/comment.repo';
import { Constants } from '../../utils/constants';
import { Reply } from 'src/entities/reply.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReplyDto } from 'src/dtos/reply.dto';
import { PostRepository } from '../repository/post.repo';
import { MessageResponseDto, ReplyResponseDto } from '../../response';
import { ErrorMessage } from 'src/utils/errorMessage';

@Injectable()
export class ReplyService {

    constructor(
        private commentRepo: CommentRepository,
        private postRepo: PostRepository,
        @InjectRepository(Reply)
        private replyRepository: Repository<Reply>,
    ) { }

    async addReplyToComment(user: any, postId: string, commentId: string, createReply: CreateReplyDto): Promise<ReplyResponseDto> {
        const post = await this.postRepo.findOne({
            where: {
                id: postId
            }
        });
        if (!post) {
            throw new NotFoundException(ErrorMessage.POST_NOT_FOUND)
        }
        const comment = await this.commentRepo.findOne({
            where: {
                id: commentId
            }
        });
        if (!comment || !post.comments.find((comment) => comment.id === commentId)) {
            throw new NotFoundException(ErrorMessage.COMMENT_NOT_FOUND)
        }

        const reply = new Reply();
        reply.user = user.userId;
        reply.description = createReply.description;
        reply.createdBy = user.name;
        reply.comment = comment;

        return this.replyRepository.save(reply);
    }

    async createReplyToChild(user, postId: string, commentId: string, parentId: string, createReplyDto: CreateReplyDto): Promise<ReplyResponseDto> {
        const post = await this.postRepo.findOne({
            where: {
                id: postId
            }
        });
        if (!post) {
          throw new NotFoundException(ErrorMessage.POST_NOT_FOUND);
        }
      
        const comment = await this.commentRepo.findOne({
            relations: ['replies'],
            where:{
                id: commentId
            },
        });
        if (!comment) {
          throw new NotFoundException(ErrorMessage.COMMENT_NOT_FOUND);
        }
      
        let parentReply: Reply;
      
        if (parentId) {
          parentReply = await this.replyRepository.findOne({
            relations: ['childReplies'],
            where: {
                id: parentId
            },
          });
      
          if (!parentReply) {
            throw new NotFoundException(ErrorMessage.PARENT_REPLY_NOT_FOUND);
          }
        }
      
        const newReply = this.replyRepository.create({
          ...createReplyDto,
          createdBy: user.name,
          user: user.userId,
          comment,
          parentReply,
        });

        console.log(newReply)
      
        if (parentReply) {
          parentReply.childReplies.push(newReply);
          await this.replyRepository.save(parentReply);
        }
      
        const createdReply = await this.replyRepository.save(newReply);
      
        return createdReply;
    }


    async deleteCommentReply(user, postId: string, commentId: string, replyId: string): Promise<MessageResponseDto> {

        const post = await this.postRepo.findOne({
            relations: ['author'],
            where: {
                id: postId
            }
        });
        if (!post) {
            throw new NotFoundException(ErrorMessage.POST_NOT_FOUND)
        }
        const comment = await this.commentRepo.findOne({
            relations: ['replies', 'user'],
            where: {
                id: commentId
            }
        });
        console.log(comment)
        const valid = post.comments.find((comment) => comment.replies.find(reply => reply.id == replyId));
        if (!comment || !post.comments.find((comment) => comment.id == commentId) || !valid){
            throw new NotFoundException(ErrorMessage.COMMENT_NOT_FOUND)
        }

        // Find the parent reply
        const parentReply = await this.replyRepository.findOne({
            relations: ['user'],
            where: {
                id: replyId
            }
        });

        if (!parentReply) {
            throw new NotFoundException(ErrorMessage.PARENT_REPLY_NOT_FOUND);
        }

        // console.log(post.author.id)
        if (parentReply.user.id === user.userId || user.role === Constants.ROLES.ADMIN_ROLE || user.role === Constants.ROLES.SUPERADMIN_ROLE || post.author.id === user.userId || comment.user.id === user.userId) {
            await this.replyRepository.delete(replyId)
            return {
                message: 'Comment Deleted Successfully!'
            }
           
        } else {
            throw new ForbiddenException(ErrorMessage.NOT_ALLOWED);
        }
    }


    async likeCommentReply(user, postId: string, commentId: string, replyId: string): Promise<MessageResponseDto> {
        const { userId, ...userData } = user;
        const post = await this.postRepo.findOne({
            where: {
                id: postId
            }
        });
        if (!post) {
            throw new NotFoundException(ErrorMessage.POST_NOT_FOUND);
        }
        const comment = await this.commentRepo.findOne({
            relations: ['replies', 'replies.childReplies'],
            where: {
                id: commentId
            }
        });
        console.log(comment)
        const replyPost = comment.replies.find((reply) => reply.id == replyId);
        if(!replyPost) {
            const childreplyPost = comment.replies.find(reply => reply.childReplies.find((reply) => reply.id == replyId));
            if (!childreplyPost) {
                throw new NotFoundException(ErrorMessage.COMMENT_NOT_FOUND);
            }
        }
        // console.log(!replyPost)
        if (!comment) {
            throw new NotFoundException(ErrorMessage.COMMENT_NOT_FOUND);
        }
        const reply = await this.replyRepository.findOne({
            relations: ['likedBy', 'dislikedBy'],
            where: {
                id: replyId
            }
        })

        if (reply.likedBy.find(likedByUser => likedByUser.id == userId)) {
            throw new ConflictException(ErrorMessage.LIKE_CONFLICT);
        }
        if (reply.dislikedBy.find((dislikedUser) => dislikedUser.id === userId)) {
            reply.dislikedBy = reply.dislikedBy.filter((userData) => {
                return userData.id !== userId;
            });
            reply.totalDisLikes -= 1;
        }
        reply.totalLikes += 1;
        reply.likedBy.push({ id: userId, ...userData });

        await this.replyRepository.save(reply);

        return {
            message: 'You have liked comment successfully'
        }

    }

    async dislikeCommentReply(user, postId: string, commentId: string, replyId: string): Promise<MessageResponseDto> {
        const { userId, ...userData } = user;
        const post = await this.postRepo.findOne({
            where: {
                id: postId
            }
        });
        if (!post) {
            throw new NotFoundException(ErrorMessage.POST_NOT_FOUND);
        }
        const comment = await this.commentRepo.findOne({
            relations: ['replies', 'replies.childReplies'],
            where: {
                id: commentId
            }
        });
        console.log(comment)
        const replyPost = comment.replies.find((reply) => reply.id === replyId);
        if(!replyPost) {
            const childreplyPost = comment.replies.find(reply => reply.childReplies.find((reply) => reply.id === replyId));
            if (!childreplyPost) {
                throw new NotFoundException(ErrorMessage.COMMENT_NOT_FOUND);
            }
        }
        // console.log(!replyPost)
        if (!comment) {
            throw new NotFoundException(ErrorMessage.COMMENT_NOT_FOUND);
        }
        const reply = await this.replyRepository.findOne({
            relations: ['likedBy', 'dislikedBy'],
            where: {
                id: replyId
            }
        })

        if (reply.dislikedBy.find(dislikedByUser => dislikedByUser.id == userId)) {
            throw new ConflictException(ErrorMessage.DISLIKE_CONFLICT);
        }
        if (reply.likedBy.find((likedUser) => likedUser.id === userId)) {
            reply.likedBy = reply.likedBy.filter((userData) => {
                return userData.id !== userId;
            });
            reply.totalLikes -= 1;
        }
        reply.totalDisLikes += 1;
        reply.dislikedBy.push({ id: userId, ...userData });

        await this.replyRepository.save(reply);

        return {
            message: 'You have disliked comment successfully'
        }
    }
}
