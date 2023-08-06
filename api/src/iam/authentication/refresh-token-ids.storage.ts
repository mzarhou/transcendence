import { Injectable } from '@nestjs/common';
import { RedisClient } from 'src/redis/redis.module';

export class InvalidateRefreshTokenError extends Error {}

@Injectable()
export class RefreshTokenIdsStorage {
  constructor(private readonly redisClient: RedisClient) {}

  async insert(userId: number, fingerprintHash: string, tokenId: string) {
    await this.redisClient.set(this.getKey(userId, fingerprintHash), tokenId);
  }

  async validate(
    userId: number,
    fingerprintHash: string,
    tokenId: string,
  ): Promise<boolean> {
    const storedTokenId = await this.redisClient.get(
      this.getKey(userId, fingerprintHash),
    );
    if (!storedTokenId || storedTokenId !== tokenId) {
      throw new InvalidateRefreshTokenError();
    }
    return storedTokenId === tokenId;
  }

  async invalidate(userId: number, fingerprintHash: string) {
    await this.redisClient.del(this.getKey(userId, fingerprintHash));
  }

  private getKey(userId: number, fingerprintHash: string) {
    return `user-${userId}-${fingerprintHash}`;
  }
}
