import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
     configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_KEY')
        })
    }

    validate(payload: any): any {
      console.log(payload)
        return {
          userId: payload.sub,
          email: payload.email,
          role: payload.role,
          isSubscribed: payload.isSubscribed,
          name: payload.name,
        };
      }
}