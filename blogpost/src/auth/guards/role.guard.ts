import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Constants } from 'src/utils/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector
  ) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log('roles', roles);
    const request = context.switchToHttp().getRequest();
    for (let x = 0; x < Constants.BY_PASS_URLS_ROLE.length; x++) {
      if (request.url === Constants.BY_PASS_URLS_ROLE[x]) return true;
    }

    if (request?.user) {
      const { role } = request.user;

      if (!roles) {
        return true; 
      }

     
      return roles.includes(role);
    }
    return false;
  }
}
