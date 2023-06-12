import { Injectable } from '@nestjs/common';
import { RedisClient } from 'src/redis/redis.module';

export class InvalidateRefreshTokenError extends Error {}

export type RefreshTokenKey = {
  userId: number;
  userAgent: string;
  deviceId: string;
};

@Injectable()
export class RefreshTokenIdsStorage {
  constructor(private readonly redisClient: RedisClient) {}

  async insert(key: RefreshTokenKey, tokenId: string) {
    await this.redisClient.set(this.getKey(key), tokenId);
  }

  async get(key: RefreshTokenKey) {
    return this.redisClient.get(this.getKey(key));
  }

  async validate(key: RefreshTokenKey, tokenId: string): Promise<boolean> {
    const storedTokenId = await this.redisClient.get(this.getKey(key));
    if (storedTokenId !== tokenId) {
      throw new InvalidateRefreshTokenError();
    }
    return storedTokenId === tokenId;
  }

  async invalidate(key: RefreshTokenKey) {
    await this.redisClient.del(this.getKey(key));
  }

  private getKey({ userId, userAgent, deviceId }: RefreshTokenKey) {
    return `user-${userId}--${userAgent}--${deviceId}`;
  }
}
