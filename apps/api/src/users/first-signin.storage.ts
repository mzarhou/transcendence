import { Injectable } from '@nestjs/common';
import { RedisClient } from '@src/redis/redis.module';

@Injectable()
export class FirstSigninStorage {
  constructor(private readonly redisClient: RedisClient) {}

  async setAsSignedIn(userId) {
    await this.redisClient.set(this.getKey(userId), 1);
  }

  async isFirstSignin(userId) {
    const val = await this.redisClient.get(this.getKey(userId));
    return val === null;
  }

  private getKey(userId) {
    return `users:${userId}:fist_sign`;
  }
}
