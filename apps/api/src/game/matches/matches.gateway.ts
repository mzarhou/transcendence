import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketServer,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { MatchesService } from './matches.service';
import { Server } from 'socket.io';
import { GamesCollection } from './entities/game.entity';
import { Socket } from 'socket.io';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { WsAuthGuard } from '@src/iam/authentication/guards/ws-auth.guard';
import { UseGuards } from '@nestjs/common';

@WebSocketGateway()
export class MatchesGateway implements OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  server!: Server;
  games!: GamesCollection;

  constructor(private matchesService: MatchesService) {}

  afterInit(): any {
    this.games = new GamesCollection(this.server, this.matchesService);
  }

  handleDisconnect(client: any) {
    this.games.removePlayer(client);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('joinMatch')
  async joinMatch(
    @ConnectedSocket() client: Socket,
    @MessageBody('matchId') matchId: number,
  ) {
    const user: ActiveUserData = client.data.user;
    const match = await this.matchesService.findOneById(matchId);
    if (!match) throw new WsException('Match Not Found!');
    if (match.winnerId !== null) throw new WsException('Match is Over!');

    this.games.connectPlayer(match, user.sub, client);
  }
}
