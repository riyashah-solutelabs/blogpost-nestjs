import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard, RolesGuard, SubscriptionGuard } from '../../auth/guards';
import { GetUser, Roles } from '../../auth/decorator';
import { CreateCommenttDto } from '../../dtos';
import { ReplyService } from '../services/reply.service';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOperation, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { User } from 'src/entities';
import { CreateReplyDto } from 'src/dtos/reply.dto';
import { Constants } from 'src/utils/constants';

@ApiTags('Reply')
@ApiSecurity('JWT-Auth')
@Controller('reply')
export class ReplyController {
    constructor(private replyService: ReplyService) { }
    @Post('post/:postid/comment/:id/replies')
    async addReply(
        @GetUser() user,
        @Param('postid') postId: number,
        @Param('id') commentId: number,
        @Body() createReply: CreateReplyDto,
    ) {
        const reply = await this.replyService.addReplyToComment(user,postId, commentId, createReply);
        return reply;
    }

    @Post('post/:postid/comment/:id/replies/:replyid')
    async createReply(
        @GetUser() user,
        @Param('postid') postId: number,
        @Param('id') commentId: number,
        @Param('replyid') parentId: number,
        @Body() createReply: CreateReplyDto,
    ) {
        const reply = await this.replyService.createReplyToChild(user,postId, commentId, parentId, createReply);
        return reply;
    }

    @Post('post/:postid/comment/:id/replies/:replyid/child/:childid')
    async addReplyToChildReply(
        @GetUser() user,
        @Param('postid') postId: number,
        @Param('id') commentId: number,
        @Param('replyid') parentId: number,
        @Param('childid', ParseIntPipe) childId: number,
        @Body() createReply: CreateReplyDto,
    ) {
        const reply = await this.replyService.addChildReplyToChild(user,postId, commentId, parentId,childId, createReply);
        return reply;
    }

    @Delete('post/:postid/comment/:id/replies/:replyid/child/:childid')
    async DeleteReplyToChildReply(
        @GetUser() user,
        @Param('postid') postId: number,
        @Param('id') commentId: number,
        @Param('replyid') parentId: number,
        @Param('childid', ParseIntPipe) childId: number
    ) {
        const reply = await this.replyService.deleteChildReply(user,postId, commentId, parentId,childId);
        return reply;
    }

    @Delete('post/:postid/comment/:id/replies/:replyid/')
    async deleteReplyToCommentReply(
        @GetUser() user,
        @Param('postid') postId: number,
        @Param('id') commentId: number,
        @Param('replyid') parentId: number,
    ) {
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
    likeCommentReply(@GetUser() user, @Param('postId', ParseIntPipe) postId: number, @Param('commentId', ParseIntPipe) commentId: number, @Param('replyId', ParseIntPipe) replyId: number) {
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
    dislikeCommentReply(@GetUser() user, @Param('postId', ParseIntPipe) postId: number, @Param('commentId', ParseIntPipe) commentId: number, @Param('replyId', ParseIntPipe) replyId: number) {
        return this.replyService.dislikeCommentReply(user, postId, commentId, replyId);
    }
}
