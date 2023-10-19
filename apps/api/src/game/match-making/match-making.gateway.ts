import {
  ConnectedSocket,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MatchesService } from '@src/game/matches/matches.service';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { WsAuthGuard } from '@src/iam/authentication/guards/ws-auth.guard';
import { UseGuards } from '@nestjs/common';
import { WebsocketService } from '@src/websocket/websocket.service';
import { CONNECTION_STATUS } from '@src/websocket/websocket.enum';
import { Subscription } from 'rxjs';
import { GameCanceledData, MatchFoundData } from '@transcendence/db';
import { ClientGameEvents } from '@transcendence/db';
import { ServerGameEvents } from '@transcendence/db';
import { PlayersQueueStorage } from './players-queue.storage';

@WebSocketGateway()
export class MatchMakingGateway {
  private subscription!: Subscription;

  @WebSocketServer()
  server!: Server;

  constructor(
    private matchesService: MatchesService,
    private readonly websocketService: WebsocketService,
    private readonly playersQueue: PlayersQueueStorage,
  ) {}

  onApplicationShutdown(_signal?: string | undefined) {
    this.subscription.unsubscribe();
  }

  afterInit(_server: Server) {
    this.subscription = this.websocketService.getEventSubject$().subscribe({
      next: async (event) => {
        if (event.name === CONNECTION_STATUS.DISCONNECTED) {
          const user = event.data as ActiveUserData;
          await this.playersQueue.deletePlayerById(user.sub);
        }

        /**
         * if user exists in queue should be removed
         * when game canceled
         */
        if (event.name === ServerGameEvents.GAME_CANCELED) {
          const { canceledById } = event.data as GameCanceledData;
          await this.playersQueue.deletePlayerById(canceledById);
        }
      },
    });
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage(ClientGameEvents.JNRNDMCH)
  async JoinRandomMatch(@ConnectedSocket() client: Socket) {
    const user: ActiveUserData = client.data.user;

    //possible problem if user and adversary are the same
    const adversaryId = await this.playersQueue.getLast();

    // if same user
    if (user.sub === adversaryId) return;

    // send user to waiting page
    this.websocketService.addEvent([user.sub], ServerGameEvents.WAITING, null);

    if (adversaryId) {
      //if you found an already user waiting in the queue
      await this.playersQueue.deletePlayerById(adversaryId);

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
  }
}
