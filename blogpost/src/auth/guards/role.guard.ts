import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector,
    private userService: UserService
  ) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log('roles', roles);
    const request = context.switchToHttp().getRequest();

    if (request?.user) {
      console
      const { role } = request.user;
      if (!roles) {
        return true; 
      }
      const url = request.url;

      if (url.includes('/user/currentuser')) {
        return true;
      }
     
      return roles.includes(role);
    }
    return false;
  }
}
