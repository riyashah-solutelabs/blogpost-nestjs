import { Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { JwtGuard, RolesGuard } from '../../auth/guards';
import { Constants } from '../../utils/constants';
import { GetUser, Roles } from '../../decorator';
import { SuperAdminService } from '../services/superadmin.service';
import { ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { MessageResponseDto, UserResponseDto } from 'src/response';

@ApiTags('superadmin')
@ApiSecurity('JWT-Auth')
// @UseGuards(RolesGuard)
@Controller('superadmin')
export class SuperAdminController {
    constructor(private superadminService: SuperAdminService) { }
    
    @ApiOperation({
        summary: 'reterive admin'
    })
    @ApiOkResponse({
        description: 'reterive admin successfully'
    })
    @Roles(Constants.ROLES.SUPERADMIN_ROLE)
    @Get('/admins')
    GetAdmin(): Promise<UserResponseDto[]> {
        return this.superadminService.GetAdmin();
    }

    @ApiOperation({ summary: 'delete admin' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiNotFoundResponse({
        description: 'admin not found'
    })
    @ApiNoContentResponse({ description: 'admin deleted successfully' })
    @HttpCode(204)
    @Roles(Constants.ROLES.SUPERADMIN_ROLE)
    @Delete('/admin/:userId')
    DeleteAdmin(@Param('userId') userId: string): Promise<MessageResponseDto> {
        return this.superadminService.DeleteAdmin(userId);
    }

    @ApiOperation({ summary: 'delete post' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiNotFoundResponse({
        description: 'post not found'
    })
    @ApiNoContentResponse({ description: 'post deleted successfully' })
    @HttpCode(204)
    @Roles(Constants.ROLES.SUPERADMIN_ROLE)
    @Delete('/post/:postId')
    DeleteAllPost(@Param('postId') postId: string): Promise<MessageResponseDto> {
        return this.superadminService.DeleteAllPost(postId);
    }

    @ApiOperation({
        summary: 'update admin status(active, inactive)'
    })
    @ApiCreatedResponse({
        description: 'admin status updated successfully'
    })
    @Roles(Constants.ROLES.SUPERADMIN_ROLE)
    @Patch('/status/:userId')
    changeAdminStatus(@Param('userId') userId: string): Promise<MessageResponseDto> {
        return this.superadminService.changeAdminStatus(userId);
    }

    @ApiOperation({
        summary: 'search admin by name'
    })
    @Roles(Constants.ROLES.SUPERADMIN_ROLE)
    @Get()
    searchUser(@Query('name') name: string): Promise<UserResponseDto[]> {
        return this.superadminService.searchAdminByName(name)
    }

}


