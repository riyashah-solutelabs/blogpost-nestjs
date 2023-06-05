import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from '../../auth/decorator/get-user.decorator';
import { JwtGuard, RolesGuard } from '../../auth/guards';
import { UserService } from '../services/user.service';
import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Constants } from '../../utils/constants';
import { Roles } from '../../auth/decorator';

@ApiTags('User')
@ApiSecurity('JWT-Auth')
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @ApiOperation({
        summary: 'reterive current user'
    })
    @ApiOkResponse({
        description: 'current user reterived successfully'
    })
    @Get('/currentuser')
    getCurrentUser(@GetUser() user){
        console.log(user);
        return user;
    }

    @ApiOperation({
        summary: 'reterive users'
    })
    @ApiOkResponse({
        description: 'users reterived successfully'
    })
    @Roles(Constants.ROLES.ADMIN_ROLE, Constants.ROLES.SUPERADMIN_ROLE)
    // @UseGuards(RolesGuard)
    @Get()
    getAllUsers() {
        return this.userService.getAllUsers();
    }

}


