import { Logger, OnApplicationShutdown } from '@nestjs/common';
import { OnGatewayInit, WebSocketGateway } from '@nestjs/websockets';
import { ChatService } from '@src/chat/chat.service';
import { WebsocketEvent } from '@src/websocket/weboscket-event.interface';
import { WebsocketService } from '@src/websocket/websocket.service';
import {
  GameOverData,
  InGameEventData,
  Match,
  MatchFoundData,
  ServerGameEvents,
} from '@transcendence/db';
import { Subscription } from 'rxjs';
import { z } from 'zod';

@WebSocketGateway()
export class GameStatusGateway implements OnGatewayInit, OnApplicationShutdown {
  private subscription!: Subscription;
  private readonly logger = new Logger(GameStatusGateway.name);

  constructor(
    private readonly websocketService: WebsocketService,
    private readonly chatService: ChatService,
  ) {}

  onApplicationShutdown(_signal?: string | undefined) {
    this.subscription.unsubscribe();
  }

  afterInit(_server: any) {
    this.subscription = this.websocketService.getEventSubject$().subscribe({
      next: (event: WebsocketEvent) => {
        if (event.name === ServerGameEvents.MCHFOUND) {
          const { match } = event.data as MatchFoundData;
          this.onStartGame(match);
        } else if (event.name === ServerGameEvents.GAMEOVER) {
          const { match } = event.data as GameOverData;
          const usersIdsResult = z.array(z.number()).safeParse(event.rooms);
          if (usersIdsResult.success) {
            this.onGameOver(match);
          }
        }
      },
    });
  }

  private async getFriendsIds(userId: number) {
    const friends = await this.chatService.findFriends({
      sub: userId,
    });
    return friends.map((u) => u.id);
  }

  private async onStartGame({ matchId, homeId, adversaryId }: Match) {
    this.logger.debug('---------------------------');
    this.logger.debug('Match Start: ', matchId);
    this.logger.debug('homeId: ', homeId);
    this.logger.debug('adversaryId: ', adversaryId);
    this.websocketService.addEvent(
      await this.getFriendsIds(homeId),
      ServerGameEvents.IN_GAME,
      { inGame: true, friendId: homeId } satisfies InGameEventData,
    );
    this.websocketService.addEvent(
      await this.getFriendsIds(adversaryId),
      ServerGameEvents.IN_GAME,
      { inGame: true, friendId: adversaryId } satisfies InGameEventData,
    );
  }

  private async onGameOver({ matchId, homeId, adversaryId, winnerId }: Match) {
    this.logger.debug('---------------------------');
    this.logger.debug('Game Over: ', matchId);
    this.logger.debug('Winner: ', winnerId);
    this.websocketService.addEvent(
      await this.getFriendsIds(homeId),
      ServerGameEvents.IN_GAME,
      { inGame: false, friendId: homeId } satisfies InGameEventData,
    );
    this.websocketService.addEvent(
      await this.getFriendsIds(adversaryId),
      ServerGameEvents.IN_GAME,
      { inGame: false, friendId: adversaryId } satisfies InGameEventData,
    );
  }
}
