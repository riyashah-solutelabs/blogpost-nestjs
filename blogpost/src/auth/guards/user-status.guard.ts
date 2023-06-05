import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { Constants } from 'src/utils/constants';

@Injectable()
export class UserStatusGuard implements CanActivate {
    constructor(private userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log("status")
    const request = context.switchToHttp().getRequest();
    for (let x = 0; x < Constants.BY_PASS_URLS.length; x++) {
      if (request.url === Constants.BY_PASS_URLS[x]) return true;
    }
    const user = await this.userService.findUserById(request.user.userId);
    const status = user.status;
    if(status === 'active') {
        return true;
    }
    return false;
  }
}
