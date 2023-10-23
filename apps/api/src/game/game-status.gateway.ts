import { Logger, OnApplicationShutdown } from '@nestjs/common';
import { OnGatewayInit, WebSocketGateway } from '@nestjs/websockets';
import { ChatService } from '@src/chat/chat.service';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { WebsocketEvent } from '@src/websocket/weboscket-event.interface';
import {
  CONNECTION_STATUS,
  NewSocketData,
} from '@src/websocket/websocket.enum';
import { WebsocketService } from '@src/websocket/websocket.service';
import { StartGameData } from '@transcendence/db';
import {
  GameOverData,
  InGameEventData,
  Match,
  ServerGameEvents,
} from '@transcendence/db';
import { Subscription } from 'rxjs';
import { z } from 'zod';
import { MatchesStorage } from './matches/matches.storage';

@WebSocketGateway()
export class GameStatusGateway implements OnGatewayInit, OnApplicationShutdown {
  private subscription!: Subscription;
  private readonly logger = new Logger(GameStatusGateway.name);

  constructor(
    private readonly websocketService: WebsocketService,
    private readonly chatService: ChatService,
    private readonly matchesStorage: MatchesStorage,
  ) {}

  onApplicationShutdown(_signal?: string | undefined) {
    this.subscription.unsubscribe();
  }

  afterInit(_server: any) {
    this.subscription = this.websocketService.getEventSubject$().subscribe({
      next: (event: WebsocketEvent) => {
        if (event.name === ServerGameEvents.STARTSGM) {
          const { match } = event.data as StartGameData;
          this.onStartGame(match);
        } else if (event.name === ServerGameEvents.GAMEOVER) {
          const { match } = event.data as GameOverData;
          const usersIdsResult = z.array(z.number()).safeParse(event.rooms);
          if (usersIdsResult.success) {
            this.onGameOver(match);
          }
        } else if (event.name === CONNECTION_STATUS.NEW_SOCKET) {
          const { user } = event.data as NewSocketData;
          this.onNewSocket(user);
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

  private async onNewSocket(user: ActiveUserData) {
    const friendIds = await this.getFriendsIds(user.sub);
    for (const fId of friendIds) {
      if (this.matchesStorage.isUserInGame(fId)) {
        this.websocketService.addEvent([user.sub], ServerGameEvents.IN_GAME, {
          inGame: true,
          friendId: fId,
        } satisfies InGameEventData);
      }
    }
  }
}
