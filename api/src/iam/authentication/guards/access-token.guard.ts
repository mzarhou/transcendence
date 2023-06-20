import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenWithout2faGuard } from './access-token-without-2fa.guard';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly accessTokenWithout2faGuard: AccessTokenWithout2faGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const payload = await this.accessTokenWithout2faGuard.tryGetPayload(
      context,
    );

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
