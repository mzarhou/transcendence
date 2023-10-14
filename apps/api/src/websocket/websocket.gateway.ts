import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { WebsocketService } from './websocket.service';
import { Server, Socket } from 'socket.io';
import { Subscription } from 'rxjs';
import { Logger, OnApplicationShutdown } from '@nestjs/common';
import { WebsocketEvent } from './weboscket-event.interface';
import { AuthenticationService } from '@src/iam/authentication/authentication.service';
import { CONNECTION_STATUS, NewSocketData } from './websocket.enum';
import { ERROR_EVENT } from '@transcendence/db';
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
    this.service.setServer(server);
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
      if (!this.service.isUserConnected(user.sub)) {
        this.service.addEvent([], CONNECTION_STATUS.CONNECTED, user);
      }
      socket.join(user.sub.toString());
      this.service.addEvent([], CONNECTION_STATUS.NEW_SOCKET, {
        user,
        socket,
      } satisfies NewSocketData);
    } catch (error) {
      this.logger.warn(`failed to connect user ${socket.id}`);
      if (error instanceof WsException) {
        socket.emit(ERROR_EVENT, {
          status: ERROR_EVENT,
          message: error.getError(),
        });
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
      if (!this.service.isUserConnected(user.sub)) {
        this.service.addEvent([], CONNECTION_STATUS.DISCONNECTED, user);
      }
    } catch (error) {}
  }

  handleEvent(server: Server, event: WebsocketEvent) {
    if (Object.keys(CONNECTION_STATUS).includes(event.name)) {
      return;
    }
    for (const room of event.rooms) {
      server.to(room.toString()).emit(event.name, event.data);
    }
  }
}
