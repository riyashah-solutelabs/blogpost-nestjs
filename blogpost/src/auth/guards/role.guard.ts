import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector,
    private userService: UserService
    ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log('roles', roles);
    const request = context.switchToHttp().getRequest();

    if(request?.user){
        console
        const {role} = request.user;
        // const user = await this.userService.findUserById(id);
        // if(roles.includes(user.role)){
        //     return true;
        // }
        return roles.includes(role);
    }
    return false;
}
}
