import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { FriendRequestModule } from '@src/friend-request/friend-request.module';
import { UsersModule } from '@src/users/users.module';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [FriendRequestModule, UsersModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
