import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { PostService } from '../services/post.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { JwtGuard, RolesGuard, SubscriptionGuard } from '../../auth/guards';
import { GetUser, Roles } from '../../auth/decorator';
import { CreateCommenttDto } from '../dto/create-comment.dto';

@UseGuards(JwtGuard, RolesGuard, SubscriptionGuard)
@Controller('post')
export class PostController {
    constructor(private postService: PostService) {}

    @Roles('user')
    // @UseGuards(RolesGuard)
    @Post()
    createPost(@GetUser('userId', ParseIntPipe) userId: number, @Body() createPost: CreatePostDto) {
        console.log(createPost)
        return this.postService.createPost(userId, createPost)
    }

    @Roles('user', 'admin')
    // @UseGuards(RolesGuard, SubscriptionGuard)
    @Get()
    getPosts() {
        return this.postService.getPosts()
    }

    @Roles('user')
    // @UseGuards(RolesGuard)
    @Get(':postId')
    getById(@Param('postId', ParseIntPipe) postId: number) {
        console.log(typeof postId)
        return this.postService.getPostById(postId)
    }

    @Roles('user')
    // @UseGuards(RolesGuard)
    @Post('likes/:postId')
    likePost(@GetUser('userId', ParseIntPipe) userId: number, @Param('postId', ParseIntPipe) postId: number) {
        return this.postService.postLike(userId, postId)
    }

    @Roles('user')
    // @UseGuards(RolesGuard)
    @Post('dislikes/:postId')
    dislikePost(@GetUser('userId', ParseIntPipe) userId: number, @Param('postId', ParseIntPipe) postId: number) {
        return this.postService.postDisLike(userId, postId)
    }

    @Roles('user')
    // @UseGuards(RolesGuard)
    @Patch('update/:postId')
    updatePost(@GetUser('userId', ParseIntPipe) userId: number, @Param('postId', ParseIntPipe) postId: number,
        @Body() post: Partial<CreatePostDto>
    ) {
        return this.postService.updatePost(userId, postId, post);
    }

    @Roles('user')
    // @UseGuards(RolesGuard)
    @Delete(':postId')
    deletePost(@GetUser() user, @Param('postId', ParseIntPipe) postId: number) {
        return this.postService.deletePost(user, postId);
    }
}
