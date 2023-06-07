import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GetUser } from '../../auth/decorator/get-user.decorator';
import { JwtGuard, RolesGuard } from '../../auth/guards';
import { UserService } from '../services/user.service';
import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Constants } from '../../utils/constants';
import { Roles } from '../../auth/decorator';
import { Serialize } from 'src/interceptors/serializeinterceptor';
import { UserDto } from 'src/dtos';

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
    @Serialize(UserDto)
    @Get('/currentuser')
    getCurrentUser(@GetUser() user){
        return this.userService.findUserById(user.userId);
        // console.log(user);
        // return user;
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

    @ApiOperation({
        summary: 'search users by name'
    })
    @Serialize(UserDto)
    // @Roles(Constants.ROLES.NORMAL_ROLE, Constants.ROLES.ADMIN_ROLE, )
    @Get('/search')
    searchUser(@Query('name') name: string) {
        return this.userService.searchUserByName(name)
    }

}


