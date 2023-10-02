import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { IamModule } from './iam/iam.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { RedisModule } from './redis/redis.module';
import { PrismaModule } from './+prisma/prisma.module';
import { ChatModule } from './chat/chat.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MessageModule } from './message/message.module';
import { FriendRequestModule } from './friend-request/friend-request.module';
import { GroupsModule } from './groups/groups.module';
import { WebsocketModule } from './websocket/websocket.module';
import { ZodExceptionFilter } from './+common/filters/zod-exception.filter';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(),
    IamModule,
    RedisModule,
    PrismaModule,
    ChatModule,
    NotificationsModule,
    MessageModule,
    FriendRequestModule,
    GroupsModule,
    WebsocketModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: ZodExceptionFilter,
    },
  ],
})
export class AppModule {}
