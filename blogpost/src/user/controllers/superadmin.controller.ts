import { Controller, Delete, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { JwtGuard, RolesGuard } from '../../auth/guards';
import { Constants } from '../../utils/constants';
import { GetUser, Roles } from '../../auth/decorator';
import { SuperAdminService } from '../services/superadmin.service';

@UseGuards(JwtGuard, RolesGuard)
@Controller('superadmin')
export class SuperAdminController {
    constructor(private superadminService: SuperAdminService) { }
    
    @Roles(Constants.ROLES.SUPERADMIN_ROLE)
    @Get('/admins')
    GetAdmin() {
        return this.superadminService.GetAdmin();
    }

    @Roles(Constants.ROLES.SUPERADMIN_ROLE)
    @Delete('/admin/:userId')
    DeleteAdmin(@Param('userId', ParseIntPipe) userId: number) {
        return this.superadminService.DeleteAdmin(userId);
    }

    @Roles(Constants.ROLES.SUPERADMIN_ROLE)
    @Delete('/post/:postId')
    DeleteAllPost(@Param('postId', ParseIntPipe) postId: number) {
        return this.superadminService.DeleteAllPost(postId);
    }

    @Roles(Constants.ROLES.SUPERADMIN_ROLE)
    @Patch('/status/:userId')
    changeAdminStatus(@GetUser() user, @Param('userId', ParseIntPipe) userId: number) {
        return this.superadminService.changeAdminStatus(userId, user);
    }


}


