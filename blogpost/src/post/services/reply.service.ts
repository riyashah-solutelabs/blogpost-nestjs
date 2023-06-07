import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommenttDto } from '../../dtos';
import { CommentRepository } from '../repository/comment.repo';
import { PostService } from './post.service';
import { Constants } from 'src/utils/constants';
import { Reply } from 'src/entities/reply.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReplyDto } from 'src/dtos/reply.dto';
import { PostRepository } from '../repository/post.repo';

@Injectable()
export class ReplyService {

    constructor(
        private commentRepo: CommentRepository,
        private postRepo: PostRepository,
        @InjectRepository(Reply)
        private replyRepository: Repository<Reply>,
    ) { }

    async addReplyToComment(user, postId: number, commentId: number, createReply: CreateReplyDto): Promise<Reply> {
        const post = await this.postRepo.findOne({
            where: {
                id: postId
            }
        });
        if (!post) {
            throw new NotFoundException('post not found')
        }
        const comment = await this.commentRepo.findOne({
            where: {
                id: commentId
            }
        });
        if (!comment || !post.comments.find((comment) => comment.id == commentId)) {
            throw new NotFoundException('Comment Not Found')
        }

        const reply = new Reply();
        reply.user = user.userId;
        reply.description = createReply.description;
        reply.createdBy = user.name;
        reply.comment = comment;

        return this.replyRepository.save(reply);
    }

    async createReplyToChild(user, postId: number, commentId: number, parentId: number, createReplyDto: CreateReplyDto) {
        const post = await this.postRepo.findOne({
            where: {
                id: postId
            }
        });
        if (!post) {
            throw new NotFoundException('post not found')
        }
        const comment = await this.commentRepo.findOne({
            where: {
                id: commentId
            }
        });
        if (!comment || !post.comments.find((comment) => comment.id == commentId)) {
            throw new NotFoundException('Comment Not Found')
        }
        // First, retrieve the parent reply
        const parentReply = await this.replyRepository.findOne({
            where: {
                id: parentId
            }
        });

        if (!parentReply) {
            throw new NotFoundException('Parent reply not found');
        }

        // console.log(parentReply);
        // Create the new reply and associate it with the parent reply
        const newReply = this.replyRepository.create({
            ...createReplyDto,
            parentReply,
        });
        newReply.createdBy = user.name;
        newReply.user = user.userId;

        // Save the new reply
        const createdReply = await this.replyRepository.save(newReply);

        return createdReply;
    }

    async addChildReplyToChild(
        user,
        postId: number,
        commentId: number,
        parentId: number,
        childId,
        createReplyDto: CreateReplyDto,
    ): Promise<{ message: string; }> {

        const post = await this.postRepo.findOne({
            where: {
                id: postId
            }
        });
        if (!post) {
            throw new NotFoundException('post not found')
        }
        const comment = await this.commentRepo.findOne({
            where: {
                id: commentId
            }
        });
        if (!comment || !post.comments.find((comment) => comment.id == commentId)) {
            throw new NotFoundException('Comment Not Found')
        }
        // First, retrieve the parent reply
        const parentReply = await this.replyRepository.findOne({
            relations: ['childReplies'],
            where: {
                id: parentId
            }
        });

        if (!parentReply || !parentReply.childReplies.find((comment) => comment.id == childId)) {
            throw new NotFoundException('child reply not found');
        }
        // return parentReply;

        // Create the new reply and associate it with the parent reply
        const newReply = this.replyRepository.create({
            ...createReplyDto,
            parentReply,
        });
        newReply.createdBy = user.name;
        newReply.user = user.userId;
        newReply.childReply = childId;

        // // Save the new reply
        await this.replyRepository.save(newReply);

        return {
            message: 'reply added'
        };


    }

    async deleteChildReply(user, postId: number, commentId: number, replyId: number, childReplyId: number): Promise<void> {

        const post = await this.postRepo.findOne({
            where: {
                id: postId
            }
        });
        if (!post) {
            throw new NotFoundException('post not found')
        }
        const comment = await this.commentRepo.findOne({
            where: {
                id: commentId
            }
        });
        if (!comment || !post.comments.find((comment) => comment.id == commentId)) {
            throw new NotFoundException('Comment Not Found')
        }

        // Find the parent reply
        const parentReply = await this.replyRepository.findOne({
            relations: ['childReplies', 'childReplies.user', 'user'],
            where: {
                id: replyId
            }
        });

        if (!parentReply) {
            throw new NotFoundException('Parent reply not found');
        }

        // Find the child reply to delete
        const childReplyIndex = parentReply.childReplies.findIndex(
            (reply) => reply.id === childReplyId,
        );

        if (childReplyIndex === -1) {
            throw new NotFoundException('Child reply not found');
        }
    
        const valid = parentReply.childReplies[childReplyIndex].user.id == user.userId;
        if (parentReply.user.id == user.userId || valid || user.role === Constants.ROLES.ADMIN_ROLE || user.role === Constants.ROLES.SUPERADMIN_ROLE) {
            // Remove the child reply from the parent reply's childReplies array
            parentReply.childReplies.splice(childReplyIndex, 1);

            // Save the parent reply to update the childReplies array
            await this.replyRepository.save(parentReply);

            // Delete the child reply from the database
            await this.replyRepository.delete(childReplyId);
        } else {
            throw new ForbiddenException('You are not allowed to delete this comment');
        }
    }
    async deleteCommentReply(user, postId: number, commentId: number, replyId: number): Promise<void> {

        const post = await this.postRepo.findOne({
            where: {
                id: postId
            }
        });
        if (!post) {
            throw new NotFoundException('post not found')
        }
        const comment = await this.commentRepo.findOne({
            relations: ['replies'],
            where: {
                id: commentId
            }
        });
        console.log(comment)
        const valid = post.comments.find((comment) => comment.replies.find(reply => reply.id == replyId));
        if (!comment || !post.comments.find((comment) => comment.id == commentId) || !valid){
            throw new NotFoundException('Comment Not Found')
        }

        // Find the parent reply
        const parentReply = await this.replyRepository.findOne({
            relations: ['user'],
            where: {
                id: replyId
            }
        });

        if (!parentReply) {
            throw new NotFoundException('Parent reply not found');
        }

        if (parentReply.user.id === user.userId || user.role === Constants.ROLES.ADMIN_ROLE || user.role === Constants.ROLES.SUPERADMIN_ROLE) {
            await this.replyRepository.delete(replyId)
           
        } else {
            throw new ForbiddenException('You are not allowed to delete this comment');
        }
    }



}
