import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard, RolesGuard, SubscriptionGuard } from '../../auth/guards';
import { GetUser, Roles } from '../../auth/decorator';
import { CreateCommenttDto } from '../../dtos';
import { ReplyService } from '../services/reply.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { User } from 'src/entities';
import { CreateReplyDto } from 'src/dtos/reply.dto';

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
}
