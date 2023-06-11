import { Injectable } from '@nestjs/common';
import { RedisClient } from 'src/redis/redis.module';

export class InvalidateRefreshTokenError extends Error {}

@Injectable()
export class RefreshTokenIdsStorage {
  constructor(private readonly redisClient: RedisClient) {}

  async insert(userId: number, tokenId: string) {
    await this.redisClient.set(this.getKey(userId), tokenId);
  }

  async validate(userId: number, tokenId: string): Promise<boolean> {
    const storedTokenId = await this.redisClient.get(this.getKey(userId));
    if (storedTokenId !== tokenId) {
      throw new InvalidateRefreshTokenError();
    }
    return storedTokenId === tokenId;
  }

  async invalidate(userId: number) {
    await this.redisClient.del(this.getKey(userId));
  }

  private getKey(userId: number) {
    return `user-${userId}`;
  }
}
