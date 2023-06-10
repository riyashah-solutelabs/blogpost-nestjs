import { Body, Controller, Delete, HttpCode, Param, ParseIntPipe, Post } from '@nestjs/common';
import { GetUser, Roles } from '../../decorator';
import { CreateCommenttDto } from '../../dtos';
import { CommentService } from '../services/comment.service';
import { Constants } from '../../utils/constants';
import { ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOperation, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CommentResponseDto, MessageResponseDto } from 'src/response';

@ApiTags('Comment')
@ApiSecurity('JWT-Auth')
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
    addComment(@GetUser() user, @Param('postId') postId: string, @Body() comment: CreateCommenttDto ): Promise<CommentResponseDto> {
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
    deleteComment(@GetUser() user, @Param('postId') postId: string, @Param('commentId') commentId: string): Promise<MessageResponseDto> {
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
    likeComment(@GetUser() user, @Param('postId') postId: string, @Param('commentId') commentId: string): Promise<MessageResponseDto> {
        return this.commentService.likeComment(user, postId, commentId);
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
    dislikeComment(@GetUser() user, @Param('postId') postId: string, @Param('commentId') commentId: string): Promise<MessageResponseDto> {
        return this.commentService.dislikeComment(user, postId, commentId);
    }
}
