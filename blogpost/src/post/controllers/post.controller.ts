import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { PostService } from '../services/post.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { JwtGuard, RolesGuard, SubscriptionGuard, UserStatusGuard } from '../../auth/guards';
import { GetUser, Roles } from '../../auth/decorator';
import { Constants } from '../../utils/constants';

@UseGuards(JwtGuard, RolesGuard, UserStatusGuard, SubscriptionGuard)
@Controller('post')
export class PostController {
    constructor(private postService: PostService) {}

    @Roles(Constants.ROLES.NORMAL_ROLE)
    @Post()
    createPost(@GetUser('userId', ParseIntPipe) userId: number, @Body() createPost: CreatePostDto) {
        console.log(createPost)
        return this.postService.createPost(userId, createPost)
    }

    @Get()
    getPosts() {
        return this.postService.getPosts()
    }

    
    @Get(':postId')
    getById(@Param('postId', ParseIntPipe) postId: number) {
        console.log(typeof postId)
        return this.postService.getPostById(postId)
    }

    @Roles(Constants.ROLES.NORMAL_ROLE)
    @Post('likes/:postId')
    likePost(@GetUser('userId', ParseIntPipe) userId: number, @Param('postId', ParseIntPipe) postId: number) {
        return this.postService.postLike(userId, postId)
    }

    @Roles(Constants.ROLES.NORMAL_ROLE)
    @Post('dislikes/:postId')
    dislikePost(@GetUser('userId', ParseIntPipe) userId: number, @Param('postId', ParseIntPipe) postId: number) {
        return this.postService.postDisLike(userId, postId)
    }

    @Roles(Constants.ROLES.NORMAL_ROLE)
    @Patch('update/:postId')
    updatePost(@GetUser('userId', ParseIntPipe) userId: number, @Param('postId', ParseIntPipe) postId: number,
        @Body() post: Partial<CreatePostDto>
    ) {
        return this.postService.updatePost(userId, postId, post);
    }

    @Roles(Constants.ROLES.NORMAL_ROLE)
    @Delete(':postId')
    deletePost(@GetUser() user, @Param('postId', ParseIntPipe) postId: number) {
        return this.postService.deletePost(user, postId);
    }
}
