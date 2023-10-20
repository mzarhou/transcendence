import {
  WebSocketGateway,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  WsException,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { Logger, UseGuards } from '@nestjs/common';
import { WsAuthGuard } from '@src/iam/authentication/guards/ws-auth.guard';
import { MatchesStorage } from '../matches/matches.storage';
import { ClientGameEvents, MoveLeftData } from '@transcendence/db';
import { Direction } from '@transcendence/db';

@WebSocketGateway()
export class GamePlayGateway {
  private readonly logger = new Logger(GamePlayGateway.name);

  constructor(private readonly matchesStorage: MatchesStorage) {}

  @UseGuards(WsAuthGuard)
  @SubscribeMessage(ClientGameEvents.MoveRight)
  moveRight(
    @ConnectedSocket() client: Socket,
    @MessageBody() { match }: MoveLeftData,
  ) {
    try {
      const user: ActiveUserData = client.data.user;
      const game = this.matchesStorage.findGame(match.matchId);
      if (!game) {
        throw new WsException('Invalid matchId');
      }
      game.gameService.movePlayer(Direction.RIGHT, user.sub, match);
    } catch (error) {
      this.logger.error(error);
    }
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage(ClientGameEvents.MoveLeft)
  moveLeft(
    @ConnectedSocket() client: Socket,
    @MessageBody() { match }: MoveLeftData,
  ) {
    try {
      const game = this.matchesStorage.findGame(match.matchId);
      const user: ActiveUserData = client.data.user;
      if (!game) {
        throw new WsException('Invalid matchId');
      }
      game.gameService.movePlayer(Direction.LEFT, user.sub, match);
    } catch (error) {
      if (error instanceof WsException) {
        throw new WsException(error.message);
      } else {
        this.logger.error(error);
      }
    }
  }
}
