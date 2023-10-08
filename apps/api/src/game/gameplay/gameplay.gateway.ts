import {
  WebSocketServer,
  WebSocketGateway,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GamePlayService } from './gameplay.service';
import { Direction } from './gameData';

@WebSocketGateway()
export class GamePlayGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly gameService: GamePlayService) {}

  @SubscribeMessage('startGame')
  startGame(client: Socket, room: string) {
    this.gameService.startgame();
    console.log('startgame');
    this.server.to(room).emit('startGame', this.gameService.getGameDataS1());
  }

  @SubscribeMessage('moveRight')
  moveRight(client: Socket, room: string) {
    this.gameService.movePlayer(Direction.RIGHT, client.id, clients);
    this.server.to(room).emit('updateGame', this.gameService.getGameDataS1());
  }

  @SubscribeMessage('moveLeft')
  moveLeft(client: Socket, room: string) {
    this.gameService.movePlayer(Direction.LEFT, client.id, clients);
    this.server.to(room).emit('updateGame', this.gameService.getGameDataS1());
  }

  @SubscribeMessage('update')
  gameUpdate(client: Socket, room: string) {
    this.server.to(room).emit('updateGame', this.gameService.getGameDataS1());
  }
}
