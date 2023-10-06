import {
  ConnectedSocket,
  OnGatewayDisconnect,
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

@WebSocketGateway()
export class MatchMakingGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  queue: queueArr = new queueArr();
  server!: Server;

  constructor(private matchesService: MatchesService) {}

  handleDisconnect(client: any) {
    this.queue.deletePlayer(client);
  }

  //use the right Auth for the guard to authenticate the client
  // @UseGuards(Auth)  => to do
  @UseGuards(WsAuthGuard)
  @SubscribeMessage('makeMatch')
  async makeMatch(@ConnectedSocket() client: Socket) {
    const user: ActiveUserData = client.data.user;

    //possible problem if user and adversary are the same
    const adversary = this.queue.players[0];
    if (adversary) {
      //if you found an already user waiting in the queue
      this.queue.deletePlayerById(adversary.id);

      //create a match between user and adversary => to do
      const match = await this.matchesService.create(user.sub, adversary.id);

      //emit event to client
      this.server.to(client.id).emit('matchingFound', { id: match.matchId });

      //emit event to adversary
      this.server
        .to(adversary.socketId)
        .emit('matchingFound', { id: match.matchId });
    } else {
      this.queue.addPlayer(user.sub, client);
    }
  }
}