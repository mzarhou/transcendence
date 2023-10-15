import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { MatchesService } from './matches.service';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { WsAuthGuard } from '@src/iam/authentication/guards/ws-auth.guard';
import { UseGuards } from '@nestjs/common';
import { GamePlayService } from '../gameplay/gameplay.service';
import { MatchesStorage } from './matches.storage';
import { EventGame } from '../gameplay/utils';
import { WebsocketService } from '@src/websocket/websocket.service';
import { Subscription } from 'rxjs';
import { CONNECTION_STATUS } from '@src/websocket/websocket.enum';

@WebSocketGateway()
export class MatchesGateway {
  private subscription!: Subscription;

  @WebSocketServer()
  server!: Server;
  gamePlay!: GamePlayService;

  constructor(
    private matchesService: MatchesService,
    private matchesStorage: MatchesStorage,
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
  @SubscribeMessage(EventGame.PLAYMACH)
  async PlayMatch(
    @ConnectedSocket() client: Socket,
    @MessageBody('matchId') matchId: number,
  ) {
    console.log('PlayMatch: ' + matchId + '\n');
    const user: ActiveUserData = client.data.user;
    const match = await this.matchesService.findOneById(matchId);
    if (!match) throw new WsException('Match Not Found!');
    if (match.winnerId !== null) throw new WsException('Match is Over!');

    this.matchesStorage.connectPlayer(match, user.sub);
    this.websocketService.addEvent([user.sub], EventGame.STARTSGM, {
      match: match,
    });
  }
}
