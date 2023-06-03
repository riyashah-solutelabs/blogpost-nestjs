import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard, RolesGuard, SubscriptionGuard } from '../../auth/guards';
import { GetUser, Roles } from '../../auth/decorator';
import { CreateCommenttDto } from '../dto/create-comment.dto';
import { CommentService } from '../services/comment.service';
import { Constants } from '../../utils/constants';
import { ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOperation, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('Comment')
@ApiSecurity('JWT-Auth')
@UseGuards(RolesGuard, SubscriptionGuard)
@Controller('comment')
export class CommentController {
    constructor(private commentService: CommentService) {}

    @ApiOperation({ summary: 'add comment' })
    @ApiCreatedResponse({
        description: 'comment added successfully'
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @Roles(Constants.ROLES.NORMAL_ROLE)
    @Post(':postId')
    addComment(@GetUser() user, @Param('postId', ParseIntPipe) postId: number, @Body() comment: CreateCommenttDto ) {
        return this.commentService.addComment(user, postId, comment);
    }

    @ApiOperation({ summary: 'delete comment' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiNotFoundResponse({
        description: 'comment not found'
    })
    @ApiNoContentResponse({ description: 'comment deleted successfully' })
    @HttpCode(204)
    @Delete('posts/:postId/comments/:commentId')
    deleteComment(@GetUser() user, @Param('postId', ParseIntPipe) postId: number, @Param('commentId', ParseIntPipe) commentId: number) {
        return this.commentService.deleteComment(user, postId, commentId);
    }

    @ApiOperation({ summary: 'like comment' })
    @ApiCreatedResponse({
        description: 'comment liked successfully'
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiNotFoundResponse({
        description: 'comment/post not found'
    })
    @Roles(Constants.ROLES.NORMAL_ROLE)
    @Post('posts/:postId/comments/:commentId/like')
    likeComment(@GetUser('userId', ParseIntPipe) userId: number, @Param('postId', ParseIntPipe) postId: number, @Param('commentId', ParseIntPipe) commentId: number) {
        return this.commentService.likeComment(userId, postId, commentId);
    }

    @ApiOperation({ summary: 'dislike comment' })
    @ApiCreatedResponse({
        description: 'comment disliked successfully'
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiNotFoundResponse({
        description: 'comment/post not found'
    })
    @Roles(Constants.ROLES.NORMAL_ROLE)
    @Post('posts/:postId/comments/:commentId/dislike')
    dislikeComment(@GetUser('userId', ParseIntPipe) userId: number, @Param('postId', ParseIntPipe) postId: number, @Param('commentId', ParseIntPipe) commentId: number) {
        return this.commentService.dislikeComment(userId, postId, commentId);
    }
}
