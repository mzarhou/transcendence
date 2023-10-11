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

@WebSocketGateway()
export class MatchMakingGateway {
  @WebSocketServer()
  server!: Server;
  queue: queueArr = new queueArr();

  constructor(private matchesService: MatchesService) {}

  handleDisconnect(client: any) {
    this.queue.deletePlayer(client);
  }

  //use the right Auth for the guard to authenticate the client
  // @UseGuards(Auth)  => to do

  @UseGuards(WsAuthGuard)
  @SubscribeMessage(EventGame.JNRNDMCH)
  async JoinRandomMatch(@ConnectedSocket() client: Socket) {
    console.log('joinRandomMatch\n');
    const user: ActiveUserData = client.data.user;
    //possible problem if user and adversary are the same
    const adversary = this.queue.players.find(
      (player) => player.id !== user.sub,
    );

    console.log('client: ', client.id + '\n');
    console.log('adversary: ', adversary?.socketId + '\n');
    if (adversary) {
      //if you found an already user waiting in the queue
      this.queue.deletePlayerById(adversary.id);

      //create a match between user and adversary => to do
      const match = await this.matchesService.create(user.sub, adversary.id);

      //emit event to client
      this.server.to(client.id).emit(EventGame.MCHFOUND, { match: match });

      //emit event to adversary
      this.server
        .to(adversary.socketId)
        .emit(EventGame.MCHFOUND, { match: match });
    } else {
      this.queue.addPlayer(user.sub, client);
    }
  }
}
