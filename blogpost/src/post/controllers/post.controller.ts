import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { PostService } from '../services/post.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { JwtGuard, RolesGuard, SubscriptionGuard, UserStatusGuard } from '../../auth/guards';
import { GetUser, Roles } from '../../auth/decorator';
import { Constants } from '../../utils/constants';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('Post')
@ApiSecurity('JWT-Auth')
@UseGuards(RolesGuard, UserStatusGuard, SubscriptionGuard)
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
    getPosts() {
        return this.postService.getPosts()
    }


    @ApiOperation({ summary: 'Get posts by id' })
    @ApiOkResponse({ description: 'post retrieved successfully', type: CreatePostDto })
    @Get(':postId')
    getById(@Param('postId', ParseIntPipe) postId: number) {
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
    likePost(@GetUser('userId', ParseIntPipe) userId: number, @Param('postId', ParseIntPipe) postId: number) {
        return this.postService.postLike(userId, postId)
    }

    @ApiOperation({ summary: 'dislike post' })
    @ApiCreatedResponse({
        description: 'post disliked successfully'
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiConflictResponse({ description: 'you have already disliked this post' })
    @Roles(Constants.ROLES.NORMAL_ROLE)
    @Post('dislikes/:postId')
    dislikePost(@GetUser('userId', ParseIntPipe) userId: number, @Param('postId', ParseIntPipe) postId: number) {
        return this.postService.postDisLike(userId, postId)
    }

    @ApiOperation({ summary: 'update post' })
    @ApiCreatedResponse({
        description: 'post updated successfully',
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @Roles(Constants.ROLES.NORMAL_ROLE)
    @Patch('update/:postId')
    updatePost(@GetUser('userId', ParseIntPipe) userId: number, @Param('postId', ParseIntPipe) postId: number,
        @Body() post: Partial<CreatePostDto>
    ) {
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
    deletePost(@GetUser() user, @Param('postId', ParseIntPipe) postId: number) {
        return this.postService.deletePost(user, postId);
    }
}
