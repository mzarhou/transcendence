import { Module } from '@nestjs/common';
import { FriendRequestService } from './friend-request/friend-request.service';
import { FriendRequestController } from './friend-request/friend-request.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { IamModule } from 'src/iam/iam.module';

@Module({
  controllers: [FriendRequestController, ChatController],
  providers: [FriendRequestService, ChatService],
  imports: [PrismaModule],
  exports: [ChatService],
})
export class ChatModule {}
