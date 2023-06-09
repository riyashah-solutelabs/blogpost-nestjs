import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PostService } from '../services/post.service';
import { CreatePostDto, UpdatePostDto } from '../../dtos';
import { GetUser, Roles } from '../../decorator';
import { Constants } from '../../utils/constants';
import { ApiConflictResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { User } from '../../entities';
import { MessageResponseDto, PostResponseDto } from 'src/response';

@ApiTags('Post')
@ApiSecurity('JWT-Auth')
@Controller('post')
export class PostController {
    constructor(private postService: PostService) { }

    @ApiOperation({ summary: 'create posts' })
    @ApiCreatedResponse({
        description: 'post created successfully'
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @Roles(Constants.ROLES.NORMAL_ROLE)
    @Post()
    createPost(@GetUser('userId', ParseIntPipe) userId: number, @Body() createPost: CreatePostDto) {
        console.log(createPost)
        return this.postService.createPost(userId, createPost)
    }

    @ApiOperation({ summary: 'Get all posts' })
    @ApiOkResponse({ description: 'posts retrieved successfully', type: CreatePostDto })
    @Get()
    getPosts(): Promise<PostResponseDto[]> {
        return this.postService.getPosts()
    }


    @ApiOperation({ summary: 'Get posts by id' })
    @ApiOkResponse({ description: 'post retrieved successfully', type: CreatePostDto })
    @Get(':postId')
    getById(@Param('postId', ParseIntPipe) postId: number): Promise<PostResponseDto> {
        console.log(typeof postId)
        return this.postService.getPostById(postId)
    }

    @ApiOperation({ summary: 'like post' })
    @ApiCreatedResponse({
        description: 'post liked successfully'
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiConflictResponse({ description: 'you have already liked this post' })
    @Roles(Constants.ROLES.NORMAL_ROLE)
    @Post('likes/:postId')
    likePost(@GetUser() user, @Param('postId', ParseIntPipe) postId: number): Promise<MessageResponseDto> {
        return this.postService.postLike(user, postId)
    }

    @ApiOperation({ summary: 'dislike post' })
    @ApiCreatedResponse({
        description: 'post disliked successfully'
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiConflictResponse({ description: 'you have already disliked this post' })
    @Roles(Constants.ROLES.NORMAL_ROLE)
    @Post('dislikes/:postId')
    dislikePost(@GetUser() user: User, @Param('postId', ParseIntPipe) postId: number): Promise<MessageResponseDto> {
        return this.postService.postDisLike(user, postId)
    }

    @ApiOperation({ summary: 'update post' })
    @ApiCreatedResponse({
        description: 'post updated successfully',
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @Roles(Constants.ROLES.NORMAL_ROLE)
    @Patch('update/:postId')
    updatePost(@GetUser('userId', ParseIntPipe) userId: number, @Param('postId', ParseIntPipe) postId: number,
        @Body() post: UpdatePostDto
    ): Promise<PostResponseDto> {
        return this.postService.updatePost(userId, postId, post);
    }

    @ApiOperation({ summary: 'delete post' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiNotFoundResponse({
        description: 'post not found'
    })
    @ApiNoContentResponse({ description: 'Post deleted successfully' })
    @Roles(Constants.ROLES.NORMAL_ROLE)
    @HttpCode(204)
    @Delete(':postId')
    deletePost(@GetUser() user, @Param('postId', ParseIntPipe) postId: number): Promise<MessageResponseDto> {
        return this.postService.deletePost(user, postId);
    }

    @ApiOperation({ summary: 'search post by title' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @Roles(Constants.ROLES.NORMAL_ROLE)
    async searchPostByTitle(@Query('title') title: string): Promise<PostResponseDto[]> {
        return await this.postService.searchByTitle(title);
    }
}
