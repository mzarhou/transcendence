import {
  ConnectedSocket,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { queueArr } from './entities/queue.entity';
import { MatchesService } from '@src/game/matches/matches.service';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { WsAuthGuard } from '@src/iam/authentication/guards/ws-auth.guard';
import { UseGuards } from '@nestjs/common';
import { EventGame } from '../gameplay/utils';
import { WebsocketService } from '@src/websocket/websocket.service';
import { CONNECTION_STATUS } from '@src/websocket/websocket.enum';
import { Subscription } from 'rxjs';

@WebSocketGateway()
export class MatchMakingGateway {
  private subscription!: Subscription;

  @WebSocketServer()
  server!: Server;
  queue: queueArr = new queueArr();

  constructor(
    private matchesService: MatchesService,
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
          this.queue.deletePlayerById(user.sub);
        }
      },
    });
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage(EventGame.JNRNDMCH)
  async JoinRandomMatch(@ConnectedSocket() client: Socket) {
    console.log('joinRandomMatch\n');
    const user: ActiveUserData = client.data.user;
    //possible problem if user and adversary are the same
    const adversaryId = Array.from(this.queue.players)[0] as number | undefined;

    console.log('before: ', {
      homeId: user.sub,
      adversaryId,
      players: this.queue.players,
    });

    // if same user
    if (user.sub === adversaryId) return;

    // console.log('client: ', client.id + '\n');
    // console.log('adversary: ', adversary?.socketId + '\n');
    if (adversaryId) {
      //if you found an already user waiting in the queue
      this.queue.deletePlayerById(adversaryId);

      //create a match between user and adversary => to do
      const match = await this.matchesService.create(user.sub, adversaryId);

      //emit event to players
      this.websocketService.addEvent(
        [adversaryId, user.sub],
        EventGame.MCHFOUND,
        { match: match },
      );
    } else {
      this.queue.addPlayer(user.sub);
    }
    console.log('after:', {
      homeId: user.sub,
      adversaryId,
      players: this.queue.players,
    });
  }
}
