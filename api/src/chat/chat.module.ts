import { Module } from '@nestjs/common';
import { FriendRequestService } from './friend-request/friend-request.service';
import { FriendRequestController } from './friend-request/friend-request.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { IamModule } from 'src/iam/iam.module';
import { MessageService } from './message/message.service';
import { MessageGateway } from './message/message.gateway';
import { MessageController } from './message/message.controller';

@Module({
  controllers: [FriendRequestController, ChatController, MessageController],
  providers: [
    FriendRequestService,
    ChatService,
    MessageGateway,
    MessageService,
  ],
  imports: [PrismaModule, IamModule],
})
export class ChatModule {}
