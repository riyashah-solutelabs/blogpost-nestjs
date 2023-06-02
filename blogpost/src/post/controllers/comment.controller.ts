import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard, RolesGuard, SubscriptionGuard } from '../../auth/guards';
import { GetUser, Roles } from '../../auth/decorator';
import { CreateCommenttDto } from '../dto/create-comment.dto';
import { CommentService } from '../services/comment.service';

@UseGuards(JwtGuard, RolesGuard, SubscriptionGuard)
@Controller('comment')
export class CommentController {
    constructor(private commentService: CommentService) {}

    @Roles('user')
    @Post(':postId')
    addComment(@GetUser() user, @Param('postId', ParseIntPipe) postId: number, @Body() comment: CreateCommenttDto ) {
        return this.commentService.addComment(user, postId, comment);
    }

    @Roles('user')
    @Delete('posts/:postId/comments/:commentId')
    deleteComment(@GetUser('userId', ParseIntPipe) userId: number, @Param('postId', ParseIntPipe) postId: number, @Param('commentId', ParseIntPipe) commentId: number) {
        return this.commentService.deleteComment(userId, postId, commentId);
    }

    @Roles('user')
    @Post('posts/:postId/comments/:commentId/like')
    likeComment(@GetUser('userId', ParseIntPipe) userId: number, @Param('postId', ParseIntPipe) postId: number, @Param('commentId', ParseIntPipe) commentId: number) {
        return this.commentService.likeComment(userId, postId, commentId);
    }

    @Roles('user')
    @Post('posts/:postId/comments/:commentId/dislike')
    dislikeComment(@GetUser('userId', ParseIntPipe) userId: number, @Param('postId', ParseIntPipe) postId: number, @Param('commentId', ParseIntPipe) commentId: number) {
        return this.commentService.dislikeComment(userId, postId, commentId);
    }
}
