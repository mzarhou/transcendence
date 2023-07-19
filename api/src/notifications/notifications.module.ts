import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsClientsStorage } from './notifications-clients.storage';
import { NotificationsGateway } from './notifications.gateway';
import { IamModule } from 'src/iam/iam.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [IamModule, ChatModule],
  providers: [
    NotificationsService,
    NotificationsClientsStorage,
    NotificationsGateway,
    NotificationsService,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
