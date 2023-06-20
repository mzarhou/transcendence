import { Module, OnModuleDestroy, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { z } from 'zod';

export abstract class RedisClient extends Redis {}

const redisConfigSchema = z.object({
  REDIS_HOST: z.string().min(1),
  REDIS_PORT: z.string().regex(/\d+/).transform(Number),
});

const redisProvider: Provider = {
  provide: RedisClient,
  useFactory: async () => {
    await ConfigModule.envVariablesLoaded;
    const config = redisConfigSchema.parse(process.env);
    const redisClient: Redis = new Redis({
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
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
