import { Module } from '@nestjs/common';
import { FriendRequestService } from './friend-request/friend-request.service';
import { FriendRequestController } from './friend-request/friend-request.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  controllers: [FriendRequestController, ChatController],
  providers: [FriendRequestService, ChatService],
  imports: [PrismaModule],
})
export class ChatModule {}
