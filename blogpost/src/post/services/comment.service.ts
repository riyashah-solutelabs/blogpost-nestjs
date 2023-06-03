import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommenttDto } from '../dto/create-comment.dto';
import { CommentRepository } from '../repository/comment.repo';
import { UserService } from 'src/user/services/user.service';
import { PostService } from './post.service';
import { Constants } from 'src/utils/constants';

@Injectable()
export class CommentService {
    constructor(
        private commentRepo: CommentRepository,
        private userService: UserService,
        private postService: PostService
    ) { }

    async addComment(user, postId: number, createcomment: CreateCommenttDto) {
        const userData = await this.userService.findUserById(user.userId)
        const post = await this.postService.getPostById(postId);
        if(!post || !userData) {
            throw new NotFoundException('not found');
        }
        
        const comment = await this.commentRepo.create(createcomment);
        comment.user = userData;
        comment.post = post;
        comment.createdBy = userData.name;
        
        return this.commentRepo.save(comment);
    }

    async deleteComment(user, postId, commentId) {
        const post = await this.postService.getPostById(postId);
        if(!post){
            throw new NotFoundException('post not found')
        }
        const comment = await this.commentRepo.findOne({
            relations: ['user'],
            where: {
                id: commentId
            }
        })
        if(!comment || !post.comments.find((comment) => comment.id === commentId)) {
            throw new NotFoundException('Comment Not Found')
        }

        console.log(post.author.id)
        if(post.author.id === user.userId || comment.user.id === user.userId || user.role === Constants.ROLES.ADMIN_ROLE || user.role === Constants.ROLES.SUPERADMIN_ROLE) {
            return await this.commentRepo.delete(commentId)
        }else{
            throw new ForbiddenException('You are not allowed to delete this comment');
        }
    }

    async likeComment(userId: number, postId: number, commentId: number) {
        const user = await this.userService.findUserById(userId);
        const post = await this.postService.getPostById(postId);
        if(!post) {
            throw new NotFoundException('post not found');
        }
        const comment = await this.commentRepo.findOne({
            relations: ['likedBy', 'dislikedBy'],
            where: {
                id: commentId
            }
        });
        if(!comment) {
            throw new NotFoundException('comment not found');
        }

        if(comment.likedBy.find((likedUser) => likedUser.id === user.id)){
            throw new ConflictException('You have already liked this post.');
        }
        if (comment.dislikedBy.find((dislikedUser) => dislikedUser.id === user.id)) {
            comment.dislikedBy = comment.dislikedBy.filter((userId) => {
              return userId !== user ;
            });
            comment.totalDisLikes -= 1;
          }
         comment.totalLikes += 1;
         comment.likedBy.push(user);
      
          await this.commentRepo.save(comment);

          return {
            message: 'You have liked comment successfully'
          }

    }

    async dislikeComment(userId: number, postId: number, commentId: number) {
        const user = await this.userService.findUserById(userId);
        const post = await this.postService.getPostById(postId);
        if(!post) {
            throw new NotFoundException('post not found');
        }
        const comment = await this.commentRepo.findOne({
            relations: ['likedBy', 'dislikedBy'],
            where: {
                id: commentId
            }
        });
        if(!comment) {
            throw new NotFoundException('comment not found');
        }
        
        if(comment.dislikedBy.find((likedUser) => likedUser.id === user.id)){
            throw new ConflictException('You have already disliked this post.');
        }
        if (comment.likedBy.find((likedUser) => likedUser.id === user.id)) {
            comment.likedBy = comment.likedBy.filter((userId) => {
              return userId !== user ;
            });
            comment.totalLikes -= 1;
          }

         comment.totalDisLikes += 1;
         comment.dislikedBy.push(user);
      
          await this.commentRepo.save(comment);

          return {
            message: 'You have disliked comment successfully'
          }

    }

}
