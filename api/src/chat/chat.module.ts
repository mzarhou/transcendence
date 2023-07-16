import { Module } from '@nestjs/common';
import { FriendRequestService } from './friend-request/friend-request.service';
import { FriendRequestController } from './friend-request/friend-request.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { IamModule } from 'src/iam/iam.module';

@Module({
  controllers: [FriendRequestController, ChatController],
  providers: [FriendRequestService, ChatService, ChatGateway],
  imports: [PrismaModule, IamModule],
})
export class ChatModule {}
