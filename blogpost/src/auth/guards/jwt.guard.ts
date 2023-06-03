import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Constants } from '../../utils/constants';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    //By pass url
    for (let x = 0; x < Constants.BY_PASS_URLS.length; x++) {
      if (request.url === Constants.BY_PASS_URLS[x]) return true;
    }

    // to pass controle to AuthGuard('jwt') 
    return super.canActivate(context);
  }
}
