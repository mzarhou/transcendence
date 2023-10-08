import {
  WebSocketServer,
  WebSocketGateway,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GamePlayService } from './gameplay.service';
import { Direction } from './gameData';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { UseGuards } from '@nestjs/common';
import { WsAuthGuard } from '@src/iam/authentication/guards/ws-auth.guard';

@WebSocketGateway()
export class GamePlayGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly gameService: GamePlayService) {}

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('moveRight')
  moveRight(
    @ConnectedSocket() client: Socket,
    @MessageBody('matchId') matchId: number,
  ) {
    const user: ActiveUserData = client.data.id;
    this.gameService.movePlayer(Direction.RIGHT, user.sub, matchId);
    this.server
      .to(matchId.toString())
      .emit('updateGame', this.gameService.getGameDataS1());
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('moveLeft')
  moveLeft(
    @ConnectedSocket() client: Socket,
    @MessageBody('matchId') matchId: number,
  ) {
    const user: ActiveUserData = client.data.id;
    this.gameService.movePlayer(Direction.LEFT, user.sub, matchId);
    this.server
      .to(matchId.toString())
      .emit('updateGame', this.gameService.getGameDataS1());
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('update')
  gameUpdate(@MessageBody('matchId') matchId: number) {
    this.server
      .to(matchId.toString())
      .emit('updateGame', this.gameService.getGameDataS1());
  }
}
