import {
  ConnectedSocket,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MatchesService } from '@src/game/matches/matches.service';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { WsAuthGuard } from '@src/iam/authentication/guards/ws-auth.guard';
import { Logger, UseGuards } from '@nestjs/common';
import { WebsocketService } from '@src/websocket/websocket.service';
import { MatchFoundData } from '@transcendence/db';
import { ClientGameEvents } from '@transcendence/db';
import { ServerGameEvents } from '@transcendence/db';
import { PlayersQueueStorage } from './players-queue.storage';

@WebSocketGateway()
export class MatchMakingGateway {
  private readonly logger = new Logger(MatchMakingGateway.name);

  @WebSocketServer()
  server!: Server;

  constructor(
    private matchesService: MatchesService,
    private readonly websocketService: WebsocketService,
    private readonly playersQueue: PlayersQueueStorage,
  ) { }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage(ClientGameEvents.JNRNDMCH)
  async JoinRandomMatch(@ConnectedSocket() client: Socket) {
    try {
      const user: ActiveUserData = client.data.user;

      //possible problem if user and adversary are the same
      const adversaryId = await this.playersQueue.getLast();

      // send user to waiting page
      this.websocketService.addEvent(
        [user.sub],
        ServerGameEvents.WAITING,
        null,
      );

      // if same user
      if (user.sub === adversaryId) return;

      if (adversaryId) {
        //create a match between user and adversary => to do
        const match = await this.matchesService.create(user.sub, adversaryId);

        //emit event to players
        this.websocketService.addEvent(
          [adversaryId, user.sub],
          ServerGameEvents.MCHFOUND,
          { match } satisfies MatchFoundData,
        );
      } else {
        await this.playersQueue.addPlayer(user.sub);
      }
    } catch (error) {
      if (error instanceof WsException) {
        throw new WsException(error.message);
      } else {
        this.logger.error(error);
      }
    }
  }
}
