import {
  WebSocketServer,
  WebSocketGateway,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Direction } from './gameData';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { UseGuards } from '@nestjs/common';
import { WsAuthGuard } from '@src/iam/authentication/guards/ws-auth.guard';
import { MatchesStorage } from '../matches/matches.storage';
import { getMatchRoomId } from '../matches/matches.helpers';
import { Match } from '@transcendence/db';

@WebSocketGateway()
export class GamePlayGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly matchesStorage: MatchesStorage) {}

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('moveRight')
  moveRight(
    @ConnectedSocket() client: Socket,
    @MessageBody('match') match: Match,
  ) {
    const user: ActiveUserData = client.data.user;
    const game = this.matchesStorage.findGame(match.matchId);
    if (!game) {
      throw new WsException('Invalid matchId');
    }
    game.gameService.movePlayer(Direction.RIGHT, user.sub, match);
    this.server
      .to(getMatchRoomId(match.matchId))
      .emit('updateGame', game.gameService.getGameData());
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('moveLeft')
  moveLeft(
    @ConnectedSocket() client: Socket,
    @MessageBody('match') match: Match,
  ) {
    const game = this.matchesStorage.findGame(match.matchId);
    const user: ActiveUserData = client.data.user;
    if (!game) {
      throw new WsException('Invalid matchId');
    }
    game.gameService.movePlayer(Direction.LEFT, user.sub, match);
    this.server
      .to(getMatchRoomId(match.matchId))
      .emit('updateGame', game.gameService.getGameData());
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('update')
  gameUpdate(@MessageBody('matchId') matchId: number) {
    const game = this.matchesStorage.findGame(matchId);
    if (!game) {
      throw new WsException('Invalid matchId');
    }

    this.server
      .to(getMatchRoomId(matchId))
      .emit('updateGame', game.gameService.getGameData());
  }
}
