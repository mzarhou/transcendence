import { ForbiddenError } from '@casl/ability';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import {
  AbilityFactory,
  AppAbility,
} from 'src/iam/authorization/ability.factory';
import jwtConfig from 'src/iam/config/jwt.config';
import { REQUEST_USER_KEY } from 'src/iam/iam.constants';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';

@Injectable()
export class AccessTokenWithout2faGuard implements CanActivate {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await this.tryGetPayload(context);
    return true;
  }

  async tryGetPayload(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeaderOrCookie(request);
    if (!token) {
      throw new UnauthorizedException(undefined, 'No access token provided');
    }

    try {
      const _payload = await this.jwtService.verifyAsync<
        Omit<ActiveUserData, 'allow'>
      >(token, this.jwtConfiguration);

      const ability = this.abilityFactory.defineForUser(_payload);
      const payload: ActiveUserData = {
        ..._payload,
        allow: (...args: Parameters<AppAbility['can']>) => {
          ForbiddenError.from(ability).throwUnlessCan(...args);
        },
      };

      request[REQUEST_USER_KEY] = payload;
      return payload;
    } catch (error) {
      throw new UnauthorizedException(undefined, 'Invalid access token');
    }
  }

  private extractTokenFromHeaderOrCookie(req: Request) {
    const accessToken: string | undefined = req.cookies?.['accessToken'];
    if (accessToken) return accessToken;
    const [_, token] = req.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
