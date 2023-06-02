import { Controller, Get, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { GetUser } from '../../auth/decorator/get-user.decorator';
import { JwtGuard, RolesGuard } from '../../auth/guards';
import { Constants } from '../../utils/constants';
import { Roles } from '../../auth/decorator';

@UseGuards(JwtGuard, RolesGuard)
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('/currentuser')
    getCurrentUser(@GetUser() user){
        console.log(user);
        return user;
    }

    @Roles(Constants.ROLES.ADMIN_ROLE, Constants.ROLES.SUPERADMIN_ROLE)
    @Get()
    getUsers() {
        return this.userService.getUsers()
    }

    @Roles(Constants.ROLES.ADMIN_ROLE, Constants.ROLES.SUPERADMIN_ROLE)
    @Get()
    getAllPosts() {
        return this.userService.getAllPosts()
    }

}


