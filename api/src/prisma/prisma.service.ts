import {
  INestApplication,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }

  async cleanDb() {
    if (process.env.NODE_ENV === 'production') return;
    const models = Reflect.ownKeys(this).filter((key) => {
      return !['_', '$'].includes(key[0]) && typeof key !== 'symbol';
    });
    return Promise.all(
      models.map((modelKey) => {
        try {
          return this[modelKey].deleteMany();
        } catch (error) {
          console.log({ modelKey });
          return new Promise((res) => {
            res(undefined);
          });
        }
      }),
    );
  }
}
