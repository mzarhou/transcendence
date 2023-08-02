import { Module, OnModuleDestroy, Provider } from '@nestjs/common';
import Redis from 'ioredis';
import { env } from 'src/env/server';

export abstract class RedisClient extends Redis {}

const redisProvider: Provider = {
  provide: RedisClient,
  useFactory: async () => {
    const redisClient: Redis = new Redis({
      host: env.REDISHOST,
      port: env.REDISPORT,
      password: env.REDISPASSWORD,
      username: env.REDISUSER,
      connectTimeout: 10000,
    });
    return redisClient;
  },
};

@Module({
  providers: [redisProvider],
  exports: [redisProvider],
})
export class RedisModule implements OnModuleDestroy {
  constructor(private redisClient: RedisClient) {}

  async onModuleDestroy() {
    await this.redisClient.quit();
  }
}
