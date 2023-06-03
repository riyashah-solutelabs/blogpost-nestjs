import { Controller, Delete, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { GetUser } from '../../auth/decorator/get-user.decorator';
import { JwtGuard, RolesGuard } from '../../auth/guards';
import { Constants } from '../../utils/constants';
import { Roles } from '../../auth/decorator';
import { UserStatusGuard } from '../../auth/guards/user-status.guard';
import { AdminService } from '../services/admin.service';

@UseGuards(JwtGuard, RolesGuard, UserStatusGuard)
@Controller('admin')
export class AdminController {
    constructor(private adminService: AdminService) {}

    @Roles(Constants.ROLES.ADMIN_ROLE, Constants.ROLES.SUPERADMIN_ROLE)
    @Get()
    getUsers() {
        return this.adminService.getUsers()
    }

    @Roles(Constants.ROLES.ADMIN_ROLE, Constants.ROLES.SUPERADMIN_ROLE)
    @Get('/posts')
    getAllPosts() {
        return this.adminService.getAllPosts()
    }

    @Roles(Constants.ROLES.ADMIN_ROLE, Constants.ROLES.SUPERADMIN_ROLE)
    @Get('/:userId/posts')
    getPostByUserId(@Param('userId', ParseIntPipe) userId: number) {
        return this.adminService.getPostByUserId(userId)
    }

    @Roles(Constants.ROLES.ADMIN_ROLE, Constants.ROLES.SUPERADMIN_ROLE)
    @Get('/posts/:postId')
    getPostById(@Param('postId', ParseIntPipe) postId: number) {
        return this.adminService.getPostById(postId)
    }

    @Roles(Constants.ROLES.ADMIN_ROLE, Constants.ROLES.SUPERADMIN_ROLE)
    @Delete('/deletepost/:postId')
    adminDeletePost(@Param('postId', ParseIntPipe) postId: number) {
        return this.adminService.adminDeletePost(postId);
    }

    @Roles(Constants.ROLES.ADMIN_ROLE, Constants.ROLES.SUPERADMIN_ROLE)
    @Delete('/:userId')
    DeleteUsers(@GetUser() user, @Param('userId', ParseIntPipe) userId: number) {
        return this.adminService.deleteUser(userId, user);
    }

    @Roles(Constants.ROLES.ADMIN_ROLE, Constants.ROLES.SUPERADMIN_ROLE)
    @Patch('/userstatus/:userId')
    changeUserStatus(@GetUser() user, @Param('userId', ParseIntPipe) userId: number) {
        return this.adminService.changeUserStatus(userId, user);
    }

}


