import { Injectable } from '@nestjs/common';
import { RedisClient } from '@src/redis/redis.module';
import { randomUUID } from 'crypto';
import {
  GameInvitation,
  gameInvitationSchema,
} from './game-invitation.interface';

@Injectable()
export class GameInvitationsStorage {
  constructor(private readonly redisClient: RedisClient) {}

  private getKey(id: string) {
    return `game-invitations:${id}`;
  }

  async create(data: GameInvitation) {
    const invitationId = randomUUID();
    await this.redisClient.set(
      this.getKey(invitationId),
      JSON.stringify(data),
      'EX',
      60,
    ); // 10 seconds
    return invitationId;
  }

  async get(invitationId: string) {
    const data = await this.redisClient.get(this.getKey(invitationId));
    if (!data) return null;
    const result = gameInvitationSchema.safeParse(JSON.parse(data));
    if (result.success) return result.data;
    return null;
  }
}
