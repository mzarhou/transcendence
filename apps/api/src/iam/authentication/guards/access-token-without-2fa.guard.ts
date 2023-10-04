import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { REQUEST_USER_KEY } from '@src/iam/iam.constants';
import { AuthenticationService } from '../authentication.service';

@Injectable()
export class AccessTokenWithout2faGuard implements CanActivate {
  constructor(private readonly authService: AuthenticationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await this.tryGetPayload(context);
    return true;
  }

  async tryGetPayload(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);
    if (!token) {
      throw new UnauthorizedException('No access token provided');
    }

    try {
      const payload = await this.authService.getUserFromToken(token);
      request[REQUEST_USER_KEY] = payload;
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  private extractTokenFromCookie(req: Request) {
    const accessToken: string | undefined = req.cookies?.['accessToken'];
    return accessToken;
  }
}
