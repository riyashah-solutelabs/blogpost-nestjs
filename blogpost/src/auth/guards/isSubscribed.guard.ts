import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const isSubscribed = user.isSubscribed;
    return isSubscribed;
  }
}
