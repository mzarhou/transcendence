import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
} from '@nestjs/websockets';
import { WebsocketService } from './websocket.service';
import { Server, Socket } from 'socket.io';
import { Subscription } from 'rxjs';
import { Logger, OnApplicationShutdown } from '@nestjs/common';
import { WebsocketEvent } from './weboscket-event.interface';
import { WebsocketClientsStorage } from './websocket-clients.storage';
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
  private readonly logger = new Logger(WebsocketGateway.name);

  private subscription!: Subscription;

  constructor(
    private readonly service: WebsocketService,
    private readonly storage: WebsocketClientsStorage,
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

  async handleConnection(socket: Socket) {
    /**
     * filters aren't applied to connection handlers (only to @SubscribeMessage())
     */
    try {
      const user = await this.authService.getUserFromSocket(socket);
      this.logger.log(`new user connected with id ${socket.id}`);
      if (!this.storage.isConnected(user.sub)) {
        this.service.addEvent([], CONNECTION_STATUS.CONNECTED, user);
      }
      this.storage.addClient(user.sub, socket);
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
      this.storage.removeClient(user.sub, socket);
      this.logger.log(`user ${socket.id} disconnected`);
      if (!this.storage.isConnected(user.sub)) {
        this.service.addEvent([], CONNECTION_STATUS.DISCONNECTED, user);
      }
    } catch (error) {}
  }

  handleEvent(_server: Server, event: WebsocketEvent) {
    if (
      event.name === CONNECTION_STATUS.CONNECTED ||
      event.name === CONNECTION_STATUS.DISCONNECTED
    ) {
      return;
    }

    const connectedClients = this.storage.getConnectedClients();
    for (const userId of event.usersIds) {
      const sockets = connectedClients.get(userId);
      if (!sockets) return;
      for (const socket of sockets) {
        socket.emit(event.name, event.data);
      }
    }
  }
}
