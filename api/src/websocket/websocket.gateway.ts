import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WebsocketService } from './websocket.service';
import { Server, Socket } from 'socket.io';
import { Subscription } from 'rxjs';
import { Logger, OnApplicationShutdown } from '@nestjs/common';
import { WebsocketEvent } from './weboscket-event.interface';
import { AuthenticationService } from '@src/iam/authentication/authentication.service';
import { CONNECTION_STATUS } from './websocket.enum';
import { WebsocketException } from '@src/notifications/ws.exception';
import { ERROR_EVENT } from '@transcendence/common';
import { env } from '@src/+env/server';

@WebSocketGateway({
  cors: {
    origin: env.FRONTEND_URL,
    credentials: true,
  },
})
export class WebsocketGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnApplicationShutdown,
    OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(WebsocketGateway.name);
  private subscription!: Subscription;

  constructor(
    private readonly service: WebsocketService,
    private readonly authService: AuthenticationService,
  ) {}

  afterInit(server: Server): void {
    this.subscription = this.service.getEventSubject$().subscribe({
      next: (event) => this.handleEvent(server, event),
      error: (err) => server.emit('exception', err.toString()),
    });
  }

  onApplicationShutdown() {
    this.subscription.unsubscribe();
  }

  private roomSocketsCount(room: string) {
    return this.server.sockets.adapter.rooms.get(room)?.size ?? 0;
  }

  private isUserConnected(userId: number) {
    return this.roomSocketsCount(userId.toString()) > 0;
  }

  async handleConnection(socket: Socket) {
    /**
     * filters aren't applied to connection handlers (only to @SubscribeMessage())
     */
    try {
      const user = await this.authService.getUserFromSocket(socket);
      this.logger.log(`new user connected with id ${socket.id}`);
      if (!this.isUserConnected(user.sub)) {
        this.service.addEvent([], CONNECTION_STATUS.CONNECTED, user);
      }
      socket.join(user.sub.toString());
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
      this.logger.log(`user ${socket.id} disconnected`);
      if (!this.isUserConnected(user.sub)) {
        this.service.addEvent([], CONNECTION_STATUS.DISCONNECTED, user);
      }
    } catch (error) {}
  }

  handleEvent(server: Server, event: WebsocketEvent) {
    console.log({ event });
    if (
      event.name === CONNECTION_STATUS.CONNECTED ||
      event.name === CONNECTION_STATUS.DISCONNECTED
    ) {
      return;
    }

    for (const userId of event.usersIds) {
      if (!this.isUserConnected(userId)) continue;
      server.to(userId.toString()).emit(event.name, event.data);
    }
  }
}
