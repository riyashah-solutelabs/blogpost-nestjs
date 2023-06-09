import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard, RolesGuard, SubscriptionGuard } from '../../auth/guards';
import { GetUser, Roles } from '../../decorator';
import { CreateCommenttDto } from '../../dtos';
import { ReplyService } from '../services/reply.service';
import { ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOperation, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { User } from 'src/entities';
import { CreateReplyDto } from 'src/dtos/reply.dto';
import { Constants } from 'src/utils/constants';
import { MessageResponseDto, ReplyResponseDto } from 'src/response';

@ApiTags('Reply')
@ApiSecurity('JWT-Auth')
@Controller('reply')
export class ReplyController {
    constructor(private replyService: ReplyService) { }

    @ApiOperation({ summary: 'add comment reply' })
    @ApiCreatedResponse({
        description: 'comment added successfully'
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @Roles(Constants.ROLES.NORMAL_ROLE)
    @Post('post/:postid/comment/:id/replies')
    async addReply(
        @GetUser() user,
        @Param('postid', ParseIntPipe) postId: number,
        @Param('id', ParseIntPipe) commentId: number,
        @Body() createReply: CreateReplyDto,
    ): Promise<ReplyResponseDto> {
        const reply = await this.replyService.addReplyToComment(user,postId, commentId, createReply);
        return reply;
    }


    @ApiOperation({ summary: 'add reply' })
    @ApiCreatedResponse({
        description: 'comment added successfully'
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @Roles(Constants.ROLES.NORMAL_ROLE)
    @Post('post/:postid/comment/:id/replies/:replyid')
    async createReply(
        @GetUser() user,
        @Param('postid', ParseIntPipe) postId: number,
        @Param('id', ParseIntPipe) commentId: number,
        @Param('replyid', ParseIntPipe) parentId: number,
        @Body() createReply: CreateReplyDto,
    ): Promise<ReplyResponseDto> {
        const reply = await this.replyService.createReplyToChild(user,postId, commentId, parentId, createReply);
        return reply;
    }

    @ApiOperation({ summary: 'delete comment' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiNotFoundResponse({
        description: 'comment not found'
    })
    @ApiNoContentResponse({ description: 'comment deleted successfully' })
    @HttpCode(204)
    @Delete('post/:postid/comment/:id/replies/:replyid/')
    async deleteReplyToCommentReply(
        @GetUser() user,
        @Param('postid', ParseIntPipe) postId: number,
        @Param('id', ParseIntPipe) commentId: number,
        @Param('replyid', ParseIntPipe) parentId: number,
    ): Promise<MessageResponseDto> {
        const reply = await this.replyService.deleteCommentReply(user,postId, commentId, parentId);
        return reply;
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
    @Post('posts/:postId/comments/:commentId/reply/:replyId/like')
    likeCommentReply(@GetUser() user, @Param('postId', ParseIntPipe) postId: number, @Param('commentId', ParseIntPipe) commentId: number, @Param('replyId', ParseIntPipe) replyId: number): Promise<MessageResponseDto> {
        return this.replyService.likeCommentReply(user, postId, commentId, replyId);
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
    @Post('posts/:postId/comments/:commentId/reply/:replyId/dislike')
    dislikeCommentReply(@GetUser() user, @Param('postId', ParseIntPipe) postId: number, @Param('commentId', ParseIntPipe) commentId: number, @Param('replyId', ParseIntPipe) replyId: number): Promise<MessageResponseDto> {
        return this.replyService.dislikeCommentReply(user, postId, commentId, replyId);
    }
}
