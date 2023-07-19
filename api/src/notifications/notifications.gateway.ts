import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { NotificationsClientsStorage } from './notifications-clients.storage';
import { NotificationsService } from './notifications.service';
import { AuthenticationService } from 'src/iam/authentication/authentication.service';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { WebsocketException } from './ws.exception';
import { ERROR_EVENT } from '@transcendence/common';

@WebSocketGateway({
  cors: {
    // Todo: use env FRONTEND_URL
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(
    private readonly clientsStorage: NotificationsClientsStorage,
    private readonly notificationsService: NotificationsService,
    private readonly authService: AuthenticationService,
  ) {}

  async handleConnection(socket: Socket) {
    /**
     * filters aren't applied to connection handlers (only to @SubscribeMessage())
     */
    try {
      const user = await this.authService.getUserFromSocket(socket);
      this.logger.log(`new user connected with id ${socket.id}`);
      this.clientsStorage.addClient(user.sub, socket);
      this.notificationsService.sendFriendConnectedEvent(user);
    } catch (error) {
      this.logger.warn(`failed to connect user ${socket.id}`);
      if (error instanceof WebsocketException) {
        socket.emit(ERROR_EVENT, error.getError());
      }
      socket.disconnect();
    }
  }

  async handleDisconnect(socket: Socket) {
    /**
     * filters aren't applied to connection handlers (only to @SubscribeMessage())
     */
    try {
      const user = await this.authService.getUserFromSocket(socket);
      this.clientsStorage.removeClient(user.sub, socket);
      this.logger.log(`user ${socket.id} disconnected`);
      this.notificationsService.sendFriendDisconnectedEvent(user);
    } catch (error) {}
  }

  notify(userId: number, data: unknown) {
    // TODO: implement
  }
}
