import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageGateway } from './message.gateway';
import { MessageService } from './message.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { IamModule } from 'src/iam/iam.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  controllers: [MessageController],
  providers: [MessageGateway, MessageService],
  imports: [PrismaModule, IamModule, NotificationsModule, ChatModule],
})
export class MessageModule {}
