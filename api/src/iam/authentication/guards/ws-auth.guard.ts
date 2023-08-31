import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthenticationService } from '@src/iam/authentication/authentication.service';
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthenticationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const socket: Socket = context.switchToWs().getClient();
    const user = await this.authService.getUserFromSocket(socket);
    socket.data = { user };
    return true;
  }
}
