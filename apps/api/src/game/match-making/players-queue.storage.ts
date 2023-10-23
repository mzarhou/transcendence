import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { RedisClient } from '@src/redis/redis.module';
import { WebsocketService } from '@src/websocket/websocket.service';
import { MatchFoundData, ServerGameEvents, GameCanceledData } from '@transcendence/db';
import { Subscription } from 'rxjs';
import { CONNECTION_STATUS } from '@src/websocket/websocket.enum';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';

@Injectable()
export class PlayersQueueStorage implements OnApplicationShutdown {
  private readonly PlayersQueueKey = 'players-queue';

  private subscription!: Subscription;

  constructor(private readonly redisClient: RedisClient,
    private readonly websocketService: WebsocketService) {
    this.subscription = this.websocketService.getEventSubject$().subscribe({
      next: async (event) => {
        if (event.name === ServerGameEvents.MCHFOUND) {
          const data = event.data as MatchFoundData;
          console.log({ data });
          await this.deletePlayerById(data.match.adversaryId);
          await this.deletePlayerById(data.match.homeId);
        }
        if (event.name === CONNECTION_STATUS.DISCONNECTED) {
          const user = event.data as ActiveUserData;
          await this.deletePlayerById(user.sub);
        }
        /**
         * if user exists in queue should be removed
         * when game canceled
         */
        if (event.name === ServerGameEvents.GAME_CANCELED) {
          const { canceledById } = event.data as GameCanceledData;
          await this.deletePlayerById(canceledById);
        }
      },
    });
  }

  onApplicationShutdown(_signal?: string | undefined) {
    this.subscription.unsubscribe();
  }

  async addPlayer(playerId: number) {
    await this.redisClient.sadd(this.PlayersQueueKey, playerId);
  }

  private async deletePlayerById(playerId: number) {
    await this.redisClient.srem(this.PlayersQueueKey, playerId);
  }

  async getLast() {
    const playerIds = (
      await this.redisClient.smembers(this.PlayersQueueKey)
    ).map(Number);
    if (playerIds.length) return playerIds[0];
    return null;
  }

  async getAll() {
    const playerIds = (
      await this.redisClient.smembers(this.PlayersQueueKey)
    ).map(Number);
    return playerIds;
  }
}
