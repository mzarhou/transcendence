import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_TYPE_KEY } from '../decorators/auth.decorator';
import { AuthType } from '../enum/auth-type.enum';
import { AccessTokenWithout2faGuard } from './access-token-without-2fa.guard';
import { AccessTokenGuard } from './access-token.guard';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly accessTokenWithout2faGuard: AccessTokenWithout2faGuard,
  ) {}

  private static readonly defaultAuthType = AuthType.Bearer;

  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  > = {
    [AuthType.None]: { canActivate: () => true },
    [AuthType.Bearer]: this.accessTokenGuard,
    [AuthType.BearerWithou2fa]: this.accessTokenWithout2faGuard,
  };

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthenticationGuard.defaultAuthType];

    const guards = authTypes.map((at) => this.authTypeGuardMap[at]).flat();

    let err = new UnauthorizedException();
    for (const guardInstance of guards) {
      const canActivate = await Promise.resolve(
        guardInstance.canActivate(context),
      ).catch((error) => {
        err = error;
      });

      if (canActivate) return true;
    }

    throw err;
  }
}
