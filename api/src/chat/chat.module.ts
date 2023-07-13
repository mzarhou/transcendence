import { Module } from '@nestjs/common';
import { FriendRequestService } from './friend-request/friend-request.service';
import { FriendRequestController } from './friend-request/friend-request.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatController } from './chat.controller';

@Module({
  controllers: [FriendRequestController, ChatController],
  providers: [FriendRequestService],
  imports: [PrismaModule],
})
export class ChatModule {}
