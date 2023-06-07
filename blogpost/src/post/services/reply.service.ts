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

    async createReplyToChild(user, postId: number, commentId: number, parentId, createReplyDto: CreateReplyDto) {
        const post = await this.postRepo.findOne({
            where: {
                id: postId
            }
        });
        if (!post) {
          throw new NotFoundException('Post not found');
        }
      
        const comment = await this.commentRepo.findOne({
            relations: ['replies'],
            where:{
                id: commentId
            },
        });
        if (!comment) {
          throw new NotFoundException('Comment not found');
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
            throw new NotFoundException('Parent reply not found');
          }
        }
      
        const newReply = this.replyRepository.create({
          ...createReplyDto,
          createdBy: user.name,
          user: user.userId,
          comment,
          parentReply,
        });
      
        if (parentReply) {
          parentReply.childReplies.push(newReply);
          await this.replyRepository.save(parentReply);
        }
      
        const createdReply = await this.replyRepository.save(newReply);
      
        return createdReply;
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


    async likeCommentReply(user, postId: number, commentId: number, replyId: number) {
        const { userId, ...userData } = user;
        const post = await this.postRepo.findOne({
            where: {
                id: postId
            }
        });
        if (!post) {
            throw new NotFoundException('post not found');
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
                throw new NotFoundException('comment not found');
            }
        }
        // console.log(!replyPost)
        if (!comment) {
            throw new NotFoundException('comment not found');
        }
        const reply = await this.replyRepository.findOne({
            relations: ['likedBy', 'dislikedBy'],
            where: {
                id: replyId
            }
        })

        if (reply.likedBy.find(likedByUser => likedByUser.id == userId)) {
            throw new ConflictException('You have already liked this post.');
        }
        if (reply.dislikedBy.find((dislikedUser) => dislikedUser.id === userId)) {
            reply.dislikedBy = reply.dislikedBy.filter((userData) => {
                return userData.id !== userId;
            });
            console.log("dislikedBy", reply.dislikedBy)
            reply.totalDisLikes -= 1;
        }
        reply.totalLikes += 1;
        reply.likedBy.push({ id: userId, ...userData });

        const l = await this.replyRepository.save(reply);
        console.log(l)

        return {
            message: 'You have liked comment successfully'
        }

    }

    async dislikeCommentReply(user, postId: number, commentId: number, replyId: number) {
        const { userId, ...userData } = user;
        const post = await this.postRepo.findOne({
            where: {
                id: postId
            }
        });
        if (!post) {
            throw new NotFoundException('post not found');
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
                throw new NotFoundException('comment not found');
            }
        }
        // console.log(!replyPost)
        if (!comment) {
            throw new NotFoundException('comment not found');
        }
        const reply = await this.replyRepository.findOne({
            relations: ['likedBy', 'dislikedBy'],
            where: {
                id: replyId
            }
        })

        if (reply.dislikedBy.find(dislikedByUser => dislikedByUser.id == userId)) {
            throw new ConflictException('You have already disliked this post.');
        }
        if (reply.likedBy.find((likedUser) => likedUser.id === userId)) {
            reply.likedBy = reply.likedBy.filter((userData) => {
                return userData.id !== userId;
            });
            reply.totalLikes -= 1;
        }
        reply.totalDisLikes += 1;
        reply.dislikedBy.push({ id: userId, ...userData });

        const l = await this.replyRepository.save(reply);
        console.log(l)

        return {
            message: 'You have disliked comment successfully'
        }

    }





}
