import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { Constants } from 'src/utils/constants';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    for (let x = 0; x < Constants.BY_PASS_URLS_SUBSCRIBED.length; x++) {
      if (request.url === Constants.BY_PASS_URLS_SUBSCRIBED[x]) return true;
    }
    const user = await this.userService.findUserById(request.user.userId);
    console.log(user)
    const isSubscribed = user.subscribed;
    return isSubscribed;
  }
}
