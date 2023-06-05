import { Body, Controller, HttpCode, HttpStatus, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { UserDto } from '../../dtos';
import { CreateUserDto } from '../../dtos';
import { AuthService } from '../services/auth.service';
import { User } from '../../entities';
import { Serialize } from 'src/interceptors/serializeinterceptor';
import { GetUser, Roles } from '../decorator';
import { JwtGuard, RolesGuard, SubscriptionGuard, UserStatusGuard } from '../guards';
import { Constants } from 'src/utils/constants';
import { UpdatePasswordDto, LoginUserDto } from '../../dtos';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiOperation, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@ApiSecurity('JWT-Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @ApiOperation({
        summary: 'register user'
    })
    @ApiCreatedResponse({
        description: 'created user object as response',
        type: User
    })
    @ApiBadRequestResponse({
        description: 'user not created. Try Again'
    })
    @ApiConflictResponse({ description: 'User already exists' })
    @Serialize(UserDto)
    @Post('/signup')
    createUser(@Body() createuserdto: CreateUserDto): Promise<User> {
        return this.authService.signup(createuserdto);
    }

    @ApiOperation({
        summary: 'signin user'
    })
    @ApiCreatedResponse({
        description: 'signin user response',
        type: User
    })
    @ApiBadRequestResponse({
        description: 'cannot signin. Try Again'
    })
    @Post('/signin')
    signin(@Body() user: LoginUserDto): Promise<any> {
        return this.authService.signin(user.email, user.password)
    }

    @ApiOperation({
        description: 'get subscription'
    })
    @ApiConflictResponse({ description: 'already have subscription' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @Roles(Constants.ROLES.NORMAL_ROLE)
    // @UseGuards(RolesGuard)
    @Patch('subscribe')
    getSubscription(@GetUser('userId', ParseIntPipe) userId: number) {
        return this.authService.getSubscription(userId);
    }

    @ApiOperation({
        summary: 'Update password'
    })
    @ApiCreatedResponse({
        description: 'update password response',
        type: User
    })
    @ApiBadRequestResponse({
        description: 'cannot update password. Try Again'
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @Roles(Constants.ROLES.NORMAL_ROLE)
    // @UseGuards(RolesGuard, UserStatusGuard)
    @Patch('/updatepassword')
    updatePassword(@GetUser() user, @Body() updatePassword: UpdatePasswordDto) {
        return this.authService.updatePassword(user, updatePassword);
    }
}
