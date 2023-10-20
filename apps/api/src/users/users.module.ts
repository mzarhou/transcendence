import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './repositories/users.repository';
import { UsersPrismaRepository } from './repositories/users-prisma.repository';
import { RedisModule } from '@src/redis/redis.module';
import { FirstSigninStorage } from './first-signin.storage';

@Module({
  imports: [RedisModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    FirstSigninStorage,
    {
      provide: UsersRepository,
      useClass: UsersPrismaRepository,
    },
  ],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
