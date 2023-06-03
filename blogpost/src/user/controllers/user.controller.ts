import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from '../../auth/decorator/get-user.decorator';
import { JwtGuard } from '../../auth/guards';
import { UserService } from '../services/user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('/currentuser')
    getCurrentUser(@GetUser() user){
        console.log(user);
        return user;
    }

    @Get()
    getAllUsers() {
        return this.userService.getAllUsers();
    }

}


