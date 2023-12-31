import { WebSocketGateway, WsException } from '@nestjs/websockets';
import { WebsocketEvent } from '@src/websocket/weboscket-event.interface';
import { GameOverData, Match, ServerGameEvents } from '@transcendence/db';
import { RankService } from './rank.service';
import { Subscription } from 'rxjs';
import { WebsocketService } from '@src/websocket/websocket.service';

@WebSocketGateway()
export class RankGateway {
  private subscription!: Subscription;

  constructor(
    private readonly websocketService: WebsocketService,
    private readonly service: RankService,
  ) {}

  onApplicationShutdown(_signal?: string | undefined) {
    this.subscription.unsubscribe();
  }

  afterInit(_server: any) {
    this.subscription = this.websocketService.getEventSubject$().subscribe({
      next: async (event: WebsocketEvent) => {
        if (event.name === ServerGameEvents.GAMEOVER) {
          const { match } = event.data as GameOverData;
          await this.onGameOver(match);
        }
      },
    });
  }

  async onGameOver(match: Match) {
    try {
      await this.service.updateElo({
        matchId: match.matchId,
        winnerId: match.winnerId!,
      });
    } catch (e) {
      throw new WsException('Failed to update rank')
    }

  }
}
