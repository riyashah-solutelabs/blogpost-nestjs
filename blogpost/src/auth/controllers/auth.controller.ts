import { Body, Controller, HttpCode, HttpStatus, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { UserDto } from '../../user/dto/user.dto';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { AuthService } from '../services/auth.service';
import { User } from '../../user/entities/user.entity';
import { Serialize } from 'src/interceptors/serializeinterceptor';
import { GetUser, Roles } from '../decorator';
import { JwtGuard, RolesGuard } from '../guards';
import { Constants } from 'src/utils/constants';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @Serialize(UserDto)
    @Post('/signup')
    createUser(@Body() createuserdto: CreateUserDto): Promise<User> {
        return this.authService.signup(createuserdto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('/signin')
    signin(@Body() user: Partial<CreateUserDto>): Promise<any> {
        return this.authService.signin(user.email, user.password)
    }


    @Roles(Constants.ROLES.NORMAL_ROLE)
    @UseGuards(JwtGuard, RolesGuard)
    @Patch('subscribe')
    getSubscription(@GetUser('userId', ParseIntPipe) userId: number) {
        return this.authService.getSubscription(userId);
    }
}
