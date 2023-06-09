import { Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { GetUser } from '../../decorator/get-user.decorator';
import { JwtGuard, RolesGuard } from '../../auth/guards';
import { Constants } from '../../utils/constants';
import { Roles } from '../../decorator';
import { UserStatusGuard } from '../../auth/guards/user-status.guard';
import { AdminService } from '../services/admin.service';
import { ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { MessageResponseDto, PostResponseDto, UserResponseDto } from 'src/response';

@ApiTags('Admin')
@ApiSecurity('JWT-Auth')
// @UseGuards(RolesGuard, UserStatusGuard)
@Controller('admin')
export class AdminController {
    constructor(private adminService: AdminService) {}

    @ApiOperation({
        summary: 'reterive users'
    })
    @ApiOkResponse({
        description: 'reterive users successfully'
    })
    @Roles(Constants.ROLES.ADMIN_ROLE, Constants.ROLES.SUPERADMIN_ROLE)
    @Get()
    getUsers(): Promise<UserResponseDto[]> {
        return this.adminService.getUsers()
    }

    @ApiOperation({
        summary: 'reterive posts'
    })
    @ApiOkResponse({
        description: 'reterive posts successfully'
    })
    @Roles(Constants.ROLES.ADMIN_ROLE, Constants.ROLES.SUPERADMIN_ROLE)
    @Get('/posts')
    getAllPosts(): Promise<PostResponseDto[]> {
        return this.adminService.getAllPosts()
    }

    @ApiOperation({
        summary: 'reterive posts by userid'
    })
    @ApiOkResponse({
        description: 'reterive post successfully'
    })
    @ApiNotFoundResponse({
        description: 'user not found'
    })
    @Roles(Constants.ROLES.ADMIN_ROLE, Constants.ROLES.SUPERADMIN_ROLE)
    @Get('/:userId/posts')
    getPostByUserId(@Param('userId', ParseIntPipe) userId: number): Promise<PostResponseDto[]> {
        return this.adminService.getPostByUserId(userId)
    }

    @ApiOperation({
        summary: 'reterive post by post id'
    })
    @ApiOkResponse({
        description: 'reterive post successfully'
    })
    @ApiNotFoundResponse({
        description: 'post not found'
    })
    @Roles(Constants.ROLES.ADMIN_ROLE, Constants.ROLES.SUPERADMIN_ROLE)
    @Get('/posts/:postId')
    getPostById(@Param('postId', ParseIntPipe) postId: number): Promise<PostResponseDto> {
        return this.adminService.getPostById(postId)
    }

    @ApiOperation({ summary: 'delete post only if totalDisLikes > 15' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiNotFoundResponse({
        description: 'post not found'
    })
    @ApiNoContentResponse({ description: 'post deleted successfully' })
    @HttpCode(204)
    @Roles(Constants.ROLES.ADMIN_ROLE, Constants.ROLES.SUPERADMIN_ROLE)
    @Delete('/deletepost/:postId')
    adminDeletePost(@Param('postId', ParseIntPipe) postId: number): Promise<MessageResponseDto> {
        return this.adminService.adminDeletePost(postId);
    }

    @ApiOperation({ summary: 'delete user' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiNotFoundResponse({
        description: 'user not found'
    })
    @ApiNoContentResponse({ description: 'user deleted successfully' })
    @Roles(Constants.ROLES.ADMIN_ROLE, Constants.ROLES.SUPERADMIN_ROLE)
    @HttpCode(204)
    @Delete('/user/:userId')
    DeleteUsers(@GetUser() user, @Param('userId', ParseIntPipe) userId: number): Promise<MessageResponseDto> {
        return this.adminService.deleteUser(userId, user);
    }

    @ApiOperation({
        summary: 'update user status(active, inactive)'
    })
    @ApiCreatedResponse({
        description: 'user status updated successfully'
    })
    @Roles(Constants.ROLES.ADMIN_ROLE, Constants.ROLES.SUPERADMIN_ROLE)
    @Patch('/userstatus/:userId')
    changeUserStatus(@GetUser() user, @Param('userId', ParseIntPipe) userId: number): Promise<MessageResponseDto> {
        return this.adminService.changeUserStatus(userId, user);
    }

}


