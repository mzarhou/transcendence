import { Injectable } from '@nestjs/common';
import { RedisClient } from 'src/redis/redis.module';

@Injectable()
export class OtpSecretsStorage {
  constructor(private readonly redisClient: RedisClient) {}

  async insert(userId: number, secret: string) {
    await this.redisClient.set(this.getKey(userId), secret);
  }

  async invalidate(userId: number) {
    await this.redisClient.del(this.getKey(userId));
  }

  get(userId: number) {
    return this.redisClient.get(this.getKey(userId));
  }

  private getKey(userId: number) {
    return `2fa-secret-user-${userId}`;
  }
}
