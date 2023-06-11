import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class OtpSecretsStorage
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private redisClient!: Redis;

  onApplicationBootstrap() {
    this.redisClient = new Redis({
      host: 'localhost',
      port: 6379,
    });
  }

  onApplicationShutdown(signal?: string | undefined) {
    this.redisClient.quit();
  }

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
