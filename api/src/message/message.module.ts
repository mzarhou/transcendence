import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageGateway } from './message.gateway';
import { MessageService } from './message.service';
import { IamModule } from '@src/iam/iam.module';
import { ChatModule } from '@src/chat/chat.module';
import { MessagesRepository } from './repositories/messages.repository';
import { MessagesPrismaRepository } from './repositories/messages-prisma.repository';
import { MessagesPolicy } from './message.policy';

@Module({
  imports: [IamModule, ChatModule],
  controllers: [MessageController],
  providers: [
    MessageGateway,
    MessageService,
    MessagesPolicy,
    {
      provide: MessagesRepository,
      useClass: MessagesPrismaRepository,
    },
  ],
})
export class MessageModule {}
