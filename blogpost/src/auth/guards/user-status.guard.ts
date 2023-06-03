import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class UserStatusGuard implements CanActivate {
    constructor(private userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = await this.userService.findUserById(request.user.userId);
    const status = user.status;
    if(status === 'active') {
        return true;
    }
    return false;
  }
}
