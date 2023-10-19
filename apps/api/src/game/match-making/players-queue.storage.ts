import { Injectable, Logger } from '@nestjs/common';
import { RedisClient } from '@src/redis/redis.module';

@Injectable()
export class PlayersQueueStorage {
  private readonly PlayersQueueKey = 'players-queue';

  constructor(private readonly redisClient: RedisClient) {}

  async addPlayer(playerId: number) {
    await this.redisClient.sadd(this.PlayersQueueKey, playerId);
  }

  async deletePlayerById(playerId: number) {
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
