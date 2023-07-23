import { Module, forwardRef } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsClientsStorage } from './notifications-clients.storage';
import { NotificationsGateway } from './notifications.gateway';
import { IamModule } from 'src/iam/iam.module';
import { ChatModule } from 'src/chat/chat.module';
import { NotificationsController } from './notifications.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, IamModule, forwardRef(() => ChatModule)],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationsClientsStorage,
    NotificationsGateway,
    NotificationsService,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
