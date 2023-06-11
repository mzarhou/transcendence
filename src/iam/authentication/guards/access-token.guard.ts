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
import { Observable } from 'rxjs';
import jwtConfig from 'src/iam/config/jwt.config';
import { REQUEST_USER_KEY } from 'src/iam/iam.constants';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeaderOrCookie(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    let payload: ActiveUserData;
    try {
      payload = await this.jwtService.verifyAsync<ActiveUserData>(
        token,
        this.jwtConfiguration,
      );
      request[REQUEST_USER_KEY] = payload;
    } catch (error) {
      throw new UnauthorizedException();
    }
    if (payload.isTfaEnabled && !payload.isTfaCodeProvided) {
      const authenticationHeader = `2FA realm="Secure Area"`;
      request.res?.setHeader('WWW-Authenticate', authenticationHeader);
      throw new UnauthorizedException(
        undefined,
        'You must provide 2FA code first',
      );
    }
    return true;
  }
}

function extractTokenFromHeaderOrCookie(req: Request) {
  const accessToken: string | undefined = req.cookies?.['accessToken'];
  if (accessToken) return accessToken;
  const [_, token] = req.headers.authorization?.split(' ') ?? [];
  return token;
}
