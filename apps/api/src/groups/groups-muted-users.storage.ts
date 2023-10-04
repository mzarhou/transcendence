import { Injectable } from '@nestjs/common';
import { RedisClient } from '@src/redis/redis.module';

@Injectable()
export class GroupsMutedUsersStorage {
  constructor(private readonly redisClient: RedisClient) {}

  // get(groupId: number): number[] {
  //   const usersIds = this.redisClient.
  // }

  /**
   *  time in secondes
   */
  async add(data: { userId: number; groupId: number; time: number }) {
    await this.redisClient.set(this.getKey(data), 1, 'EX', data.time);
  }

  async del(data: { userId: number; groupId: number }) {
    await this.redisClient.del(this.getKey(data));
  }

  async isUserMuted(data: { userId: number; groupId: number }) {
    const result = await this.redisClient.exists(this.getKey(data));
    return result != 0;
  }

  private getKey(data: { groupId: number; userId: number }) {
    return `groups:${data.groupId}:muted:${data.userId}`;
  }
}
