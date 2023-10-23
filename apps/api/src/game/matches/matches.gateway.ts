import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { MatchesService } from './matches.service';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { WsAuthGuard } from '@src/iam/authentication/guards/ws-auth.guard';
import { Logger, UseGuards } from '@nestjs/common';
import { MatchesStorage } from './matches.storage';
import { WebsocketService } from '@src/websocket/websocket.service';
import { Subscription } from 'rxjs';
import { CONNECTION_STATUS } from '@src/websocket/websocket.enum';
import { ServerGameEvents, StartGameData } from '@transcendence/db';
import { ClientGameEvents } from '@transcendence/db';
import { PlayMatchData } from '@transcendence/db';

@WebSocketGateway()
export class MatchesGateway {
  private subscription!: Subscription;
  private readonly logger = new Logger(MatchesGateway.name);

  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly matchesService: MatchesService,
    private readonly matchesStorage: MatchesStorage,
    private readonly websocketService: WebsocketService,
  ) {}

  onApplicationShutdown(_signal?: string | undefined) {
    this.subscription.unsubscribe();
  }

  afterInit(_server: Server) {
    this.subscription = this.websocketService.getEventSubject$().subscribe({
      next: (event) => {
        if (event.name === CONNECTION_STATUS.DISCONNECTED) {
          const user = event.data as ActiveUserData;
          this.matchesStorage.removePlayer(user.sub);
        }
      },
    });
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage(ClientGameEvents.PLAYMACH)
  async PlayMatch(
    @ConnectedSocket() client: Socket,
    @MessageBody() { matchId }: PlayMatchData,
  ) {
    try {
      const user: ActiveUserData = client.data.user;
      const match = await this.matchesService.safeFindOneById(matchId);
      if (!match) throw new WsException('Match Not Found!');
      if (match.winnerId !== null) throw new WsException('Match is Over!');

      this.matchesStorage.connectPlayer(match, user.sub);
      this.websocketService.addEvent([user.sub], ServerGameEvents.STARTSGM, {
        match,
      } satisfies StartGameData);
    } catch (error) {
      if (error instanceof WsException) {
        throw new WsException(error.message);
      } else {
        this.logger.error(error);
      }
    }
  }
}
